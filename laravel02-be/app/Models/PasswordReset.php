<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class PasswordReset extends Model
{
    use HasFactory;

    protected $collection = 'password_reset_tokens';
    protected $fillable = ['email', 'token', 'created_at'];
    public $timestamps = false;
}
