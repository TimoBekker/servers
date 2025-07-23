<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class InformationSystem extends Model
{
    use HasFactory;

    protected $table = 'information_systems';

    protected $fillable = [
        'name',
        'description',
        'status',
        'owner',
    ];

    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'equipment_information_systems');
    }
}