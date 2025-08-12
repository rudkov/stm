<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Rules\ValidateEach;

use App\Models\Company;
use App\Models\Country;
use App\Models\Language;
use App\Models\TalentBoard;
use App\Models\TalentCupSize;
use App\Models\TalentDressSize;
use App\Models\TalentEyeColor;
use App\Models\TalentGender;
use App\Models\TalentHairColor;
use App\Models\TalentHairLength;
use App\Models\TalentMaritalStatus;
use App\Models\TalentShirtSize;
use App\Models\TalentShoeSize;
use App\Models\TalentSkinColor;
use App\Models\TalentSuitCut;
use App\Models\User;

class TalentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            // Basic Information
            'first_name' => 'required_without:last_name|string|max:255',
            'last_name' => 'required_without:first_name|string|max:255',
            'legal_first_name' => 'nullable|string|max:255',
            'legal_last_name' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',

            // Strings
            'achievements' => 'nullable|string',
            'allergies' => 'nullable|string',
            'biography' => 'nullable|string',
            'notes' => 'nullable|string',
            'performance_skills' => 'nullable|string',
            'piercings' => 'nullable|string',
            'scars' => 'nullable|string',
            'tattoos' => 'nullable|string',

            // Physical Attributes
            'bust_cm' => 'nullable|numeric|min:' . config('defaults.talent_body.bust.min') . '|max:' . config('defaults.talent_body.bust.max'),
            'height_cm' => 'nullable|numeric|min:' . config('defaults.talent_body.height.min') . '|max:' . config('defaults.talent_body.height.max'),
            'hips_cm' => 'nullable|numeric|min:' . config('defaults.talent_body.hips.min') . '|max:' . config('defaults.talent_body.hips.max'),
            'waist_cm' => 'nullable|numeric|min:' . config('defaults.talent_body.waist.min') . '|max:' . config('defaults.talent_body.waist.max'),
            'weight_kg' => 'nullable|numeric|min:' . config('defaults.talent_body.weight.min') . '|max:' . config('defaults.talent_body.weight.max'),

            // Booleans
            'is_accent' => 'nullable|boolean',
            'is_ears_pierced' => 'nullable|boolean',
            'is_faithbased_ads' => 'nullable|boolean',
            'is_fur' => 'nullable|boolean',
            'is_gambling_ads' => 'nullable|boolean',
            'is_lingerie' => 'nullable|boolean',
            'is_liquor_ads' => 'nullable|boolean',
            'is_nude' => 'nullable|boolean',
            'is_political_ads' => 'nullable|boolean',
            'is_smoking_ads' => 'nullable|boolean',
            'is_sports' => 'nullable|boolean',
            'is_swimwear' => 'nullable|boolean',
            'is_topless' => 'nullable|boolean',
            'is_vegetarian' => 'nullable|boolean',

            // Relationships
            'board_id' => ['nullable', Rule::exists(TalentBoard::class, 'id')],
            'cup_size_id' => ['nullable', Rule::exists(TalentCupSize::class, 'id')],
            'dress_size_id' => ['nullable', Rule::exists(TalentDressSize::class, 'id')],
            'eye_color_id' => ['nullable', Rule::exists(TalentEyeColor::class, 'id')],
            'gender_id' => ['nullable', Rule::exists(TalentGender::class, 'id')],
            'hair_color_id' => ['nullable', Rule::exists(TalentHairColor::class, 'id')],
            'hair_length_id' => ['nullable', Rule::exists(TalentHairLength::class, 'id')],
            'manager_id' => ['nullable', Rule::exists(User::class, 'id')],
            'marital_status_id' => ['nullable', Rule::exists(TalentMaritalStatus::class, 'id')],
            'mother_agency_id' => ['nullable', Rule::exists(Company::class, 'id')],
            'shirt_size_id' => ['nullable', Rule::exists(TalentShirtSize::class, 'id')],
            'shoe_size_id' => ['nullable', Rule::exists(TalentShoeSize::class, 'id')],
            'skin_color_id' => ['nullable', Rule::exists(TalentSkinColor::class, 'id')],
            'suit_cut_id' => ['nullable', Rule::exists(TalentSuitCut::class, 'id')],

            // Collections - Many-to-many relationships (arrays of IDs)
            'citizenships' => 'nullable|array',
            'citizenships.*' => ['required', Rule::exists(Country::class, 'alpha_2')],
            'languages' => 'nullable|array',
            'languages.*' => ['required', Rule::exists(Language::class, 'id')],

            // Collections - Morph-many relationships (complex objects)
            'addresses' => ['nullable', 'array', new ValidateEach(new AddressRequest())],
            'emails' => ['nullable', 'array', new ValidateEach(new EmailRequest())],
            'messengers' => ['nullable', 'array', new ValidateEach(new MessengerRequest())],
            'phones' => ['nullable', 'array', new ValidateEach(new PhoneRequest())],
            'social_medias' => ['nullable', 'array', new ValidateEach(new SocialMediaRequest())],
            'emergency_contacts' => ['nullable', 'array', new ValidateEach(new TalentEmergencyContactRequest())],
            'weblinks' => ['nullable', 'array', new ValidateEach(new WeblinkRequest())],
        ];
    }
}
