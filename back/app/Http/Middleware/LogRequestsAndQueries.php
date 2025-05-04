<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LogRequestsAndQueries
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // Check if debug mode is enabled
        if (!config('app.debug')) {
            // Skip all logging when not in debug mode
            return $next($request);
        }
        
        $startTime = microtime(true);
        
        // Log the request
        Log::channel('requests_and_queries')->info('Request: ' . $request->method() . ' ' . $request->fullUrl());
        
        // Start query logging
        DB::enableQueryLog();
        
        // Process the request
        $response = $next($request);
        
        // Calculate execution time
        $executionTime = microtime(true) - $startTime;
        // Get queries
        $queries = DB::getQueryLog();
        // Log queries
        Log::channel('requests_and_queries')->info($this->formatQueriesArray($queries)); 
        // Log execution time and response code
        Log::channel('requests_and_queries')->info('Response: ' . $response->getStatusCode() . ' | Execution Time: ' . 
            round($executionTime * 1000, 2) . ' ms | Query Count: ' . count($queries) 
            .' | Total Queries Time: '. collect($queries)->sum('time'));
        
        
        // Disable query logging to avoid memory issues
        DB::disableQueryLog();
        
        return $response;
    }

    /**
     * Format queries array for better readability in logs
     *
     * @param array $queries
     * @return string
     */
    protected function formatQueriesArray(array $queries): string
    {
        if (empty($queries)) {
            return "No queries executed";
        }
        
        $output = "Queries:\n" . str_repeat('-', 100) . "\n";
        
        foreach ($queries as $index => $query) {
            $i = $index + 1;
            
            $output .= "\n[$i] {$query['time']}ms | {$query['query']}\n";
            if (!empty($query['bindings'])) {
                $output .= "\nBindings: " . json_encode($query['bindings'], JSON_PRETTY_PRINT)."\n";
            }
            $output .= str_repeat('-', 100) . "\n";
        }
        
        return $output;
    }
}