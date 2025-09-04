<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'notes' => $this->notes,
            'job_title' => $this->job_title,

            // Collections
            'addresses' => $this->whenLoaded('addresses', fn() => AddressResource::collection($this->addresses)),
            'companies' => $this->whenLoaded('companies', fn() => ContactCompanyResource::collection($this->companies)),
            'emails' => $this->whenLoaded('emails', fn() => EmailResource::collection($this->emails)),
            'messengers' => $this->whenLoaded('messengers', fn() => MessengerResource::collection($this->messengers)),
            'phones' => $this->whenLoaded('phones', fn() => PhoneResource::collection($this->phones)),
            'social_medias' => $this->whenLoaded('socialMedias', fn() => SocialMediaResource::collection($this->socialMedias)),
            'weblinks' => $this->whenLoaded('weblinks', fn() => WeblinkResource::collection($this->weblinks)),

            // Timestamps and user tracking
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_by' => $this->whenLoaded('createdBy', fn() => new UserBasicResource($this->createdBy)),
            'updated_by' => $this->whenLoaded('updatedBy', fn() => new UserBasicResource($this->updatedBy)),
        ];
    }
}
