<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

use App\Models\Event;
use App\Models\Contact;
use App\Models\Talent;

use App\Traits\HasUserTracking;

class Company extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    use HasUserTracking;

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
