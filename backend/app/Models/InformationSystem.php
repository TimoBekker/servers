<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformationSystem extends Model
{
    protected $table = 'r_information_system';
    
    protected $fillable = [
        'name',
        'description',
        'validation',
        'privacy',
        'protection'
    ];

    public function validation()
    {
        return $this->belongsTo(VariantValidation::class, 'validation');
    }

    public function privacy()
    {
        return $this->belongsTo(LevelPrivacy::class, 'privacy');
    }

    public function protection()
    {
        return $this->belongsTo(LevelProtection::class, 'protection');
    }

    public function equipment()
    {
        return $this->belongsToMany(
            Equipment::class,
            'nn_equipment_infosys_contour',
            'information_system',
            'equipment'
        );
    }

    public function software()
    {
        return $this->belongsToMany(
            Software::class,
            'nn_is_software',
            'information_system',
            'software'
        );
    }

    public function passwords()
    {
        return $this->hasMany(Password::class, 'information_system');
    }

    public function responsiblePersons()
    {
        return $this->hasMany(ResponseInformationSystem::class, 'information_system');
    }

    // Аксессор для совместимости с фронтендом
    public function getStatusAttribute()
    {
        return $this->validation ? $this->validation->name : 'неизвестно';
    }
}