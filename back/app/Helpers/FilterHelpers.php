<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Applies simple filters to a query builder based on a mapping of request parameter names
 * to database columns.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $simpleFilters Array mapping request parameter names to database columns
 * @return \Illuminate\Database\Query\Builder
 */
function apply_simple_filters($query, string $modelClass, array $request, array $simpleFilters)
{
    $mainModel = new $modelClass();
    $tableName = $mainModel->getTable();

    foreach ($simpleFilters as $param => $column) {
        if (!empty($request[$param])) {
            $query->whereIn("$tableName.$column", $request[$param]);
        }
    }

    return $query;
}

/**
 * Applies range filters to a query builder based on a mapping of request parameter names
 * to database columns.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $rangeFilters Array mapping request parameter names to database columns
 * @return \Illuminate\Database\Query\Builder
 */
function apply_range_filters($query, string $modelClass, array $request, array $rangeFilters)
{
    $mainModel = new $modelClass();
    $tableName = $mainModel->getTable();

    foreach ($rangeFilters as $param => $column) {
        if (!empty($request[$param]) && count($request[$param]) === 2) {
            $query->whereBetween("$tableName.$column", $request[$param]);
        }
    }

    return $query;
}

/**
 * Applies relationship filters to exclude records based on the presence or absence
 * of related models from the specified relationship method names.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $relationshipFilters Array mapping filter names to arrays of relationship method names
 * @return \Illuminate\Database\Query\Builder
 */
function apply_missing_morph_many_relationship_filters($query, string $modelClass, array $request, array $relationshipFilters)
{
    $mainModel = new $modelClass();
    $tableName = $mainModel->getTable();
    $morphKey = $mainModel->getMorphClass();

    foreach ($relationshipFilters as $filterName => $relationshipMethods) {
        if (!isset($request[$filterName]) || !filter_var($request[$filterName], FILTER_VALIDATE_BOOLEAN)) {
            continue;
        }

        foreach ($relationshipMethods as $relationshipMethod) {
            if (!method_exists($mainModel, $relationshipMethod)) {
                throw new InvalidArgumentException("Method '$relationshipMethod' does not exist on model '$modelClass'.");
            }

            $relationshipObject = $mainModel->$relationshipMethod();

            if (!$relationshipObject instanceof MorphMany) {
                throw new InvalidArgumentException("Method '$relationshipMethod' must return a MorphMany relation.");
            }

            $relationshipTable = $relationshipObject->getRelated()->getTable();
            $foreignKey = $relationshipObject->getForeignKeyName();
            $typeKey = $relationshipObject->getMorphType();

            $query->whereNotExists(function ($sub) use ($tableName, $morphKey, $relationshipTable, $foreignKey, $typeKey) {
                $sub->select(DB::raw(1))
                    ->from($relationshipTable)
                    ->whereColumn("$relationshipTable.$foreignKey", "$tableName.id")
                    ->where("$relationshipTable.$typeKey", $morphKey);
            });
        }
    }

    return $query;
}
