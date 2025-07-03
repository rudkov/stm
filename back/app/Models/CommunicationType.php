<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunicationType extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'name',
        'type',
        'weight',
        'team_id',
    ];

    /**
     * Get the team that owns this communication type.
     */
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

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
            ->orderBy('weight')
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
