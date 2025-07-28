<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VlanNet extends Model
{
    protected $table = 'c_vlan_net';
    
    protected $fillable = ['name', 'description', 'network', 'mask'];

    public function equipmentVlans()
    {
        return $this->hasMany(EquipmentVlan::class, 'vlan_net');
    }
}