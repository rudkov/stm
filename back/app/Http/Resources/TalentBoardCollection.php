<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TalentBoardCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($talentBoard) {
            return [
                'id' => $talentBoard->id,
                'name' => $talentBoard->name,
            ];
        })->toArray();
    }
}
