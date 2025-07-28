<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResponseEquipment extends Model
{
    protected $table = 's_response_equipment';
    
    protected $fillable = [
        'equipment',
        'responsibility',
        'response_person',
        'legal_doc'
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment');
    }

    public function responsibility()
    {
        return $this->belongsTo(VariantResponsibility::class, 'responsibility');
    }

    public function responsePerson()
    {
        return $this->belongsTo(User::class, 'response_person');
    }

    public function legalDoc()
    {
        return $this->belongsTo(LegalDoc::class, 'legal_doc');
    }

    // Аксессоры для совместимости с фронтендом
    public function getNameAttribute()
    {
        return $this->responsePerson ? $this->responsePerson->username : '';
    }

    public function getOrganizationAttribute()
    {
        return $this->responsePerson && $this->responsePerson->organization 
            ? $this->responsePerson->organization->name : '';
    }

    public function getCompanyAttribute()
    {
        return $this->getOrganizationAttribute();
    }

    public function getRoleAttribute()
    {
        return $this->responsibility ? $this->responsibility->name : '';
    }

    public function getEmailAttribute()
    {
        return $this->responsePerson ? $this->responsePerson->email : '';
    }

    public function getPhoneAttribute()
    {
        return $this->responsePerson ? $this->responsePerson->phone : '';
    }
}