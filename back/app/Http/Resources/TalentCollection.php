<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TalentCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($talent) {
            return [
                'id' => $talent->id,
                'name' => trim($talent->first_name . ' ' . $talent->last_name),
                'current_location' => $talent->current_location,
                'manager_id' => $talent->manager_id,
            ];
        })->toArray();
    }
}
