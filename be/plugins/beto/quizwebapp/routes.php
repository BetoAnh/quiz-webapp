<?php

use Illuminate\Support\Facades\Route;
use Tober\Cors\Http\Middleware\CorsMiddleware;
use Beto\Quizwebapp\Controllers\AuthController;
use Beto\Quizwebapp\Controllers\JwtMiddleware;

Route::group([
    'prefix' => 'api',
    'middleware' => [CorsMiddleware::class]
], function () {

    // Bắt tất cả OPTIONS cho preflight
    Route::options('{any}', function () {
        return response('', 200);
    })->where('any', '.*');

    // Auth
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/register', [AuthController::class, 'register']);

    // Các route cần login mới vào được
    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
    });

});
