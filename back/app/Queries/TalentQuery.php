<?php

namespace App\Queries;

use App\Models\User;
use App\Models\Talent;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

use function App\Helpers\apply_simple_filters;
use function App\Helpers\apply_range_filters;
use function App\Helpers\apply_missing_morph_many_relationship_filters;

class TalentQuery
{
    protected Builder $query;
    protected array $simpleFilters;
    protected array $rangeFilters;
    protected array $relationshipFilters;

    public function __construct(User $user)
    {
        $this->query = DB::table('talents')
            ->where('talents.team_id', $user->team_id)
            ->whereNull('talents.deleted_at');

        $this->simpleFilters = [
            'board'       => 'board_id',
            'cupSize'     => 'cup_size_id',
            'dressSize'   => 'dress_size_id',
            'eyeColor'    => 'eye_color_id',
            'genders'     => 'gender_id',
            'hairColor'   => 'hair_color_id',
            'hairLength'  => 'hair_length_id',
            'managers'    => 'manager_id',
            'skinColor'   => 'skin_color_id',
            'shirtSize'   => 'shirt_size_id',
            'shoeSize'    => 'shoe_size_id',
            'suitCut'     => 'suit_cut_id',
        ];

        $this->rangeFilters = [
            'bust'   => 'bust_cm',
            'height' => 'height_cm',
            'hips'   => 'hips_cm',
            'waist'  => 'waist_cm',
            'weight' => 'weight_kg',
        ];

        $this->relationshipFilters = [
            'noContacts' => ['emails', 'messengers', 'phones'],
        ];
    }

    public function applyFilters(array $request): self
    {
        apply_simple_filters($this->query, Talent::class, $request, $this->simpleFilters);
        apply_range_filters($this->query, Talent::class, $request, $this->rangeFilters);
        apply_missing_morph_many_relationship_filters($this->query, Talent::class, $request, $this->relationshipFilters);

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
