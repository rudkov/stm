<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Email;

class EmailType extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function emails()
    {
        return $this->belongsTo(Email::class);
    }
}
