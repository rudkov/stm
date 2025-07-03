<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Talent;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class TalentQuery
{
    protected Builder $query;
    protected array $simpleFilters;
    protected array $rangeFilters;

    public function __construct(User $user)
    {
        $this->query = DB::table('talents')
            ->where('talents.team_id', $user->team_id)
            ->whereNull('talents.deleted_at');

        $this->simpleFilters = [
            'board_id'       => 'board',
            'cup_size_id'    => 'cupSize',
            'dress_size_id'  => 'dressSize',
            'eye_color_id'   => 'eyeColor',
            'gender_id'      => 'genders',
            'hair_color_id'  => 'hairColor',
            'hair_length_id' => 'hairLength',
            'manager_id'     => 'managers',
            'skin_color_id'  => 'skinColor',
            'shirt_size_id'  => 'shirtSize',
            'shoe_size_id'   => 'shoeSize',
            'suit_cut_id'    => 'suitCut',
        ];

        $this->rangeFilters = [
            'bust_cm'   => 'bust',
            'height_cm' => 'height',
            'hips_cm'   => 'hips',
            'waist_cm'  => 'waist',
            'weight_kg' => 'weight',
        ];
    }

    public function applyFilters(array $request): self
    {
        // Apply simple filters
        foreach ($this->simpleFilters as $column => $param) {
            if (!empty($request[$param])) {
                $this->query->whereIn("talents.$column", $request[$param]);
            }
        }

        // Apply range filters
        foreach ($this->rangeFilters as $column => $param) {
            if (!empty($request[$param]) && count($request[$param]) === 2) {
                $this->query->whereBetween("talents.$column", $request[$param]);
            }
        }

        // Apply no contacts filter
        if (isset($request['noContacts']) && ($request['noContacts'] === true || $request['noContacts'] === 'true')) {
            $this->query->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))
                    ->from('emails')
                    ->whereColumn('emails.emailable_id', 'talents.id')
                    ->where('emails.emailable_type', Talent::class);
            })->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))
                    ->from('messengers')
                    ->whereColumn('messengers.messengerable_id', 'talents.id')
                    ->where('messengers.messengerable_type', Talent::class);
            })->whereNotExists(function ($sub) {
                $sub->select(DB::raw(1))
                    ->from('phones')
                    ->whereColumn('phones.phoneable_id', 'talents.id')
                    ->where('phones.phoneable_type', Talent::class);
            });
        }

        // Apply preferences filter
        if (!empty($request['preferences'])) {
            foreach ($request['preferences'] as $preference) {
                $this->query->where("talents.$preference", 1);
            }
        }

        return $this;
    }

    public function get()
    {
        return $this->query
            ->orderBy('talents.first_name')
            ->orderBy('talents.last_name')
            ->get([
                'talents.id',
                'talents.first_name',
                'talents.last_name',
                'talents.location',
                'talents.manager_id',
            ]);
    }
}
