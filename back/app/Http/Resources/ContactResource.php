<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'companies' => ContactCompanyResource::collection($this->whenLoaded('companies')),
            'phones' => PhoneResource::collection($this->whenLoaded('phones')),
            'emails' => EmailResource::collection($this->whenLoaded('emails')),
            'messengers' => MessengerResource::collection($this->whenLoaded('messengers')),
            'created_by' => UserBasicResource::make($this->whenLoaded('createdBy')),
            'updated_by' => UserBasicResource::make($this->whenLoaded('updatedBy')),
        ];
    }
}
