<?php namespace Beto\Quizwebapp;

use Illuminate\Support\Facades\Route;
use Tober\Cors\Http\Middleware\CorsMiddleware;

Route::group(['prefix' => 'api', 'middleware' => [CorsMiddleware::class]], function () {
    
    // Nhóm cho posts
    Route::group(['prefix' => 'quizies'], function () {
        Route::get('/', 'Your\Plugin\Http\Controllers\PostController@index');
        Route::post('/', 'Your\Plugin\Http\Controllers\PostController@store');
    });

    // Nhóm cho users
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', 'Your\Plugin\Http\Controllers\UserController@index');
        Route::get('/{id}', 'Your\Plugin\Http\Controllers\UserController@show');
    });

});