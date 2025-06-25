<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Models\TalentBoard;
use App\Models\TalentCupSize;
use App\Models\TalentDressSize;
use App\Models\TalentEyeColor;
use App\Models\TalentGender;
use App\Models\TalentHairColor;
use App\Models\TalentHairLength;
use App\Models\TalentShirtSize;
use App\Models\TalentShoeSize;
use App\Models\TalentSkinColor;
use App\Models\TalentSuitCut;
use App\Models\User;

class TalentSearchRequest extends FormRequest
{
    /**
     * These rules match exactly what the frontend sends via transformFilters()
     */
    public function rules(): array
    {
        return [
            // Search-specific parameters
            'noContacts' => 'nullable|boolean',
            'preferences' => 'nullable|array',

            // Range filters (arrays for min/max values)
            'bust' => 'nullable|array|size:2',
            'height' => 'nullable|array|size:2',
            'hips' => 'nullable|array|size:2',
            'waist' => 'nullable|array|size:2',
            'weight' => 'nullable|array|size:2',

            // Array filters
            'board' => 'nullable|array',
            'board.*' => Rule::exists(TalentBoard::class, 'id'),
            'cupSize' => 'nullable|array',
            'cupSize.*' => Rule::exists(TalentCupSize::class, 'id'),
            'dressSize' => 'nullable|array',
            'dressSize.*' => Rule::exists(TalentDressSize::class, 'id'),
            'eyeColor' => 'nullable|array',
            'eyeColor.*' => Rule::exists(TalentEyeColor::class, 'id'),
            'genders' => 'nullable|array',
            'genders.*' => Rule::exists(TalentGender::class, 'id'),
            'hairColor' => 'nullable|array',
            'hairColor.*' => Rule::exists(TalentHairColor::class, 'id'),
            'hairLength' => 'nullable|array',
            'hairLength.*' => Rule::exists(TalentHairLength::class, 'id'),
            'managers' => 'nullable|array',
            'managers.*' => Rule::exists(User::class, 'id'),
            'shirtSize' => 'nullable|array',
            'shirtSize.*' => Rule::exists(TalentShirtSize::class, 'id'),
            'shoeSize' => 'nullable|array',
            'shoeSize.*' => Rule::exists(TalentShoeSize::class, 'id'),
            'skinColor' => 'nullable|array',
            'skinColor.*' => Rule::exists(TalentSkinColor::class, 'id'),
            'suitCut' => 'nullable|array',
            'suitCut.*' => Rule::exists(TalentSuitCut::class, 'id'),
        ];
    }
}
