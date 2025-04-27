<?php

namespace App\Http\Controllers;

use App\Models\AddressType;
use App\Models\Country;
use App\Models\EmailType;
use App\Models\EventType;
use App\Models\Language;
use App\Models\MessengerType;
use App\Models\PhoneType;
use App\Models\SocialMediaType;
use App\Models\TalentCupSize;
use App\Models\TalentDressSize;
use App\Models\TalentEyeColor;
use App\Models\TalentGender;
use App\Models\TalentHairColor;
use App\Models\TalentHairLength;
use App\Models\TalentShoeSize;
use App\Models\TalentSkinColor;
use App\Models\TalentMaritalStatus;
use App\Models\TalentRelativeType;
use App\Models\TalentShirtSize;
use App\Models\TalentSuitCut;

class SettingsController extends Controller
{
    public function index()
    {
        $settings['event_types'] = EventType::orderBy('name','asc')->get();
        $settings['talent_cup_sizes'] = TalentCupSize::orderBy('weight','asc')->get();
        $settings['talent_eye_colors'] = TalentEyeColor::orderBy('name','asc')->get();
        $settings['talent_hair_colors'] = TalentHairColor::orderBy('name','asc')->get();
        $settings['talent_hair_lengths'] = TalentHairLength::orderBy('weight','asc')->get();
        $settings['talent_shoe_sizes'] = TalentShoeSize::orderBy('weight','asc')->get();
        $settings['talent_skin_colors'] = TalentSkinColor::orderBy('name','asc')->get();
        $settings['talent_marital_statuses'] = TalentMaritalStatus::orderBy('name','asc')->get();
        $settings['talent_relative_types'] = TalentRelativeType::orderBy('name','asc')->get();
        $settings['talent_genders'] = TalentGender::orderBy('name','asc')->get();
        $settings['talent_shirt_sizes'] = TalentShirtSize::orderBy('weight','asc')->get();
        $settings['talent_suit_cuts'] = TalentSuitCut::orderBy('weight','asc')->get();
        $settings['talent_dress_sizes'] = TalentDressSize::orderBy('weight','asc')->get();
        $settings['countries'] = Country::orderBy('name','asc')->get();
        $settings['languages'] = Language::orderBy('name','asc')->get();
        $settings['address_types'] = AddressType::orderBy('weight','asc')->get();
        $settings['phone_types'] = PhoneType::orderBy('weight','asc')->get();
        $settings['email_types'] = EmailType::orderBy('weight','asc')->get();
        $settings['social_media_types'] = SocialMediaType::orderBy('name','asc')->get();
        $settings['messenger_types'] = MessengerType::orderBy('name','asc')->get();
        return $settings;
    }
}
