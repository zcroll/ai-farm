<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PredictionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Plant disease prediction route - temporarily removed auth middleware for testing
Route::post('/predict', [PredictionController::class, 'store']);

// Test model endpoint - temporarily removed auth middleware for testing
Route::post('/test-model', [PredictionController::class, 'testModel']);
