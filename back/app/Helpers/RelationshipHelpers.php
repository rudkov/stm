<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Normalizes an array of fields/pivot values so that both direct keys and key=>path
 * mapping are represented uniformly as ['db_field' => 'input.path'].
 *
 * Example:
 *   ['job_title', 'cost' => 'pricing.cost']
 * becomes:
 *   ['job_title' => 'job_title', 'cost' => 'pricing.cost']
 *
 * @param array $fields
 * @return array<string,string>
 */
function normalizeFieldMapping(array $fields): array
{
    $mapping = [];

    foreach ($fields as $key => $value) {
        if (is_numeric($key)) {
            // Direct field name supplied – use it for both key and path
            $mapping[$value] = $value;
        } else {
            // Explicit mapping provided – keep as-is
            $mapping[$key] = $value;
        }
    }

    return $mapping;
}

/**
 * Extracts values from a given input array using a mapping definition produced by
 * normalizeFieldMapping(). Only keys that are actually present in the input will
 * be returned (even if they are present but null).
 *
 * @param array<string,string> $mapping
 * @param array $input
 * @return array<string,mixed>
 */
function extractMappedValues(array $mapping, array $input): array
{
    $sentinel = new \stdClass();
    $result   = [];

    foreach ($mapping as $dbField => $inputPath) {
        $value = data_get($input, $inputPath, $sentinel);
        if ($value !== $sentinel) {
            $result[$dbField] = $value;
        }
    }

    return $result;
}

/**
 * Returns a query builder scoped to the current relation for safe updates & deletes.
 * Works for HasMany and MorphMany relations.
 *
 * @param HasMany|MorphMany $relation
 * @return \Illuminate\Database\Eloquent\Builder
 */
function scopedRelationQuery($relation)
{
    if ($relation instanceof HasMany) {
        return $relation->getModel()->newQuery()
            ->where($relation->getForeignKeyName(), $relation->getParent()->getKey());
    }

    if ($relation instanceof MorphMany) {
        return $relation->getModel()->newQuery()
            ->where($relation->getMorphType(), $relation->getMorphClass())
            ->where($relation->getForeignKeyName(), $relation->getParentKey());
    }

    throw new \InvalidArgumentException('Unsupported relation type for scoped query.');
}

/**
 * Generic synchronisation helper for Laravel relations (BelongsToMany, HasMany, MorphMany).
 *
 * It keeps related data in sync with the provided $items collection by performing
 * the minimal set of create / update / delete operations.
 *
 * For BelongsToMany:
 *  - $fields is treated as pivot mapping (see normalizeFieldMapping())
 *  - $options['keyField'] may specify the key in $items pointing to related model ID (defaults to 'id')
 *
 * For HasMany:
 *  - $fields represents the fillable attributes that can be mass-assigned on the related model
 *
 * For MorphMany:
 *  - $fields is a mapping describing how to take input values and map them onto DB columns
 *
 * @param BelongsToMany|HasMany|MorphMany $relation
 * @param array $items
 * @param array $fields
 * @param array $options
 * @return void
 */
function sync_relation($relation, array $items, array $fields = [], array $options = []): void
{
    // Normalise field mapping once for all relation types
    $mapping = normalizeFieldMapping($fields);
    // --------------------------------------------------
    // BelongsToMany
    // --------------------------------------------------
    if ($relation instanceof BelongsToMany) {
        $keyField = $options['keyField'] ?? 'id';
        $syncData = [];

        foreach ($items as $item) {
            if (empty($item[$keyField])) {
                continue; // Skip invalid items
            }

            $itemId    = $item[$keyField];
            $pivotData = extractMappedValues($mapping, $item);

            $syncData[$itemId] = $pivotData;
        }

        $relation->sync($syncData);
        return;
    }

    // Pre-calculate helpers for HasMany and MorphMany
    if ($relation instanceof HasMany || $relation instanceof MorphMany) {
        $transform  = static function (array $item) use ($mapping): array {
            return extractMappedValues($mapping, $item);
        };
        $scopedBase = function () use ($relation) {
            return scopedRelationQuery($relation);
        };
    } else {
        throw new \InvalidArgumentException('Unsupported relation type for sync_relation.');
    }

    $existingIds = $relation->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($items as $item) {
        $hasId = !empty($item['id']) && in_array($item['id'], $existingIds, true);

        if ($hasId) {
            // Update existing record
            $updateData = $transform($item);

            // Never attempt to update the primary key itself
            unset($updateData['id']);

            if (!empty($updateData)) {
                ($scopedBase())->where('id', $item['id'])->update($updateData);
            }
            $submittedIds[] = $item['id'];
        } else {
            // Create new record
            $new = $relation->create($transform($item));
            $submittedIds[] = $new->id;
        }
    }

    // Delete records that were not submitted
    if (!empty($submittedIds)) {
        ($scopedBase())->whereNotIn('id', $submittedIds)->delete();
    } else {
        // If no items submitted, wipe all existing
        ($scopedBase())->delete();
    }
}
