<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

use function App\Helpers\sanitize_url_for_storage;

class Weblink extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'info',
        'weblinkable_id',
        'weblinkable_type',
    ];

    /**
     * Automatically sanitize the URL when setting the info field
     */
    protected function info(): Attribute
    {
        return Attribute::make(
            set: fn(string $value) => sanitize_url_for_storage($value),
        );
    }

    /**
     * Get the owning weblinkable model (talent, user, company, contact, etc.).
     */
    public function weblinkable()
    {
        return $this->morphTo();
    }
}
