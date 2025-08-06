<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Traits\BelongsToTeam;

class CommunicationType extends Model
{
    use HasFactory, BelongsToTeam;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'sort_order',
        'team_id',
    ];

    /**
     * Get the default communication types, specified in the config file.
     *
     * @return array
     */
    public static function getDefaultTypes(): array
    {
        return array_keys(config('defaults.communication_types', []));
    }

    /**
     * Get all communication types for a team, grouped by type.
     *
     * @param int $teamId
     * @return array
     */
    public static function getGroupedByType(int $teamId): array
    {
        $types = self::where('team_id', $teamId)
            ->orderBy('type')
            ->orderBy('sort_order')
            ->get();

        // Group by type
        $grouped = $types->groupBy('type');

        // Build response using helper to ensure all types are present
        $response = [];
        foreach (self::getDefaultTypes() as $type) {
            $response[$type] = $grouped->get($type, collect());
        }

        return $response;
    }
}
