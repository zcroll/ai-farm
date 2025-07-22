<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AIChatController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\PredictionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Plant disease detection specific routes
    Route::get('/scan', [DashboardController::class, 'scan'])->name('scan');
    Route::get('/history', [DashboardController::class, 'history'])->name('history');
    Route::get('/scan/{id}', [DashboardController::class, 'showScan'])->name('scan.show');

    // Disease Library routes
    Route::get('/diseases', [DiseaseController::class, 'diagnosed'])->name('diseases.index');
    Route::get('/disease-library', [DiseaseController::class, 'index'])->name('disease.library');
    Route::get('/diseases/{disease}', [DiseaseController::class, 'show'])->name('diseases.show');

    // Community routes
    Route::resource('community', PostController::class)->names([
        'index' => 'community.index',
        'create' => 'community.create',
        'store' => 'community.store',
        'show' => 'community.show',
        'edit' => 'community.edit',
        'update' => 'community.update',
        'destroy' => 'community.destroy',
    ]);

    // Comments routes
    Route::post('/community/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/comments/{comment}/like', [CommentController::class, 'like'])->name('comments.like');

    // Post interaction routes
    Route::post('/community/{post}/like', [PostController::class, 'like'])->name('posts.like');
    Route::post('/community/{post}/bookmark', [PostController::class, 'bookmark'])->name('posts.bookmark');

    // API routes for AJAX requests
    Route::prefix('api')->group(function () {
        Route::post('/posts/{post}/like', [\App\Http\Controllers\Api\CommunityController::class, 'likePost']);
        Route::post('/posts/{post}/bookmark', [\App\Http\Controllers\Api\CommunityController::class, 'bookmarkPost']);
        Route::post('/comments/{comment}/like', [\App\Http\Controllers\Api\CommunityController::class, 'likeComment']);
        Route::get('/posts', [\App\Http\Controllers\Api\CommunityController::class, 'getPosts']);
        Route::get('/posts/{post}/comments', [\App\Http\Controllers\Api\CommunityController::class, 'getComments']);
        Route::get('/posts/search', [\App\Http\Controllers\Api\CommunityController::class, 'searchPosts']);
        Route::get('/user/stats', [\App\Http\Controllers\Api\CommunityController::class, 'getUserStats']);
    });

    // AI Chat routes
    Route::resource('ai-chat', AIChatController::class)->names([
        'index' => 'ai-chat.index',
        'create' => 'ai-chat.create',
        'store' => 'ai-chat.store',
        'show' => 'ai-chat.show',
        'destroy' => 'ai-chat.destroy',
    ]);
    Route::post('/ai-chat/{chat}/message', [AIChatController::class, 'sendMessage'])->name('ai-chat.message');
    Route::post('/ai-chat/message', [AIChatController::class, 'directMessage'])->name('ai-chat.direct-message');

    // Prediction routes
    Route::post('/predictions', [PredictionController::class, 'store'])->name('predictions.store');
});

// API routes for AJAX requests
Route::middleware(['auth'])->group(function () {
    Route::post('/api/test-model', [PredictionController::class, 'testModel'])->name('api.test-model');
});

// Settings routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
