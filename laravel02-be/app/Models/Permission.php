<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Permission extends Model
{
    protected $connection = 'mongodb';
    protected $fillable = ['name', 'guard_name'];
}
