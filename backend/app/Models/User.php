<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'user';
    
    protected $fillable = [
        'username',
        'email',
        'phone',
        'organization',
        'leader'
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization');
    }

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader');
    }

    public function subordinates()
    {
        return $this->hasMany(User::class, 'leader');
    }

    public function equipmentResponsibilities()
    {
        return $this->hasMany(ResponseEquipment::class, 'response_person');
    }

    public function informationSystemResponsibilities()
    {
        return $this->hasMany(ResponseInformationSystem::class, 'response_person');
    }
}