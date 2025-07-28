<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentState extends Model
{
    protected $table = 'c_state_equipment';
    
    protected $fillable = ['name', 'description'];

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'state');
    }
}