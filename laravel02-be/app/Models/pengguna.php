<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Pengguna extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'pengguna'; //jangan menggunakan collection, nanti tidak terbaca collectionnya

    protected $fillable = [
        'pengguna',
        'umur',
        'alamat',
    ];

    public $timestamps = false;
}
