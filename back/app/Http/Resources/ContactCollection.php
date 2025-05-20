<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ContactCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($contact) {
            return [
                'id' => $contact->id,
                'name' => trim($contact->first_name . ' ' . $contact->last_name),
                'email' => $contact->email,
                'phone' => $contact->phone, 
                'job_title' => $contact->job_title,
                'company_name' => $contact->company_name,
            ];
        })->toArray();
    }
}
