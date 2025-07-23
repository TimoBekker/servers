<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class EquipmentPassword extends Model
{
    use HasFactory;

    protected $table = 'equipment_passwords';

    protected $fillable = [
        'equipment_id',
        'username',
        'password',
        'description',
    ];

    protected $hidden = [
        'password',
    ];

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    // Автоматическое шифрование пароля при сохранении
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Crypt::encryptString($value);
    }

    // Автоматическое расшифровка пароля при получении
    public function getPasswordAttribute($value)
    {
        return Crypt::decryptString($value);
    }

    // Метод для получения зашифрованного пароля для API
    public function getDecryptedPassword()
    {
        return $this->password;
    }
}