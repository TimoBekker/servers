<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VolumeHdd extends Model
{
    protected $table = 'c_volume_hdd';
    
    protected $fillable = ['equipment', 'name', 'size'];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment');
    }
}