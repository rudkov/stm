<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

use App\Models\Contact;
use App\Models\Event;
use App\Models\Talent;

use App\Traits\BelongsToTeam;
use App\Traits\HasAddresses;
use App\Traits\HasEmails;
use App\Traits\HasMessengers;
use App\Traits\HasPhones;
use App\Traits\HasSocialMedia;
use App\Traits\HasUserTracking;
use App\Traits\HasWeblinks;

class Company extends Model
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

    protected $table = 'companies';

    protected $hidden = [
        'team_id',
    ];

    protected $fillable = [
        'name',
    ];

    public function events()
    {
        return $this->hasMany(Event::class, 'client_id');
    }

    public function contacts()
    {
        return $this->belongsToMany(Contact::class)->withPivot('job_title');
    }

    public function talents()
    {
        return $this->hasMany(Talent::class);
    }
}
