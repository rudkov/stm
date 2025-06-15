<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentResource extends JsonResource
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
            'legal_first_name' => $this->legal_first_name,
            'legal_last_name' => $this->legal_last_name,
            'birth_date' => $this->birth_date,
            'location' => $this->location,
            'comment' => $this->comment,
            'achievements' => $this->achievements,
            'biography' => $this->biography,
            'performance_skills' => $this->performance_skills,

            // Physical attributes
            'height_cm' => $this->height_cm,
            'bust_cm' => $this->bust_cm,
            'waist_cm' => $this->waist_cm,
            'hips_cm' => $this->hips_cm,
            'weight_kg' => $this->weight_kg,
            'is_ears_pierced' => $this->is_ears_pierced,
            'scars' => $this->scars,
            'tattoos' => $this->tattoos,
            'piercings' => $this->piercings,

            // Preferences
            'is_vegetarian' => $this->is_vegetarian,
            'allergies' => $this->allergies,
            'is_accent' => $this->is_accent,
            'is_lingerie' => $this->is_lingerie,
            'is_lifestyle' => $this->is_lifestyle,
            'is_nude' => $this->is_nude,
            'is_fur' => $this->is_fur,
            'is_liquor_ads' => $this->is_liquor_ads,
            'is_smoking_ads' => $this->is_smoking_ads,
            'is_gambling_ads' => $this->is_gambling_ads,
            'is_faithbased_ads' => $this->is_faithbased_ads,
            'is_political_ads' => $this->is_political_ads,
            'is_topless' => $this->is_topless,
            'is_swimwear' => $this->is_swimwear,
            'is_sports' => $this->is_sports,

            // Relationships
            'gender' => $this->whenLoaded('gender'),
            'marital_status' => $this->whenLoaded('maritalStatus'),
            'hair_color' => $this->whenLoaded('hairColor'),
            'hair_length' => $this->whenLoaded('hairLength'),
            'eye_color' => $this->whenLoaded('eyeColor'),
            'cup_size' => $this->whenLoaded('cupSize'),
            'shoe_size' => $this->whenLoaded('shoeSize'),
            'shirt_size' => $this->whenLoaded('shirtSize'),
            'suit_cut' => $this->whenLoaded('suitCut'),
            'dress_size' => $this->whenLoaded('dressSize'),
            'skin_color' => $this->whenLoaded('skinColor'),
            'board' => $this->whenLoaded('board'),
            'manager' => $this->whenLoaded('manager'),
            'mother_agency' => $this->whenLoaded('motherAgency'),

            // Collections
            'relatives' => TalentRelativeResource::collection($this->whenLoaded('relatives')),
            'citizenships' => $this->whenLoaded('citizenships'),
            'languages' => $this->whenLoaded('languages'),
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'phones' => PhoneResource::collection($this->whenLoaded('phones')),
            'emails' => EmailResource::collection($this->whenLoaded('emails')),
            'social_medias' => SocialMediaResource::collection($this->whenLoaded('socialMedias')),
            'messengers' => MessengerResource::collection($this->whenLoaded('messengers')),

            // Timestamps and user tracking
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_by' => $this->whenLoaded('createdBy', function () {
                return [
                    'id' => $this->createdBy->id,
                    'name' => $this->createdBy->name,
                ];
            }),
            'updated_by' => $this->whenLoaded('updatedBy', function () {
                return [
                    'id' => $this->updatedBy->id,
                    'name' => $this->updatedBy->name,
                ];
            }),
        ];
    }
}
