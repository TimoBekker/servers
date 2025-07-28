<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentVlan extends Model
{
    protected $table = 'nn_equipment_vlan';
    
    protected $fillable = ['equipment', 'vlan_net', 'ip_address', 'subnet_mask', 'dns_name'];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment');
    }

    public function vlanNet()
    {
        return $this->belongsTo(VlanNet::class, 'vlan_net');
    }

    // Аксессор для совместимости с фронтендом
    public function getVlanAttribute()
    {
        return $this->vlanNet ? $this->vlanNet->name : '';
    }
}