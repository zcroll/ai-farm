<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/history', [DashboardController::class, 'history'])->name('history');
    Route::get('/scan/{id}', [DashboardController::class, 'showScan'])->name('scan.show');
    Route::get('/disease-library', [DashboardController::class, 'diseaseLibrary'])->name('disease.library');
    
    // Community routes
    Route::get('/community', [App\Http\Controllers\PostController::class, 'index'])->name('community.index');
    Route::get('/community/create', [App\Http\Controllers\PostController::class, 'create'])->name('community.create');
    Route::post('/community', [App\Http\Controllers\PostController::class, 'store'])->name('community.store');
    Route::get('/community/{post}', [App\Http\Controllers\PostController::class, 'show'])->name('community.show');
    Route::get('/community/{post}/edit', [App\Http\Controllers\PostController::class, 'edit'])->name('community.edit');
    Route::put('/community/{post}', [App\Http\Controllers\PostController::class, 'update'])->name('community.update');
    Route::delete('/community/{post}', [App\Http\Controllers\PostController::class, 'destroy'])->name('community.destroy');
    
    // Comments routes
    Route::post('/community/{post}/comments', [App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [App\Http\Controllers\CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [App\Http\Controllers\CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/comments/{comment}/like', [App\Http\Controllers\CommentController::class, 'like'])->name('comments.like');
    
    // AI Chat routes
    Route::get('/ai-chat', [App\Http\Controllers\AIChatController::class, 'index'])->name('ai-chat.index');
    Route::get('/ai-chat/create', [App\Http\Controllers\AIChatController::class, 'create'])->name('ai-chat.create');
    Route::post('/ai-chat', [App\Http\Controllers\AIChatController::class, 'store'])->name('ai-chat.store');
    Route::get('/ai-chat/{chat}', [App\Http\Controllers\AIChatController::class, 'show'])->name('ai-chat.show');
    Route::post('/ai-chat/{chat}/messages', [App\Http\Controllers\AIChatController::class, 'sendMessage'])->name('ai-chat.send-message');
    Route::put('/ai-chat/{chat}', [App\Http\Controllers\AIChatController::class, 'update'])->name('ai-chat.update');
    Route::delete('/ai-chat/{chat}', [App\Http\Controllers\AIChatController::class, 'destroy'])->name('ai-chat.destroy');
    Route::post('/ai-chat/{chat}/archive', [App\Http\Controllers\AIChatController::class, 'archive'])->name('ai-chat.archive');
});

// Settings routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


Route::resource('predictions', App\Http\Controllers\PredictionController::class)->only('store');

Route::resource('dashboards', App\Http\Controllers\DashboardController::class)->only('index');


Route::resource('predictions', App\Http\Controllers\PredictionController::class)->only('store');

Route::resource('dashboards', App\Http\Controllers\DashboardController::class)->only('index');
