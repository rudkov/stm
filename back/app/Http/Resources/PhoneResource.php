<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'info' => $this->info,
            'type' => $this->whenLoaded('type', fn() => new CommunicationTypeResource($this->type)),
        ];
    }
}
