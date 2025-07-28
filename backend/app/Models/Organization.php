<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $table = 's_organization';
    
    protected $fillable = ['name', 'description', 'parent'];

    public function parent()
    {
        return $this->belongsTo(Organization::class, 'parent');
    }

    public function children()
    {
        return $this->hasMany(Organization::class, 'parent');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'organization');
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'organization');
    }
}