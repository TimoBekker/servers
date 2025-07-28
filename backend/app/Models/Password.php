<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Password extends Model
{
    protected $table = 'r_password';
    
    protected $fillable = [
        'equipment',
        'information_system',
        'username',
        'password',
        'description',
        'next'
    ];

    protected $hidden = ['password'];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment');
    }

    public function informationSystem()
    {
        return $this->belongsTo(InformationSystem::class, 'information_system');
    }

    public function nextPassword()
    {
        return $this->belongsTo(Password::class, 'next');
    }

    // Автоматическое шифрование пароля
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Crypt::encryptString($value);
    }

    // Автоматическое расшифрование пароля
    public function getPasswordAttribute($value)
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value; // Возвращаем как есть, если не удалось расшифровать
        }
    }
}