<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Equipment extends Model
{
    use HasFactory;

    protected $table = 'equipment';

    protected $fillable = [
        'equipment_id',
        'name',
        'vmware_name',
        'hostname',
        'status',
        'type',
        'parent_equipment',
        'description',
        'location',
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
        'remote_access',
        'internet_forwarding',
        'listening_ports',
        'documentation',
        'related_tickets',
    ];

    protected $casts = [
        'has_backup' => 'boolean',
        'kspd_access' => 'boolean',
        'internet_access' => 'boolean',
        'arcsight_connection' => 'boolean',
        'last_backup_date' => 'date',
        'commissioned_date' => 'date',
        'decommissioned_date' => 'date',
        'virtual_cpu' => 'integer',
    ];

    public function storage(): HasMany
    {
        return $this->hasMany(EquipmentStorage::class);
    }

    public function ipAddresses(): HasMany
    {
        return $this->hasMany(EquipmentIpAddress::class);
    }

    public function passwords(): HasMany
    {
        return $this->hasMany(EquipmentPassword::class);
    }

    public function responsiblePersons(): BelongsToMany
    {
        return $this->belongsToMany(ResponsiblePerson::class, 'equipment_responsible');
    }

    public function software(): BelongsToMany
    {
        return $this->belongsToMany(Software::class, 'equipment_software')
            ->withPivot('installed_date')
            ->withTimestamps();
    }

    public function informationSystems(): BelongsToMany
    {
        return $this->belongsToMany(InformationSystem::class, 'equipment_information_systems');
    }
}