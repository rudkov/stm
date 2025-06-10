<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Models\Address;
use App\Models\Email;
use App\Models\Phone;
use App\Models\Talent;
use App\Models\TalentMessenger;
use App\Models\TalentRelative;
use App\Models\SocialMedia;

class TalentController extends Controller
{
    private function getTalentById($id)
    {
        $talent = Talent::where('id', $id)
            ->with([
                'board',
                'gender',
                'maritalStatus',
                'hairColor',
                'hairLength',
                'eyeColor',
                'cupSize',
                'shoeSize',
                'shirtSize',
                'suitCut',
                'dressSize',
                'skinColor',
                'citizenships',
                'languages',
                'relatives',
                'relatives.type',
                'manager',
                'motherAgency',
                'createdBy',
                'updatedBy',
                'addresses',
                'addresses.type',
                'phones',
                'phones.type',
                'emails',
                'emails.type',
                'socialMedias',
                'socialMedias.type',
                'messengers',
                'messengers.type',
            ])
            ->firstOrFail();
        return $talent;
    }

    public function index(Request $request)
    {
        $query = DB::table('talents')
            ->where('talents.team_id', Auth::user()->team->id)
            ->whereNull('talents.deleted_at');

        // Simple filters
        $filters = [
            'board_id'       => 'board',
            'cup_size_id'    => 'cupSize',
            'dress_size_id'  => 'dressSize',
            'eye_color_id'   => 'eyeColor',
            'gender_id'      => 'genders',
            'hair_color_id'  => 'hairColor',
            'hair_length_id' => 'hairLength',
            'skin_color_id'  => 'skinColor',
            'shirt_size_id'  => 'shirtSize',
            'shoe_size_id'   => 'shoeSize',
            'suit_cut_id'    => 'suitCut',
            'manager_id'     => 'managers',
        ];

        foreach ($filters as $column => $param) {
            if (!empty($request->$param)) {
                $query->whereIn("talents.$column", $request->$param);
            }
        }

        // Ranges (between)
        $rangeFilters = [
            'bust_cm'   => 'bust',
            'height_cm' => 'height',
            'hips_cm'   => 'hips',
            'waist_cm'  => 'waist',
            'weight_kg' => 'weight',
        ];

        foreach ($rangeFilters as $column => $param) {
            if (!empty($request->$param) && count($request->$param) === 2) {
                $query->whereBetween("talents.$column", $request->$param);
            }
        }

        // No contact info
        if ($request->noContacts === true || $request->noContacts === 'true') {
            $query->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))->from('talent_emails')->whereColumn('talent_emails.talent_id', 'talents.id');
            })->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))->from('talent_messengers')->whereColumn('talent_messengers.talent_id', 'talents.id');
            })->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))->from('talent_phones')->whereColumn('talent_phones.talent_id', 'talents.id');
            });
        }

        // Preferences (bool)
        if (!empty($request->preferences)) {
            foreach ($request->preferences as $preference) {
                $query->where("talents.$preference", 1);
            }
        }

        $raw_talents = $query
            ->orderBy('talents.first_name')
            ->orderBy('talents.last_name')
            ->get([
                'talents.id',
                'talents.first_name',
                'talents.last_name',
                'talents.current_location',
                'talents.manager_id',
            ]);

        $talents = array();
        foreach ($raw_talents as $talent) {
            $talents[$talent->id]['id'] = $talent->id;
            $talents[$talent->id]['name'] = trim($talent->first_name . ' ' . $talent->last_name);
            $talents[$talent->id]['location'] = $talent->current_location;
            $talents[$talent->id]['manager_id'] = $talent->manager_id;
        }
        $talents = array_values($talents);

        return $talents;
    }

    public function show(Request $request, $id)
    {
        $talent = $this->getTalentById($id);

        if ($request->user()->cannot('view', $talent)) {
            abort(403);
        }

        return $talent;
    }

    public function update(Request $request, $id)
    {
        // return $request;
        $talent = Talent::where('id', $id)
            ->with([
                'citizenships',
                'languages',
                'relatives',
                'addresses',
                'phones',
                'emails',
                'socialMedias',
                'messengers',
            ])
            ->firstOrFail();

        if ($request->user()->cannot('update', $talent)) {
            abort(403);
        }

        $talent->updated_by = Auth::user()->id;

        //RELATIVES START
        $relatives['upsert'] = array();
        $relatives['delete'] = array();

        $newRelatives = collect($request->relatives);
        $oldRelatives = collect($talent->relatives);

        foreach ($oldRelatives as $relative) {
            if (!$newRelatives->contains('id', $relative['id'])) {
                $relatives['delete'][] = $relative['id'];
            }
        }

        foreach ($newRelatives as $relative) {
            if (array_key_exists('id', $relative)) {
                $oldRelative = TalentRelative::where('id', $relative['id'])->firstOrFail();

                if (@$relative['relative_type_id'] || @$relative['info']) {
                    if (
                        $oldRelative['relative_type_id'] != @$relative['relative_type_id'] ||
                        $oldRelative['info'] != @$relative['info']
                    ) {
                        $oldRelative->relative_type_id = @$relative['relative_type_id'];
                        $oldRelative->info = @$relative['info'];
                        $relatives['upsert'][] = $oldRelative;
                    }
                } else {
                    $relatives['delete'][] = $relative['id'];
                }
            } else {
                if (@$relative['relative_type_id'] || @$relative['info']) {
                    $newRelative = new TalentRelative();
                    $newRelative->relative_type_id = @$relative['relative_type_id'];
                    $newRelative->info = @$relative['info'];
                    $relatives['upsert'][] = $newRelative;
                }
            }
        }
        //RELATIVES END

        //ADDRESSES START
        $addresses['upsert'] = array();
        $addresses['delete'] = array();

        $newAddresses = collect($request->addresses);
        $oldAddresses = collect($talent->addresses);

        foreach ($oldAddresses as $address) {
            if (!$newAddresses->contains('id', $address['id'])) {
                $addresses['delete'][] = $address['id'];
            }
        }

        foreach ($newAddresses as $address) {
            if (array_key_exists('id', $address)) {
                $oldAddress = Address::where('id', $address['id'])->firstOrFail();

                if (@$address['address_type_id'] || @$address['info']) {
                    if (
                        $oldAddress['address_type_id'] != @$address['address_type_id'] ||
                        $oldAddress['info'] != @$address['info']
                    ) {
                        $oldAddress->address_type_id = @$address['address_type_id'];
                        $oldAddress->info = @$address['info'];
                        $addresses['upsert'][] = $oldAddress;
                    }
                } else {
                    $addresses['delete'][] = $address['id'];
                }
            } else {
                if (@$address['address_type_id'] || @$address['info']) {
                    $newAddress = new Address();
                    $newAddress->address_type_id = @$address['address_type_id'];
                    $newAddress->info = @$address['info'];
                    $addresses['upsert'][] = $newAddress;
                }
            }
        }
        //ADDRESSES END

        //PHONES START
        $phones['upsert'] = array();
        $phones['delete'] = array();

        $newPhones = collect($request->phones);
        $oldPhones = collect($talent->phones);

        foreach ($oldPhones as $phone) {
            if (!$newPhones->contains('id', $phone['id'])) {
                $phones['delete'][] = $phone['id'];
            }
        }

        foreach ($newPhones as $phone) {
            if (array_key_exists('id', $phone)) {
                $oldPhone = Phone::where('id', $phone['id'])->firstOrFail();

                if (@$phone['phone_type_id'] || @$phone['info']) {
                    if (
                        $oldPhone['phone_type_id'] != @$phone['phone_type_id'] ||
                        $oldPhone['info'] != @$phone['info']
                    ) {
                        $oldPhone->phone_type_id = @$phone['phone_type_id'];
                        $oldPhone->info = @$phone['info'];
                        $phones['upsert'][] = $oldPhone;
                    }
                } else {
                    $phones['delete'][] = $phone['id'];
                }
            } else {
                if (@$phone['phone_type_id'] || @$phone['info']) {
                    $newPhone = new Phone();
                    $newPhone->phone_type_id = @$phone['phone_type_id'];
                    $newPhone->info = @$phone['info'];
                    $phones['upsert'][] = $newPhone;
                }
            }
        }
        //PHONES END

        //EMAILS START
        $emails['upsert'] = array();
        $emails['delete'] = array();

        $newEmails = collect($request->emails);
        $oldEmails = collect($talent->emails);

        foreach ($oldEmails as $email) {
            if (!$newEmails->contains('id', $email['id'])) {
                $emails['delete'][] = $email['id'];
            }
        }

        foreach ($newEmails as $email) {
            if (array_key_exists('id', $email)) {
                $oldEmail = Email::where('id', $email['id'])->firstOrFail();

                if (@$email['email_type_id'] || @$email['info']) {
                    if (
                        $oldEmail['email_type_id'] != @$email['email_type_id'] ||
                        $oldEmail['info'] != @$email['info']
                    ) {
                        $oldEmail->email_type_id = @$email['email_type_id'];
                        $oldEmail->info = @$email['info'];
                        $emails['upsert'][] = $oldEmail;
                    }
                } else {
                    $emails['delete'][] = $email['id'];
                }
            } else {
                if (@$email['email_type_id'] || @$email['info']) {
                    $newEmail = new Email();
                    $newEmail->email_type_id = @$email['email_type_id'];
                    $newEmail->info = @$email['info'];
                    $emails['upsert'][] = $newEmail;
                }
            }
        }
        //EMAILS END

        //SOCIAL MEDIAS START
        $socialMedias['upsert'] = array();
        $socialMedias['delete'] = array();

        $newSocialMedias = collect($request->social_medias);
        $oldSocialMedias = collect($talent->socialMedias);

        foreach ($oldSocialMedias as $item) {
            if (!$newSocialMedias->contains('id', $item['id'])) {
                $socialMedias['delete'][] = $item['id'];
            }
        }

        foreach ($newSocialMedias as $item) {
            if (array_key_exists('id', $item)) {
                $oldSocialMedia = SocialMedia::where('id', $item['id'])->firstOrFail();

                if (@$item['social_media_type_id'] || @$item['info']) {
                    if (
                        $oldSocialMedia['social_media_type_id'] != @$item['social_media_type_id'] ||
                        $oldSocialMedia['info'] != @$item['info']
                    ) {
                        $oldSocialMedia->social_media_type_id = @$item['social_media_type_id'];
                        $oldSocialMedia->info = @$item['info'];
                        $socialMedias['upsert'][] = $oldSocialMedia;
                    }
                } else {
                    $socialMedias['delete'][] = $item['id'];
                }
            } else {
                if (@$item['social_media_type_id'] || @$item['info']) {
                    $newSocialMedia = new SocialMedia();
                    $newSocialMedia->social_media_type_id = @$item['social_media_type_id'];
                    $newSocialMedia->info = @$item['info'];
                    $socialMedias['upsert'][] = $newSocialMedia;
                }
            }
        }
        //SOCIAL MEDIAS END

        //MESSENGERS START
        $messengers['upsert'] = array();
        $messengers['delete'] = array();

        $newMessengers = collect($request->messengers);
        $oldMessengers = collect($talent->messengers);

        foreach ($oldMessengers as $item) {
            if (!$newMessengers->contains('id', $item['id'])) {
                $messengers['delete'][] = $item['id'];
            }
        }

        foreach ($newMessengers as $item) {
            if (array_key_exists('id', $item)) {
                $oldMessenger = TalentMessenger::where('id', $item['id'])->firstOrFail();

                if (@$item['messenger_type_id'] || @$item['info']) {
                    if (
                        $oldMessenger['messenger_type_id'] != @$item['messenger_type_id'] ||
                        $oldMessenger['info'] != @$item['info']
                    ) {
                        $oldMessenger->messenger_type_id = @$item['messenger_type_id'];
                        $oldMessenger->info = @$item['info'];
                        $messengers['upsert'][] = $oldMessenger;
                    }
                } else {
                    $messengers['delete'][] = $item['id'];
                }
            } else {
                if (@$item['messenger_type_id'] || @$item['info']) {
                    $newMessenger = new TalentMessenger();
                    $newMessenger->messenger_type_id = @$item['messenger_type_id'];
                    $newMessenger->info = @$item['info'];
                    $messengers['upsert'][] = $newMessenger;
                }
            }
        }
        //MESSENGERS END

        DB::transaction(function () use ($talent, $request, $relatives, $addresses, $phones, $emails, $socialMedias, $messengers) {
            $talent->relatives()->whereIn('id', $relatives['delete'])->delete();
            $talent->relatives()->saveMany($relatives['upsert']);

            $talent->addresses()->whereIn('id', $addresses['delete'])->delete();
            $talent->addresses()->saveMany($addresses['upsert']);

            $talent->phones()->whereIn('id', $phones['delete'])->delete();
            $talent->phones()->saveMany($phones['upsert']);

            $talent->emails()->whereIn('id', $emails['delete'])->delete();
            $talent->emails()->saveMany($emails['upsert']);

            $talent->socialMedias()->whereIn('id', $socialMedias['delete'])->delete();
            $talent->socialMedias()->saveMany($socialMedias['upsert']);

            $talent->messengers()->whereIn('id', $messengers['delete'])->delete();
            $talent->messengers()->saveMany($messengers['upsert']);

            $talent->citizenships()->detach();
            $talent->citizenships()->attach($request->citizenships);

            $talent->languages()->detach();
            $talent->languages()->attach($request->languages);

            $talent->update($request->all());
        });

        // DB::enableQueryLog();

        // $queries = DB::getQueryLog();
        // return $queries;

        $talent = $this->getTalentById($id);

        return response()->json($talent, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->cannot('create', Talent::class)) {
            abort(403);
        }

        $talent = new Talent();

        DB::transaction(function () use ($talent, $request) {
            $user = Auth::user();

            $talent->fill($request->all());
            $talent->team_id = $user->team->id;
            $talent->created_by = $user->id;
            $talent->updated_by = $user->id;
            $talent->manager_id = $request->manager_id;
            $talent->save();

            $newRelatives = collect($request->relatives);
            foreach ($newRelatives as $relative) {
                if (@$relative['relative_type_id'] || @$relative['info']) {
                    $newRelative = new TalentRelative();
                    $newRelative->talent_id = $talent->id;
                    $newRelative->relative_type_id = @$relative['relative_type_id'];
                    $newRelative->info = @$relative['info'];
                    $newRelative->save();
                }
            }

            $newAddresses = collect($request->addresses);
            foreach ($newAddresses as $address) {
                if (@$address['address_type_id'] || @$address['info']) {
                    $newAddress = new Address();
                    $newAddress->address_type_id = @$address['address_type_id'];
                    $newAddress->info = @$address['info'];
                    $talent->addresses()->save($newAddress);
                }
            }

            $newPhones = collect($request->phones);
            foreach ($newPhones as $phone) {
                if (@$phone['phone_type_id'] || @$phone['info']) {
                    $newPhone = new Phone();
                    $newPhone->phone_type_id = @$phone['phone_type_id'];
                    $newPhone->info = @$phone['info'];
                    $talent->phones()->save($newPhone);
                }
            }

            $newEmails = collect($request->emails);
            foreach ($newEmails as $email) {
                if (@$email['email_type_id'] || @$email['info']) {
                    $newEmail = new Email();
                    $newEmail->email_type_id = @$email['email_type_id'];
                    $newEmail->info = @$email['info'];
                    $talent->emails()->save($newEmail);
                }
            }

            $newSocialMedias = collect($request->social_medias);
            foreach ($newSocialMedias as $item) {
                if (@$item['social_media_type_id'] || @$item['info']) {
                    $newSocialMedia = new SocialMedia();
                    $newSocialMedia->social_media_type_id = @$item['social_media_type_id'];
                    $newSocialMedia->info = @$item['info'];
                    $talent->socialMedias()->save($newSocialMedia);
                }
            }

            $newMessengers = collect($request->messengers);
            foreach ($newMessengers as $item) {
                if (@$item['messenger_type_id'] || @$item['info']) {
                    $newMessenger = new TalentMessenger();
                    $newMessenger->messenger_type_id = @$item['messenger_type_id'];
                    $newMessenger->info = @$item['info'];
                    $talent->messengers()->save($newMessenger);
                }
            }

            $talent->citizenships()->attach($request->citizenships);
            $talent->languages()->attach($request->languages);
        });

        $talent = $this->getTalentById($talent->id);

        return response()->json($talent, 201);
    }

    public function destroy(Request $request, $id)
    {
        $talent = Talent::where('id', $id)
            ->firstOrFail();

        if ($request->user()->cannot('delete', $talent)) {
            abort(403);
        }

        $talent->updated_by = Auth::user()->id;
        $talent->delete();
        return response()->json(null, 204);
    }

    public function updateCurrentLocation(Request $request, $id)
    {
        $talent = Talent::where('id', $id)
            ->firstOrFail();

        if ($request->user()->cannot('update', $talent)) {
            abort(403);
        }

        $talent->current_location = $request['current_location'];
        $talent->timestamps = false;
        $talent->save();

        $talent = $this->getTalentById($id);

        return response()->json($talent, 200);
    }

    public function locations()
    {
        $uniqueLocations = DB::table('talents')
            ->select('current_location')
            ->where('team_id', Auth::user()->team->id)
            ->whereNull('talents.deleted_at')
            ->distinct()
            ->orderByRaw('CASE WHEN current_location IS NULL THEN 0 ELSE 1 END, current_location')
            ->pluck('current_location');
        return $uniqueLocations;
    }

    public function managers()
    {
        $uniqueManagers = DB::table('talents')
            ->leftJoin('users', 'talents.manager_id', '=', 'users.id')
            ->where('talents.team_id', Auth::user()->team->id)
            ->whereNull('talents.deleted_at')
            ->distinct()
            ->orderBy('users.name')
            ->get(['users.id', 'users.name']);
        return $uniqueManagers;
    }
}
