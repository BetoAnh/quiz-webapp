<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Tober\Cors\Http\Middleware\CorsMiddleware;
use Beto\Quizwebapp\Controllers\AuthController;
use Beto\Quizwebapp\Controllers\JwtMiddleware;
use Beto\Quizwebapp\Controllers\QuizController;
use Beto\Quizwebapp\Controllers\UserController;
use Beto\Quizwebapp\Controllers\SearchController;
use Beto\Quizwebapp\Controllers\CategoryController;
use Beto\Quizwebapp\Controllers\ApiLevelController;
use Beto\Quizwebapp\Classes\QuizGenerator;
use Illuminate\Http\Request;

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

    Route::get('/categories', function () {
        return Cache::remember('categories_tree', 60 * 60, function () {
            return app(CategoryController::class)->categories();
        });
    });

    Route::get('/categories/{id}', [CategoryController::class, 'categoryDetail']);

    Route::get('/quizzes/{id}', [QuizController::class, 'show']);

    Route::get('/levels', function () {
        return Cache::remember('levels_tree', 60 * 60, function () {
            return app(ApiLevelController::class)->apiLevels();
        });
    });

    Route::post('/generate-quiz', function (Request $request) {
        try {
            if (!$request->hasFile('file')) {
                return response()->json(['error' => 'Không có file tải lên.'], 400);
            }

            $file = $request->file('file');

            // ✅ Validate file (truyền file, KHÔNG truyền path)
            $validation = QuizGenerator::validateFile($file);

            if (!$validation['valid']) {
                return response()->json(['error' => $validation['error']], 400);
            }

            $text = $validation['text'];
            $numQuestions = $request->input('numQuestions');

            $result = QuizGenerator::fromText($text, $numQuestions);

            return response()->json([
                'quiz' => $result['quiz'],
                'warning' => $validation['warning'] ?? $result['warning'] ?? null
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Lỗi máy chủ: ' . $e->getMessage()
            ], 500);
        }
    });


    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::get('/auth', [AuthController::class, 'auth']);

        Route::post('/quizzes', [QuizController::class, 'store']);       // Tạo quiz mới
        // Xem chi tiết quiz
        Route::put('/quizzes/{id}', [QuizController::class, 'update']);
        Route::patch('/quizzes/{id}', [QuizController::class, 'update']); // optional

        Route::delete('/quizzes/{id}', [QuizController::class, 'destroy']); // Xóa quiz

        Route::put('/users/profile', [UserController::class, 'updateProfile']);
        Route::put('/users/change-password', [UserController::class, 'changePassword']);
        // Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::get('/myquizzes', [QuizController::class, 'myquizzes']);
    });
});

Route::get('/test-openai-key', function () {
    $apiKey = env('OPENAI_API_KEY');
    try {
        $client = OpenAI::client($apiKey);
        $response = $client->chat()->create([
            'model' => 'gpt-5-nano',
            'messages' => [['role' => 'user', 'content' => 'Hello test!']],
        ]);
        return ['ok' => true, 'key' => $apiKey, 'reply' => $response['choices'][0]['message']['content']];
    } catch (\Exception $e) {
        return ['ok' => false, 'key' => $apiKey, 'error' => $e->getMessage()];
    }
});