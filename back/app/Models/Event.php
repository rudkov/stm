<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

use App\Models\Contact;
use App\Models\EventChunk;
use App\Models\EventType;
use App\Models\Talent;

use App\Traits\HasUserTracking;

class Event extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    use HasUserTracking;

    protected $hidden = [
        'team_id',
    ];

    protected $fillable = [
        'title',
        'imageable_id',
        'imageable_type',
    ];

    public function eventChunks()
    {
        return $this->hasMany(EventChunk::class)->orderBy('start_date')->orderBy('end_date');
    }

    public function eventType()
    {
        return $this->belongsTo(EventType::class);
    }

    public function talents()
    {
        return $this->belongsToMany(Talent::class)->orderBy('first_name')->orderBy('last_name')->withPivot('cost');
    }

    public function client()
    {
        return $this->belongsTo(Company::class);
    }

    public function contacts(): MorphToMany
    {
        return $this->morphToMany(Contact::class, 'contactable');
    }
}
