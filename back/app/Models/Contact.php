<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

use App\Models\Company;
use App\Models\Event;
use App\Models\EventChunk;

use App\Traits\BelongsToTeam;
use App\Traits\HasAddresses;
use App\Traits\HasEmails;
use App\Traits\HasMessengers;
use App\Traits\HasPhones;
use App\Traits\HasSocialMedia;
use App\Traits\HasUserTracking;
use App\Traits\HasWeblinks;

class Contact extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    use BelongsToTeam;
    use HasAddresses;
    use HasEmails;
    use HasMessengers;
    use HasPhones;
    use HasSocialMedia;
    use HasUserTracking;
    use HasWeblinks;

    protected $table = 'contacts';

    protected $hidden = [
        'team_id',
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'notes',
        'job_title',
    ];

    public function companies()
    {
        return $this->belongsToMany(Company::class)->orderBy('name')->withPivot('job_title');
    }

    public function events(): MorphToMany
    {
        return $this->morphedByMany(Event::class, 'contactable');
    }

    public function eventChunks(): MorphToMany
    {
        return $this->morphedByMany(EventChunk::class, 'contactable');
    }
}
