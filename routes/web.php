<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DiseaseLibraryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AIChatController;
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
    
    // Disease Library routes
    Route::get('/disease-library', [DiseaseLibraryController::class, 'index'])->name('disease.library');
    Route::get('/disease-library/{disease}', [DiseaseLibraryController::class, 'show'])->name('disease.show');
    Route::get('/disease-library/plant-type/{plantType}', [DiseaseLibraryController::class, 'byPlantType'])->name('disease.by-plant-type');
    
    // Community routes
    Route::get('/community', [PostController::class, 'index'])->name('community.index');
    Route::get('/community/create', [PostController::class, 'create'])->name('community.create');
    Route::post('/community', [PostController::class, 'store'])->name('community.store');
    Route::get('/community/{post}', [PostController::class, 'show'])->name('community.show');
    Route::get('/community/{post}/edit', [PostController::class, 'edit'])->name('community.edit');
    Route::put('/community/{post}', [PostController::class, 'update'])->name('community.update');
    Route::delete('/community/{post}', [PostController::class, 'destroy'])->name('community.destroy');
    Route::get('/community/category/{category}', [PostController::class, 'byCategory'])->name('community.by-category');
    
    // Comment routes
    Route::post('/community/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/comments/{comment}/like', [CommentController::class, 'like'])->name('comments.like');
    Route::post('/comments/{comment}/unlike', [CommentController::class, 'unlike'])->name('comments.unlike');
    
    // AI Chat routes
    Route::get('/ai-chat', [AIChatController::class, 'index'])->name('ai-chat.index');
    Route::get('/ai-chat/create', [AIChatController::class, 'create'])->name('ai-chat.create');
    Route::post('/ai-chat', [AIChatController::class, 'store'])->name('ai-chat.store');
    Route::get('/ai-chat/{chat}', [AIChatController::class, 'show'])->name('ai-chat.show');
    Route::post('/ai-chat/{chat}/message', [AIChatController::class, 'sendMessage'])->name('ai-chat.send-message');
    Route::put('/ai-chat/{chat}', [AIChatController::class, 'update'])->name('ai-chat.update');
    Route::delete('/ai-chat/{chat}', [AIChatController::class, 'destroy'])->name('ai-chat.destroy');
    Route::post('/ai-chat/{chat}/archive', [AIChatController::class, 'archive'])->name('ai-chat.archive');
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
