<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\MorphOne;

use App\Models\Event;
use App\Models\Contact;
use App\Models\Talent;

class Company extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'companies';

    protected $hidden = [
        'team_id',
    ];

    protected $fillable = [
        'name',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function event(): MorphOne
    {
        return $this->morphOne(Event::class, 'clientable');
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
