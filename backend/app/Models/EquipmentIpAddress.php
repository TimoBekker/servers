<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentIpAddress extends Model
{
    use HasFactory;

    protected $table = 'equipment_ip_addresses';

    protected $fillable = [
        'equipment_id',
        'ip_address',
        'subnet_mask',
        'vlan',
        'dns_name',
    ];

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}