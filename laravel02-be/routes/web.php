<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VoterController;


Route::match(['get', 'post'], '/voter', [VoterController::class, 'viewVoters']);
