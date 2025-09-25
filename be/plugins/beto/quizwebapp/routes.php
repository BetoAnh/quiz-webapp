<?php

use Illuminate\Support\Facades\Route;
use Tober\Cors\Http\Middleware\CorsMiddleware;
use Beto\Quizwebapp\Controllers\AuthController;
use Beto\Quizwebapp\Controllers\JwtMiddleware;
use Beto\Quizwebapp\Controllers\QuizController;
use Beto\Quizwebapp\Controllers\UserController;
use Beto\Quizwebapp\Controllers\SearchController;
use Beto\Quizwebapp\Controllers\CategoryController;

Route::group([
    'prefix' => 'api',
    'middleware' => [CorsMiddleware::class]
], function () {

    Route::options('{any}', function () {
        return response('', 200);
    })->where('any', '.*');

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/quizzes', [QuizController::class, 'index']);

    Route::get('/users/{id}', [UserController::class, 'getById']);
    Route::get('/users/username/{username}', [UserController::class, 'getByUsername']);

    Route::get('/search', [SearchController::class, 'search']);

    Route::get('/categories', [CategoryController::class, 'categories']);
    Route::get('/categories/{id}', [CategoryController::class, 'categoryDetail']);

    Route::get('/quizzes/{id}', [QuizController::class, 'show']);

    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::get('/auth', [AuthController::class, 'auth']);

        Route::post('/quizzes', [QuizController::class, 'store']);       // Tạo quiz mới
        // Xem chi tiết quiz
        Route::put('/quizzes/{id}', [QuizController::class, 'update']);  // Cập nhật quiz
        Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']); // Xóa quiz

        Route::put('/users/profile', [UserController::class, 'updateProfile']);
        Route::put('/users/change-password', [UserController::class, 'changePassword']);
        // Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::get('/myquizzes', [QuizController::class, 'myquizzes']);
    });
});
