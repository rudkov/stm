<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphTo;

use App\Models\TalentAddress;
use App\Models\Country;
use App\Models\TalentEmail;
use App\Models\Event;
use App\Models\TalentMessenger;
use App\Models\TalentPhone;
use App\Models\TalentSocialMedia;
use App\Models\TalentCupSize;
use App\Models\TalentDressSize;
use App\Models\TalentEyeColor;
use App\Models\TalentHairColor;
use App\Models\TalentHairLength;
use App\Models\TalentMaritalStatus;
use App\Models\TalentRelative;
use App\Models\TalentShirtSize;
use App\Models\TalentShoeSize;
use App\Models\TalentSkinColor;
use App\Models\TalentSuitCut;
use App\Models\TalentBoard;
use App\Models\User;

class Talent extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'talents';

    protected $hidden = [
        'team_id',
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'legal_first_name',
        'legal_last_name',
        'gender_id',
        'birth_date',
        'marital_status_id',
        'is_lifestyle',
        'manager_id',
        'mother_agencyable_id',
        'mother_agencyable_type',
        'board_id',

        'hair_color_id',
        'hair_length_id',
        'eye_color_id',
        'height_cm',
        'bust_cm',
        'cup_size_id',
        'waist_cm',
        'hips_cm',
        'weight_kg',
        'shoe_size_id',
        'shirt_size_id',
        'suit_cut_id',
        'dress_size_id',
        'skin_color_id',
        'is_ears_pierced',
        'scars',
        'tattoos',
        'piercings',

        'is_vegetarian',
        'allergies',
        'is_accent',

        'is_lingerie',
        'is_nude',
        'is_fur',
        'is_liquor_ads',
        'is_smoking_ads',
        'is_gambling_ads',
        'is_faithbased_ads',
        'is_political_ads',
        'is_topless',
        'is_swimwear',
        'is_sports',

        'comment',

        'achievements',
        'biography',
        'performance_skills'
    ];

    protected $casts = [
        'birth_date' => 'date:Y-m-d',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function events()
    {
        return $this->belongsToMany(Event::class);
    }

    public function gender()
    {
        return $this->belongsTo(TalentGender::class);
    }

    public function hairColor()
    {
        return $this->belongsTo(TalentHairColor::class);
    }

    public function hairLength()
    {
        return $this->belongsTo(TalentHairLength::class);
    }

    public function eyeColor()
    {
        return $this->belongsTo(TalentEyeColor::class);
    }

    public function cupSize()
    {
        return $this->belongsTo(TalentCupSize::class);
    }

    public function shoeSize()
    {
        return $this->belongsTo(TalentShoeSize::class);
    }

    public function shirtSize()
    {
        return $this->belongsTo(TalentShirtSize::class);
    }

    public function skinColor()
    {
        return $this->belongsTo(TalentSkinColor::class);
    }

    public function suitCut()
    {
        return $this->belongsTo(TalentSuitCut::class);
    }

    public function dressSize()
    {
        return $this->belongsTo(TalentDressSize::class);
    }

    public function maritalStatus()
    {
        return $this->belongsTo(TalentMaritalStatus::class);
    }

    public function relatives()
    {
        return $this->hasMany(TalentRelative::class);
    }

    public function citizenships()
    {
        return $this->belongsToMany(Country::class, 'talent_citizenship', 'talent_id', 'citizenship_id');
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class, 'talent_language', 'talent_id', 'language_id');
    }

    public function addresses()
    {
        return $this->hasMany(TalentAddress::class);
    }

    public function phones()
    {
        return $this->hasMany(TalentPhone::class);
    }

    public function emails()
    {
        return $this->hasMany(TalentEmail::class);
    }

    public function socialMedias()
    {
        return $this->hasMany(TalentSocialMedia::class);
    }

    public function messengers()
    {
        return $this->hasMany(TalentMessenger::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function motherAgencyable(): MorphTo
    {
        return $this->morphTo();
    }

    public function board()
    {
        return $this->belongsTo(TalentBoard::class);
    }
}
