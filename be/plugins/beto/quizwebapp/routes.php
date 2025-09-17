<?php

use Illuminate\Support\Facades\Route;
use Tober\Cors\Http\Middleware\CorsMiddleware;
use Beto\Quizwebapp\Controllers\AuthController;
use Beto\Quizwebapp\Controllers\JwtMiddleware;
use Beto\Quizwebapp\Controllers\QuizController;

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

    Route::get('/quizzes', [QuizController::class, 'index']);
    // Các route cần login mới vào được
    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);

        // 📘 Quiz API
        // Lấy danh sách quiz
        Route::post('/quizzes', [QuizController::class, 'store']);       // Tạo quiz mới
        Route::get('/quizzes/{id}', [QuizController::class, 'show']);    // Xem chi tiết quiz
        Route::put('/quizzes/{id}', [QuizController::class, 'update']);  // Cập nhật quiz
        Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']); // Xóa quiz

        // 📗 Question API (nếu muốn quản lý riêng)
        // Route::get('/quizzes/{quizId}/questions', [QuestionController::class, 'index']);
        // Route::post('/quizzes/{quizId}/questions', [QuestionController::class, 'store']);
        // Route::get('/questions/{id}', [QuestionController::class, 'show']);
        // Route::put('/questions/{id}', [QuestionController::class, 'update']);
        // Route::delete('/questions/{id}', [QuestionController::class, 'destroy']);
    });

});
