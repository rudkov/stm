<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Messenger;

class MessengerType extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function messengers()
    {
        return $this->belongsTo(Messenger::class);
    }
}
