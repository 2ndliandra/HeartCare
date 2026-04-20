<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Prediction extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'predictions';

    protected $fillable = [
        'user_id',
        'input_data',
        'result_level',
        'result_score',
        'recommendations'
    ];

    protected $casts = [
        'input_data' => 'array',
        'recommendations' => 'array'
    ];
}
