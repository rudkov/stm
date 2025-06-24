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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'contacts' => $this->whenLoaded('contacts', function () {
                return $this->contacts->map(function ($contact) {
                    return [
                        'id' => $contact->id,
                        'first_name' => $contact->first_name,
                        'last_name' => $contact->last_name,
                        'job_title' => $contact->pivot->job_title,
                    ];
                });
            }),
            'created_by' => UserBasicResource::make($this->whenLoaded('createdBy')),
            'updated_by' => UserBasicResource::make($this->whenLoaded('updatedBy')),
        ];
    }
}
