<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Software extends Model
{
    protected $table = 'r_software';
    
    protected $fillable = [
        'name',
        'version',
        'description',
        'type',
        'type_license',
        'owner',
        'method_license',
        'developer'
    ];

    public function softwareType()
    {
        return $this->belongsTo(SoftwareType::class, 'type');
    }

    public function licenseType()
    {
        return $this->belongsTo(LicenseType::class, 'type_license');
    }

    public function owner()
    {
        return $this->belongsTo(Organization::class, 'owner');
    }

    public function developer()
    {
        return $this->belongsTo(Organization::class, 'developer');
    }

    public function methodLicense()
    {
        return $this->belongsTo(MethodLicense::class, 'method_license');
    }

    public function installedSoftware()
    {
        return $this->hasMany(SoftwareInstalled::class, 'software');
    }

    public function informationSystems()
    {
        return $this->belongsToMany(
            InformationSystem::class,
            'nn_is_software',
            'software',
            'information_system'
        );
    }

    // Аксессоры для совместимости с фронтендом
    public function getVendorAttribute()
    {
        return $this->developer ? $this->developer->name : null;
    }

    public function getLicenseTypeNameAttribute()
    {
        return $this->licenseType ? $this->licenseType->name : null;
    }

    public function getLicenseExpiryAttribute()
    {
        // Здесь можно добавить логику для получения даты истечения лицензии
        return null;
    }
}