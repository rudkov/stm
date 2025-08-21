<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CompanyCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return $this->collection->map(function ($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'manager_id' => $company->manager_id,
            ];
        })->toArray();
    }
}
