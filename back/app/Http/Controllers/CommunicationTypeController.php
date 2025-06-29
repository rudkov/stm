<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Helpers\CommunicationTypeHelper;
use App\Http\Requests\CommunicationTypeCollectionRequest;
use App\Http\Resources\CommunicationTypeResource;
use App\Models\CommunicationType;

class CommunicationTypeController extends Controller
{

    /**
     * Get all communication types for the team, grouped by type.
     */
    public function index()
    {
        $this->authorize('viewAny', CommunicationType::class);

        $data = CommunicationType::getGroupedByType(Auth::user()->team_id);

        // Apply resource transformation
        $response = [];
        foreach ($data as $type => $items) {
            $response[$type] = CommunicationTypeResource::collection(collect($items));
        }

        return response()->json($response);
    }

    /**
     * Update communication types. Can update all types or specific types based on request data.
     */
    public function update(CommunicationTypeCollectionRequest $request)
    {
        $this->authorize('update', CommunicationType::class);

        $teamId = Auth::user()->team_id;
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $teamId) {
            // Process each type that was provided in the request
            foreach (CommunicationTypeHelper::getTypes() as $type) {
                if (isset($validated[$type])) {
                    // Handle both null and array cases - pass to sync method
                    $typeData = $validated[$type] ?? [];
                    $this->syncCommunicationTypes($typeData, $type, $teamId);
                }
            }
        });

        // Return updated collection - delegate to index method
        return $this->index();
    }

    /**
     * Synchronize communication types for a specific type and team.
     * Implements the business logic:
     * 1. Weights are calculated from array index (request weights ignored)
     * 2. ID exists in request + DB → update name
     * 3. ID absent in request, exists in DB → delete from DB
     * 4. ID absent in both → create new
     */
    private function syncCommunicationTypes(array $typeData, string $type, int $teamId)
    {
        if (DB::transactionLevel() === 0) {
            throw new \RuntimeException('This must be called within a DB transaction.');
        }
        // Get existing IDs for this type and team
        $existingIds = CommunicationType::where('type', $type)
            ->where('team_id', $teamId)
            ->pluck('id')
            ->toArray();

        // Get submitted IDs (filtering out null/empty values)
        $submittedIds = collect($typeData)
            ->filter(fn($item) => !empty($item['id']))
            ->pluck('id')
            ->toArray();

        // Step 1: Delete records that exist in DB but not in request
        $idsToDelete = array_diff($existingIds, $submittedIds);
        if (!empty($idsToDelete)) {
            CommunicationType::whereIn('id', $idsToDelete)->delete();
        }

        // Step 2: Avoid uniqueness conflicts by temporarily setting negative weights and unique names
        // Only for records that will remain (not deleted)
        $remainingIds = array_diff($existingIds, $idsToDelete);
        if (!empty($remainingIds)) {
            $timestamp = time();
            foreach ($remainingIds as $id) {
                CommunicationType::where('id', $id)
                    ->update([
                        'weight' => DB::raw('-(weight + 1)'),
                        'name' => "temp_name_{$id}_{$timestamp}"
                    ]);
            }
        }

        // Step 3: Bulk upsert (update existing + create new) based on request data
        // Build a single records array for upsert to minimize queries
        $records = [];
        foreach ($typeData as $index => $itemData) {
            $records[] = [
                // Provide an explicit id (null for new rows) so that each record has the same set of keys
                'id'      => $itemData['id'] ?? null,
                'name'    => $itemData['name'],
                'type'    => $type,
                'weight'  => $index, // Rule 1: weight based on array index
                'team_id' => $teamId,
            ];
        }

        // Use the model's upsert method to perform insert / update in one statement
        // The primary key (`id`) determines whether to insert or update.
        CommunicationType::upsert(
            $records,
            ['id'],              // Columns that uniquely identify records
            ['name', 'weight']   // Columns to be updated on conflict
        );
    }
}
