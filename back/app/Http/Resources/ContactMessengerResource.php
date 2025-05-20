<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactMessengerResource extends JsonResource
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
            'messenger_type_id' => $this->messenger_type_id,
            'type' => $this->whenLoaded('type', function($type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'system_name' => $type->system_name,
                ];
            }),
        ];
    }
}
