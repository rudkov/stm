<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\Http\Resources\CommunicationTypeResource;

use App\Models\CommunicationType;
use App\Models\Country;
use App\Models\EventType;
use App\Models\Language;
use App\Models\MessengerType;
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
        $settings['countries'] = Country::orderBy('name', 'asc')->get();
        $settings['event_types'] = EventType::orderBy('name', 'asc')->get();
        $settings['languages'] = Language::orderBy('name', 'asc')->get();
        $settings['messenger_types'] = MessengerType::orderBy('name', 'asc')->get();
        $settings['social_media_types'] = SocialMediaType::orderBy('name', 'asc')->get();
        $settings['talent_body'] = config('defaults.talent_body');
        $settings['talent_cup_sizes'] = TalentCupSize::orderBy('sort_order', 'asc')->get();
        $settings['talent_dress_sizes'] = TalentDressSize::orderBy('sort_order', 'asc')->get();
        $settings['talent_eye_colors'] = TalentEyeColor::orderBy('name', 'asc')->get();
        $settings['talent_genders'] = TalentGender::orderBy('name', 'asc')->get();
        $settings['talent_marital_statuses'] = TalentMaritalStatus::orderBy('name', 'asc')->get();
        $settings['talent_hair_colors'] = TalentHairColor::orderBy('name', 'asc')->get();
        $settings['talent_hair_lengths'] = TalentHairLength::orderBy('sort_order', 'asc')->get();
        $settings['talent_relative_types'] = TalentRelativeType::orderBy('name', 'asc')->get();
        $settings['talent_shoe_sizes'] = TalentShoeSize::orderBy('sort_order', 'asc')->get();
        $settings['talent_skin_colors'] = TalentSkinColor::orderBy('name', 'asc')->get();
        $settings['talent_shirt_sizes'] = TalentShirtSize::orderBy('sort_order', 'asc')->get();
        $settings['talent_suit_cuts'] = TalentSuitCut::orderBy('sort_order', 'asc')->get();
        return $settings;
    }

    public function team()
    {
        $teamId = Auth::user()->team_id;

        $communicationTypes = CommunicationType::getGroupedByType($teamId);

        // Apply resource transformation
        $response = [];
        foreach ($communicationTypes as $type => $items) {
            $response[$type] = CommunicationTypeResource::collection(collect($items));
        }

        $teamSettings['communication_types'] = $response;

        return $teamSettings;
    }
}
