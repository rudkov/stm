<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

use App\Models\Company;
use App\Models\ContactPhone;
use App\Models\ContactEmail;
use App\Models\ContactMessenger;
use App\Models\Event;
use App\Models\EventChunk;
use App\Models\User;
use App\Models\Talent;

class Contact extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'contacts';

    protected $hidden = [
        'team_id',
    ];

    protected $fillable = [
        'first_name',
        'last_name',
        'comment',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function phones()
    {
        return $this->hasMany(ContactPhone::class);
    }

    public function emails()
    {
        return $this->hasMany(ContactEmail::class);
    }

    public function messengers()
    {
        return $this->hasMany(ContactMessenger::class);
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class)->orderBy('name')->withPivot('job_title');
    }

    public function events(): MorphToMany
    {
        return $this->morphedByMany(Event::class, 'contactable');
    }

    public function event(): MorphOne
    {
        return $this->morphOne(Event::class, 'clientable');
    }
 
    public function eventChunks(): MorphToMany
    {
        return $this->morphedByMany(EventChunk::class, 'contactable');
    }

    public function talents()
    {
        return $this->morphMany(Talent::class, 'mother_agencyable');
    }
}
