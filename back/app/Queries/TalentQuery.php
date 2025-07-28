<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Talent;
use App\Models\Email;
use App\Models\Messenger;
use App\Models\Phone;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

use function App\Helpers\apply_simple_filters;
use function App\Helpers\apply_range_filters;
use function App\Helpers\apply_no_contacts_filter;

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
        apply_simple_filters($this->query, Talent::class, $request, $this->simpleFilters);
        apply_range_filters($this->query, Talent::class, $request, $this->rangeFilters);
        apply_no_contacts_filter($this->query, Talent::class, $request, [Email::class, Messenger::class, Phone::class]);

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
