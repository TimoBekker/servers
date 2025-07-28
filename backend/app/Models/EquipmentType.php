<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentType extends Model
{
    protected $table = 'c_type_equipment';
    
    protected $fillable = ['name', 'description'];

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'type');
    }
}