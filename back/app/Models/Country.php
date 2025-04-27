<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Talent;

class Country extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $primaryKey = 'alpha_2';
    public $incrementing = false;
    protected $keyType = 'char';

    protected $fillable = [
        'name',
        'alpha_2',
        'country_code'
    ];

    public function talents()
    {
        return $this->belongsToMany(Talent::class);
    }
}
