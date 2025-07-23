<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ResponsiblePerson extends Model
{
    use HasFactory;

    protected $table = 'responsible_persons';

    protected $fillable = [
        'name',
        'organization',
        'company',
        'role',
        'email',
        'phone',
    ];

    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'equipment_responsible');
    }
}