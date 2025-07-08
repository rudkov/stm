<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,

            // Collections
            'addresses'     => $this->whenLoaded('addresses',    fn() => AddressResource::collection($this->addresses)),
            'contacts'      => $this->whenLoaded('contacts',     fn() => ContactBasicResource::collection($this->contacts)),
            'emails'        => $this->whenLoaded('emails',       fn() => EmailResource::collection($this->emails)),
            'messengers'    => $this->whenLoaded('messengers',   fn() => MessengerResource::collection($this->messengers)),
            'phones'        => $this->whenLoaded('phones',       fn() => PhoneResource::collection($this->phones)),
            'social_medias' => $this->whenLoaded('socialMedias', fn() => SocialMediaResource::collection($this->socialMedias)),
            'weblinks'      => $this->whenLoaded('weblinks',     fn() => WeblinkResource::collection($this->weblinks)),

            // Timestamps and user tracking
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_by' => $this->whenLoaded('createdBy', fn() => new UserBasicResource($this->createdBy)),
            'updated_by' => $this->whenLoaded('updatedBy', fn() => new UserBasicResource($this->updatedBy)),
        ];
    }
}
