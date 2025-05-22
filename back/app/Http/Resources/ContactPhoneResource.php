<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactPhoneResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       return [
            'id' => $this->id,
            'info' => $this->info,
            'phone_type_id' => $this->phone_type_id,
            'type' => $this->whenLoaded('type', function($type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                ];
            }),
        ];
    }
}
