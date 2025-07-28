<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'r_equipment';
    
    protected $fillable = [
        'name',
        'vmware_name',
        'hostname',
        'state',
        'type',
        'parent',
        'description',
        'placement',
        'organization',
        'specifications',
        'vmware_level',
        'virtual_cpu',
        'ram',
        'has_backup',
        'last_backup_date',
        'commissioned_date',
        'decommissioned_date',
        'kspd_access',
        'internet_access',
        'arcsight_connection',
        'access_remote',
        'internet_forwarding',
        'listening_ports',
        'documentation',
        'related_tickets'
    ];

    protected $casts = [
        'has_backup' => 'boolean',
        'kspd_access' => 'boolean',
        'internet_access' => 'boolean',
        'arcsight_connection' => 'boolean',
        'virtual_cpu' => 'integer',
        'last_backup_date' => 'date',
        'commissioned_date' => 'date',
        'decommissioned_date' => 'date',
    ];

    // Отношения
    public function equipmentType()
    {
        return $this->belongsTo(EquipmentType::class, 'type');
    }

    public function equipmentState()
    {
        return $this->belongsTo(EquipmentState::class, 'state');
    }

    public function parentEquipment()
    {
        return $this->belongsTo(Equipment::class, 'parent');
    }

    public function childEquipment()
    {
        return $this->hasMany(Equipment::class, 'parent');
    }

    public function placement()
    {
        return $this->belongsTo(Placement::class, 'placement');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization');
    }

    public function remoteAccess()
    {
        return $this->belongsTo(VariantAccessRemote::class, 'access_remote');
    }

    // Связанные данные
    public function storage()
    {
        return $this->hasMany(VolumeHdd::class, 'equipment');
    }

    public function ipAddresses()
    {
        return $this->hasMany(EquipmentVlan::class, 'equipment');
    }

    public function passwords()
    {
        return $this->hasMany(Password::class, 'equipment');
    }

    public function responsiblePersons()
    {
        return $this->hasMany(ResponseEquipment::class, 'equipment');
    }

    public function installedSoftware()
    {
        return $this->hasMany(SoftwareInstalled::class, 'equipment');
    }

    public function informationSystems()
    {
        return $this->belongsToMany(
            InformationSystem::class,
            'nn_equipment_infosys_contour',
            'equipment',
            'information_system'
        );
    }

    public function events()
    {
        return $this->belongsToMany(
            Event::class,
            'nn_event_equipment',
            'equipment',
            'event'
        );
    }

    public function claims()
    {
        return $this->belongsToMany(
            Claim::class,
            'nn_equipment_claim',
            'equipment',
            'claim'
        );
    }

    public function openPorts()
    {
        return $this->hasMany(OpenPort::class, 'equipment');
    }

    public function documentation()
    {
        return $this->hasMany(Documentation::class, 'equipment');
    }

    // Аксессоры для совместимости с фронтендом
    public function getEquipmentIdAttribute()
    {
        return $this->name; // Используем name как equipment_id
    }

    public function getStatusAttribute()
    {
        return $this->equipmentState ? $this->equipmentState->name : 'неизвестно';
    }

    public function getTypeNameAttribute()
    {
        return $this->equipmentType ? $this->equipmentType->name : 'неизвестно';
    }

    public function getLocationAttribute()
    {
        return $this->placement ? $this->placement->name : null;
    }
}