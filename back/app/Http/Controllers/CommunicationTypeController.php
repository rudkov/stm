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

        // Step 3: Process each item in the request (updates and creates)
        foreach ($typeData as $index => $itemData) {
            $weight = $index; // Rule 1: Weight based on array index

            if (!empty($itemData['id'])) {
                // Rule 2: ID exists in request + DB → update name and weight
                CommunicationType::where('id', $itemData['id'])
                    ->where('team_id', $teamId)
                    ->where('type', $type)
                    ->update([
                        'name' => $itemData['name'],
                        'weight' => $weight,
                    ]);
            } else {
                // Rule 4: ID absent in both → create new
                CommunicationType::create([
                    'name' => $itemData['name'],
                    'type' => $type,
                    'weight' => $weight,
                    'team_id' => $teamId,
                ]);
            }
        }
    }
}
