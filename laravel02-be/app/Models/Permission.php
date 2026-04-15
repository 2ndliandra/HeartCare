<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use MongoDB\Laravel\Eloquent\HybridRelations;

class Permission extends Model
{
    use HybridRelations;

    protected $connection = 'mysql';
    protected $fillable = ['name', 'guard_name'];
}
