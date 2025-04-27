<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

use App\Models\Event;
use App\Models\Contact;

class EventChunk extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $hidden = [
        // 'id', //if we remove this TimePickers wont work
        'team_id',
    ];

    protected $fillable = [
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function contacts(): MorphToMany
    {
        return $this->morphToMany(Contact::class, 'contactable');
    }
}
