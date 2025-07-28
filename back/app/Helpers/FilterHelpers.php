<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;

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
 * of related models from the specified relationship model classes.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $relationshipFilters Array mapping filter names to arrays of relationship model classes
 * @return \Illuminate\Database\Query\Builder
 */
function apply_relationship_filters($query, string $modelClass, array $request, array $relationshipFilters)
{
    foreach ($relationshipFilters as $filterName => $relationshipClasses) {
        if (isset($request[$filterName]) && ($request[$filterName] === true || $request[$filterName] === 'true')) {
            $mainModel = new $modelClass();
            $tableName = $mainModel->getTable();
            $morphKey = $mainModel->getMorphClass();

            foreach ($relationshipClasses as $relationshipClass) {
                $relationshipModel = new $relationshipClass();
                $relationshipTable = $relationshipModel->getTable();

                // Find the relationship method on the main model that returns this relationship class
                $relationshipObject = null;

                // Get all methods from the main model to find the matching relationship
                $reflection = new \ReflectionClass($mainModel);
                foreach ($reflection->getMethods(\ReflectionMethod::IS_PUBLIC) as $method) {
                    if ($method->getNumberOfParameters() === 0 && !$method->isStatic()) {
                        try {
                            $result = $method->invoke($mainModel);
                            if ($result instanceof MorphMany) {
                                if ($result->getRelated() instanceof $relationshipClass) {
                                    $relationshipObject = $result;
                                    break;
                                }
                            }
                        } catch (\Exception $e) {
                            // Skip methods that throw exceptions
                            continue;
                        }
                    }
                }

                if ($relationshipObject) {
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
        }
    }

    return $query;
}
