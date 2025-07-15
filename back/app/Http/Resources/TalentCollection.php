<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TalentCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($talent) {
            return [
                'id' => $talent->id,
                'name' => trim($talent->first_name . ' ' . $talent->last_name),
                'location' => $talent->location,
                'manager_id' => $talent->manager_id,
            ];
        })->toArray();
    }
}
