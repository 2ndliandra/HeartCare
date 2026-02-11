<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/vote', [VoteController::class, 'vote'])->middleware('checkage');

Route::get('/', function () {
    return view('welcome');
});

Route::get('/About', function () {
    return view('Halo semuanya');
});

Route::get('/Services', function () {
    return view('service');
});



