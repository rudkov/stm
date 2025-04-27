<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Event;

class EventType extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
