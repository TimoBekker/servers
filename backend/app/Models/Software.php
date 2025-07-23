<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Software extends Model
{
    use HasFactory;

    protected $table = 'software';

    protected $fillable = [
        'name',
        'version',
        'vendor',
        'description',
        'license_type',
        'license_expiry',
    ];

    protected $casts = [
        'license_expiry' => 'date',
    ];

    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'equipment_software')
            ->withPivot('installed_date')
            ->withTimestamps();
    }
}