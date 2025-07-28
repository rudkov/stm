<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;

/**
 * Applies simple filters to a query builder based on a mapping of database columns
 * to request parameter names.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $simpleFilters Array mapping database columns to request parameter names
 * @return \Illuminate\Database\Query\Builder
 */
function apply_simple_filters($query, string $modelClass, array $request, array $simpleFilters)
{
    $mainModel = new $modelClass();
    $tableName = $mainModel->getTable();

    foreach ($simpleFilters as $column => $param) {
        if (!empty($request[$param])) {
            $query->whereIn("$tableName.$column", $request[$param]);
        }
    }

    return $query;
}

/**
 * Applies range filters to a query builder based on a mapping of database columns
 * to request parameter names.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $rangeFilters Array mapping database columns to request parameter names
 * @return \Illuminate\Database\Query\Builder
 */
function apply_range_filters($query, string $modelClass, array $request, array $rangeFilters)
{
    $mainModel = new $modelClass();
    $tableName = $mainModel->getTable();

    foreach ($rangeFilters as $column => $param) {
        if (!empty($request[$param]) && count($request[$param]) === 2) {
            $query->whereBetween("$tableName.$column", $request[$param]);
        }
    }

    return $query;
}

/**
 * Applies a "no contacts" filter to exclude records that have any contact information
 * from the specified relationship model classes associated with them.
 *
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $modelClass The fully qualified model class name for the main model
 * @param array $request The request data containing filter values
 * @param array $relationshipClasses Array of relationship model classes to check (e.g., [Email::class, Phone::class])
 * @return \Illuminate\Database\Query\Builder
 */
function apply_no_contacts_filter($query, string $modelClass, array $request, array $relationshipClasses)
{
    if (isset($request['noContacts']) && ($request['noContacts'] === true || $request['noContacts'] === 'true')) {
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

    return $query;
}
