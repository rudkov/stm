<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ContactCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($contact) {
            return [
                'id' => $contact->id,
                'name' => trim($contact->first_name . ' ' . $contact->last_name),
                'job_title' => $contact->job_title,
                'companies' => $contact->companies,
            ];
        })->toArray();
    }
}
