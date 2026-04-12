<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResetPasswordController;
use App\Http\Controllers\Api\PredictionController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminArticleController;
use App\Http\Controllers\Api\AdminDatasetController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\CategoryController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [ResetPasswordController::class, 'sendResetLinkEmail']);
Route::post('/verify-token', [ResetPasswordController::class, 'verifyToken']);
Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);
Route::post('/predict', [PredictionController::class, 'predict']);
Route::get('/articles', [AdminArticleController::class, 'index']); // Public articles list
Route::get('/articles/{slug}', [AdminArticleController::class, 'show']); // Public article detail
Route::get('/categories', [CategoryController::class, 'index']); // Public categories list

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

        Route::get('/articles', [AdminArticleController::class, 'index']);
        Route::post('/articles', [AdminArticleController::class, 'store']);
        Route::put('/articles/{id}', [AdminArticleController::class, 'update']);
        Route::delete('/articles/{id}', [AdminArticleController::class, 'destroy']);

        Route::get('/datasets', [AdminDatasetController::class, 'index']);
        Route::post('/datasets', [AdminDatasetController::class, 'store']);
        Route::put('/datasets/{id}', [AdminDatasetController::class, 'update']);
        Route::delete('/datasets/{id}', [AdminDatasetController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
    });
});
