<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Relations\HasMany;
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
 * 
 * @param \Illuminate\Database\Eloquent\Relations\MorphMany $relation The MorphMany relationship to sync
 * @param array $items Array of items to sync
 * @param array $fillable Array of fields that can be filled
 */
function sync_morph_many(\Illuminate\Database\Eloquent\Relations\MorphMany $relation, array $items, array $fillable = [])
{
    $existingIds = $relation->pluck('id')->toArray();
    $submittedIds = [];

    foreach ($items as $item) {
        if (!empty($item['id']) && in_array($item['id'], $existingIds)) {
            $relation->getModel()->newQuery()
                ->where('id', $item['id'])
                ->where($relation->getMorphType(), $relation->getMorphClass())
                ->where($relation->getForeignKeyName(), $relation->getParentKey())
                ->update(Arr::only($item, $fillable));
            $submittedIds[] = $item['id'];
        } else {
            $new = $relation->create(Arr::only($item, $fillable));
            $submittedIds[] = $new->id;
        }
    }

    $relation->getModel()->newQuery()
        ->where($relation->getMorphType(), $relation->getMorphClass())
        ->where($relation->getForeignKeyName(), $relation->getParentKey())
        ->whereNotIn('id', $submittedIds)
        ->delete();
}
