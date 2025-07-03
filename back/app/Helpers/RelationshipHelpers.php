<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

use Illuminate\Support\Arr;

/**
 * Returns a fresh query for the relation
 * 
 * @param HasMany $relation The HasMany relationship to get a fresh query for
 * @return \Illuminate\Database\Eloquent\Builder The fresh query
 */
function freshRelationQuery(HasMany $relation)
{
    return $relation->getModel()->newQuery()
        ->where($relation->getForeignKeyName(), $relation->getParent()->getKey());
}

/**
 * Synchronizes a HasMany relationship with given items
 * 
 * Updates existing records, creates new ones, and removes records not present in the input array
 * 
 * @param HasMany $relation The HasMany relationship to sync
 * @param array $items Array of items to sync
 * @param array $fillable Array of fields that can be filled
 */
function sync_has_many(HasMany $relation, array $items, array $fillable = [])
{
    $existingIds = $relation->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($items as $item) {
        if (!empty($item['id']) && in_array($item['id'], $existingIds)) {
            freshRelationQuery($relation)->where('id', $item['id'])->update(Arr::only($item, $fillable));
            $submittedIds[] = $item['id'];
        } else {
            $new = $relation->create(Arr::only($item, $fillable));
            $submittedIds[] = $new->id;
        }
    }

    freshRelationQuery($relation)->whereNotIn('id', $submittedIds)->delete();
}

/**
 * Synchronizes a MorphMany relationship with given items
 * 
 * Updates existing records, creates new ones, and removes records not present in the input array
 * Supports both direct field access and field mapping from nested structures
 * 
 * @param MorphMany $relation The MorphMany relationship to sync
 * @param array $items Array of items to sync
 * @param array $fields Array of fields to process. Supports two formats:
 *                     - Direct: ['field_name'] - treated as 'field_name' => 'field_name'
 *                     - Mapping: ['db_field' => 'input.path'] - maps nested input to db field
 *                     - Mixed: ['db_field' => 'input.path', 'direct_field']
 */
function sync_morph_many(MorphMany $relation, array $items, array $fields = [])
{
    // Normalize fields array to handle both formats
    $fieldMapping = [];
    foreach ($fields as $key => $value) {
        if (is_numeric($key)) {
            // Direct field: ['field_name'] -> 'field_name' => 'field_name'
            $fieldMapping[$value] = $value;
        } else {
            // Mapping: ['db_field' => 'input.path']
            $fieldMapping[$key] = $value;
        }
    }

    // Transform items using the field mapping
    $transformedItems = array_map(function ($item) use ($fieldMapping) {
        $transformed = [];

        // Always include ID if present for updates
        if (!empty($item['id'])) {
            $transformed['id'] = $item['id'];
        }

        // Map fields according to the mapping configuration
        foreach ($fieldMapping as $dbField => $inputPath) {
            // Use a sentinel value to check if the path exists in the input
            $sentinel = new \stdClass();
            $value = data_get($item, $inputPath, $sentinel);

            // Only include the field if the path exists in the input (even if value is null)
            if ($value !== $sentinel) {
                $transformed[$dbField] = $value;
            }
        }

        return $transformed;
    }, $items);

    // Process the transformed items
    $existingIds = $relation->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($transformedItems as $item) {
        if (!empty($item['id']) && in_array($item['id'], $existingIds)) {
            $relation->getModel()->newQuery()
                ->where('id', $item['id'])
                ->where($relation->getMorphType(), $relation->getMorphClass())
                ->where($relation->getForeignKeyName(), $relation->getParentKey())
                ->update(Arr::only($item, array_keys($fieldMapping)));
            $submittedIds[] = $item['id'];
        } else {
            $new = $relation->create(Arr::only($item, array_keys($fieldMapping)));
            $submittedIds[] = $new->id;
        }
    }

    $relation->getModel()->newQuery()
        ->where($relation->getMorphType(), $relation->getMorphClass())
        ->where($relation->getForeignKeyName(), $relation->getParentKey())
        ->whereNotIn('id', $submittedIds)
        ->delete();
}
