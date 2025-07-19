# Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Database Models](#database-models)
3. [Controllers](#controllers)
4. [API Endpoints](#api-endpoints)
5. [Database Migrations](#database-migrations)
6. [Middleware](#middleware)
7. [Jobs & Queues](#jobs--queues)
8. [Configuration](#configuration)
9. [Error Handling](#error-handling)
10. [Testing](#testing)

## Overview

The backend is built with Laravel 10.x (PHP) and provides a RESTful API for the plant disease detection system. It integrates with a Python ML model for image analysis and uses MySQL/PostgreSQL for data storage.

### Technology Stack
- **Framework**: Laravel 10.x
- **Language**: PHP 8.1+
- **Database**: MySQL/PostgreSQL
- **ML Integration**: Python/TensorFlow
- **Authentication**: Laravel Sanctum
- **File Storage**: Laravel Storage (local/public)
- **Testing**: PHPUnit

## Database Models

### 1. User Model

**File**: `app/Models/User.php`

#### Description
Laravel's default user model extended for plant disease detection functionality.

#### Attributes
```php
protected $fillable = [
    'name',
    'email',
    'password',
];

protected $hidden = [
    'password',
    'remember_token',
];

protected $casts = [
    'email_verified_at' => 'datetime',
    'password' => 'hashed',
];
```

#### Relationships
```php
/**
 * Get the scans for this user.
 */
public function scans(): HasMany
{
    return $this->hasMany(Scan::class);
}
```

#### Methods
```php
/**
 * Get user's scan statistics.
 */
public function getScanStats(): array
{
    $total = $this->scans()->count();
    $healthy = $this->scans()->where('predicted_disease', 'LIKE', '%healthy')->count();
    $diseased = $total - $healthy;
    $successRate = $total > 0 ? round(($healthy / $total) * 100, 1) : 0;

    return [
        'total' => $total,
        'healthy' => $healthy,
        'diseased' => $diseased,
        'successRate' => $successRate,
    ];
}

/**
 * Get user's most common diseases.
 */
public function getCommonDiseases(int $limit = 5): Collection
{
    return $this->scans()
        ->select('predicted_disease')
        ->selectRaw('COUNT(*) as count')
        ->groupBy('predicted_disease')
        ->orderByDesc('count')
        ->limit($limit)
        ->get();
}
```

#### Usage Examples
```php
// Create a new user
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => Hash::make('password'),
]);

// Get user's scans
$scans = $user->scans()->with('disease')->get();

// Get user statistics
$stats = $user->getScanStats();

// Get common diseases
$commonDiseases = $user->getCommonDiseases(10);
```

### 2. Disease Model

**File**: `app/Models/Disease.php`

#### Description
Represents plant diseases with comprehensive information including treatment suggestions.

#### Attributes
```php
protected $fillable = [
    'name',                    // Disease name (e.g., "Tomato___Early_blight")
    'description',             // Disease description
    'scientific_details',      // Scientific information
    'treatment_suggestions',   // Treatment recommendations
    'prevention_methods',      // Prevention strategies
    'required_tools',          // Tools needed for treatment
    'environmental_factors',   // Environmental considerations
    'severity_level',          // Disease severity (Low/Medium/High)
    'average_treatment_time',  // Average treatment duration
    'plant_type',              // Plant type (e.g., "Tomato")
    'seasonal_prevalence',     // Seasonal occurrence data
    'statistics',              // Statistical data
    'source_url',              // External reference URL
];

protected $casts = [
    'id' => 'integer',
    'average_treatment_time' => 'float',
    'seasonal_prevalence' => 'array',
    'statistics' => 'array',
];
```

#### Relationships
```php
/**
 * Get the scans for this disease.
 */
public function scans(): HasMany
{
    return $this->hasMany(Scan::class);
}
```

#### Accessor Methods
```php
/**
 * Get the plant type from the disease name.
 */
public function getPlantAttribute(): string
{
    $parts = explode('___', $this->name);
    return str_replace('_', ' ', $parts[0]);
}

/**
 * Get the condition from the disease name.
 */
public function getConditionAttribute(): string
{
    $parts = explode('___', $this->name);
    return isset($parts[1]) ? str_replace('_', ' ', $parts[1]) : '';
}

/**
 * Check if the disease is a healthy condition.
 */
public function getIsHealthyAttribute(): bool
{
    return str_contains(strtolower($this->name), 'healthy');
}
```

#### Scopes
```php
/**
 * Scope to filter by plant type.
 */
public function scopeByPlantType($query, string $plantType): void
{
    $query->where('plant_type', $plantType);
}

/**
 * Scope to filter healthy conditions.
 */
public function scopeHealthy($query): void
{
    $query->where('name', 'LIKE', '%healthy');
}

/**
 * Scope to filter diseased conditions.
 */
public function scopeDiseased($query): void
{
    $query->where('name', 'NOT LIKE', '%healthy');
}
```

#### Usage Examples
```php
// Create a new disease
$disease = Disease::create([
    'name' => 'Tomato___Early_blight',
    'description' => 'Early blight is a common fungal disease of tomatoes...',
    'treatment_suggestions' => 'Remove infected leaves and apply fungicide...',
    'plant_type' => 'Tomato',
    'severity_level' => 'Medium',
    'source_url' => 'https://example.com/treatment',
]);

// Get plant type
$plantType = $disease->plant; // Returns "Tomato"

// Check if healthy
$isHealthy = $disease->is_healthy; // Returns false

// Filter by plant type
$tomatoDiseases = Disease::byPlantType('Tomato')->get();

// Get only healthy conditions
$healthyConditions = Disease::healthy()->get();
```

### 3. Scan Model

**File**: `app/Models/Scan.php`

#### Description
Represents individual plant scans with prediction results and metadata.

#### Attributes
```php
protected $fillable = [
    'image_path',           // Path to stored image
    'predicted_disease',    // ML model prediction
    'confidence',           // Prediction confidence (0-1)
    'user_id',             // Associated user ID
    'disease_id',          // Associated disease ID
];

protected $casts = [
    'id' => 'integer',
    'confidence' => 'float',
    'user_id' => 'integer',
    'disease_id' => 'integer',
];
```

#### Relationships
```php
/**
 * Get the user that owns the scan.
 */
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

/**
 * Get the disease associated with the scan.
 */
public function disease(): BelongsTo
{
    return $this->belongsTo(Disease::class);
}
```

#### Accessor Methods
```php
/**
 * Get the full image URL.
 */
public function getImageUrlAttribute(): string
{
    return Storage::disk('public')->url($this->image_path);
}

/**
 * Get the confidence percentage.
 */
public function getConfidencePercentageAttribute(): float
{
    return round($this->confidence * 100, 2);
}

/**
 * Check if the scan indicates a healthy plant.
 */
public function getIsHealthyAttribute(): bool
{
    return str_contains(strtolower($this->predicted_disease), 'healthy');
}
```

#### Scopes
```php
/**
 * Scope to filter by user.
 */
public function scopeByUser($query, int $userId): void
{
    $query->where('user_id', $userId);
}

/**
 * Scope to filter healthy scans.
 */
public function scopeHealthy($query): void
{
    $query->where('predicted_disease', 'LIKE', '%healthy');
}

/**
 * Scope to filter by confidence threshold.
 */
public function scopeHighConfidence($query, float $threshold = 0.8): void
{
    $query->where('confidence', '>=', $threshold);
}
```

#### Usage Examples
```php
// Create a new scan
$scan = Scan::create([
    'user_id' => $user->id,
    'disease_id' => $disease->id,
    'image_path' => 'scans/abc123.jpg',
    'predicted_disease' => 'Tomato___Early_blight',
    'confidence' => 0.95,
]);

// Get image URL
$imageUrl = $scan->image_url;

// Get confidence percentage
$confidencePercent = $scan->confidence_percentage; // Returns 95.0

// Check if healthy
$isHealthy = $scan->is_healthy; // Returns false

// Get user's high-confidence scans
$highConfidenceScans = Scan::byUser($user->id)
    ->highConfidence(0.9)
    ->with('disease')
    ->get();
```

## Controllers

### 1. PredictionController

**File**: `app/Http/Controllers/PredictionController.php`

#### Description
Handles plant disease prediction requests and ML model integration.

#### Methods

##### `store(Request $request)`
Processes image upload and returns disease prediction.

```php
public function store(Request $request)
{
    try {
        // Validate image upload
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        // Get authenticated user or default user
        $user = $request->user() ?? \App\Models\User::first();
        
        if (!$user) {
            return response()->json(['error' => 'User not found. Please login.'], 401);
        }
        
        // Store image
        $image = $request->file('image');
        $imagePath = $image->store('scans', 'public');
        $absImagePath = Storage::disk('public')->path($imagePath);

        // Call ML model
        $python = env('PYTHON_EXECUTABLE_PATH', '/usr/bin/python3');
        $script = env('PREDICTION_SCRIPT_PATH', base_path('predict.py'));
        
        $process = new Process([$python, $script, $absImagePath]);
        $process->setTimeout(60);
        $process->run();

        if (!$process->isSuccessful()) {
            Log::error('Prediction process failed', [
                'exit_code' => $process->getExitCode(),
                'error_output' => $process->getErrorOutput(),
            ]);
            
            return response()->json([
                'error' => 'Prediction failed', 
                'details' => $process->getErrorOutput(),
            ], 500);
        }

        // Parse ML output
        $rawOutput = $process->getOutput();
        $lines = explode("\n", trim($rawOutput));
        $jsonLine = end($lines);
        $output = json_decode($jsonLine, true);

        if (!$output || isset($output['error'])) {
            return response()->json([
                'error' => $output['error'] ?? 'Invalid output from prediction script',
            ], 500);
        }

        // Find or create disease record
        $disease = $this->findOrCreateDisease($output['prediction']);

        // Create scan record
        $scan = Scan::create([
            'user_id' => $user->id,
            'disease_id' => $disease->id,
            'image_path' => $imagePath,
            'predicted_disease' => $output['prediction'],
            'confidence' => $output['confidence'],
        ]);

        return response()->json([
            'scan' => $scan,
            'disease' => $disease,
        ]);

    } catch (\Exception $e) {
        Log::error('Exception in prediction controller', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'An error occurred during prediction',
            'message' => $e->getMessage(),
        ], 500);
    }
}
```

##### `testModel(Request $request)`
Tests the ML model to ensure it's working correctly.

```php
public function testModel(Request $request)
{
    try {
        $python = env('PYTHON_EXECUTABLE_PATH', '/usr/bin/python3');
        $testScript = base_path('test_model.py');
        
        $process = new Process([$python, $testScript]);
        $process->setTimeout(60);
        $process->run();

        if (!$process->isSuccessful()) {
            return response()->json([
                'error' => 'Test model failed',
                'error_output' => $process->getErrorOutput(),
            ], 500);
        }

        return response()->json([
            'output' => $process->getOutput(),
            'status' => 'success'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'An error occurred during test model',
            'message' => $e->getMessage()
        ], 500);
    }
}
```

#### Private Methods

##### `findOrCreateDisease(string $prediction)`
Finds existing disease or creates new one with fuzzy matching.

```php
private function findOrCreateDisease(string $prediction): Disease
{
    // Try exact match first
    $disease = Disease::where('name', $prediction)->first();
    
    if ($disease) {
        return $disease;
    }
    
    // Try fuzzy matching
    $allDiseases = Disease::all();
    $bestMatch = null;
    $highestSimilarity = 0;
    
    foreach ($allDiseases as $possibleDisease) {
        $similarity = similar_text($possibleDisease->name, $prediction, $percent);
        
        if ($percent > $highestSimilarity) {
            $highestSimilarity = $percent;
            $bestMatch = $possibleDisease;
        }
    }
    
    // If we found a match with at least 70% similarity, use it
    if ($bestMatch && $highestSimilarity >= 70) {
        return $bestMatch;
    }
    
    // Create new disease record
    return Disease::create([
        'name' => $prediction,
        'description' => 'Automatically created from prediction',
        'treatment_suggestions' => 'Please consult a plant specialist for treatment options.',
        'source_url' => null
    ]);
}
```

### 2. DashboardController

**File**: `app/Http/Controllers/DashboardController.php`

#### Description
Handles dashboard data and user statistics.

#### Methods

##### `index(Request $request)`
Returns dashboard data with user statistics and scan history.

```php
public function index(Request $request)
{
    $user = $request->user();

    // Get paginated scans
    $scans = $user->scans()->with('disease')->orderByDesc('created_at')->paginate(10);
    
    // Get all diseases for reference
    $diseases = Disease::all();

    // Calculate statistics
    $stats = $user->getScanStats();
    
    // Get most common diseases
    $commonDiseases = $user->getCommonDiseases(5);

    return Inertia::render('Dashboard', [
        'auth' => $user,
        'stats' => array_merge($stats, ['commonDiseases' => $commonDiseases]),
        'history' => $scans,
        'diseases' => $diseases,
    ]);
}
```

##### `history(Request $request)`
Returns paginated scan history.

```php
public function history(Request $request)
{
    $user = $request->user();
    $scans = $user->scans()->with('disease')->orderByDesc('created_at')->paginate(20);

    return Inertia::render('History', [
        'scans' => $scans,
    ]);
}
```

##### `showScan(Request $request, $id)`
Returns detailed scan information with related diseases.

```php
public function showScan(Request $request, $id)
{
    $user = $request->user();
    $scan = Scan::with('disease')->findOrFail($id);

    // Check authorization
    if ($scan->user_id !== $user->id) {
        abort(403, 'Unauthorized action.');
    }

    // Get related diseases (same plant type)
    $plantType = explode('___', $scan->predicted_disease)[0];
    $relatedDiseases = Disease::where('name', 'LIKE', $plantType . '_%')
        ->where('name', '!=', $scan->predicted_disease)
        ->limit(5)
        ->get();

    return Inertia::render('ScanDetail', [
        'scan' => $scan,
        'relatedDiseases' => $relatedDiseases,
    ]);
}
```

##### `diseaseLibrary(Request $request)`
Returns disease library with filtering options.

```php
public function diseaseLibrary(Request $request)
{
    $diseases = Disease::all();
    $plantTypes = Disease::select('plant_type')->distinct()->pluck('plant_type');

    return Inertia::render('DiseaseLibrary', [
        'diseases' => $diseases,
        'plantTypes' => $plantTypes,
    ]);
}
```

## API Endpoints

### Authentication Endpoints

#### Login
```
POST /login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password"
}
```

#### Register
```
POST /register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "password_confirmation": "password"
}
```

#### Logout
```
POST /logout
```

### Plant Disease Detection Endpoints

#### Predict Disease
```
POST /api/predict
Content-Type: multipart/form-data

Form Data:
- image: [file] (max 2MB, jpg, jpeg, png, gif)

Response:
{
    "scan": {
        "id": 1,
        "user_id": 1,
        "disease_id": 5,
        "image_path": "scans/abc123.jpg",
        "predicted_disease": "Tomato___Early_blight",
        "confidence": 0.95,
        "created_at": "2024-01-15T10:30:00Z"
    },
    "disease": {
        "id": 5,
        "name": "Tomato___Early_blight",
        "description": "Early blight is a common fungal disease...",
        "treatment_suggestions": "Remove infected leaves...",
        "source_url": "https://example.com/treatment"
    }
}
```

#### Test Model
```
POST /api/test-model
Content-Type: application/json

Response:
{
    "output": "Model test completed successfully",
    "status": "success"
}
```

### Dashboard Endpoints

#### Get Dashboard Data
```
GET /dashboard
Authorization: Bearer [token]

Response:
{
    "auth": {
        "user": {
            "name": "John Doe"
        }
    },
    "stats": {
        "total": 25,
        "healthy": 15,
        "diseased": 10,
        "successRate": 60.0,
        "commonDiseases": [
            {
                "predicted_disease": "Tomato___healthy",
                "count": 8
            }
        ]
    },
    "history": {
        "data": [...],
        "links": [...],
        "prev_page_url": null,
        "next_page_url": "/dashboard?page=2"
    },
    "diseases": [...]
}
```

#### Get Scan History
```
GET /history?page=1&per_page=20
Authorization: Bearer [token]

Response:
{
    "scans": {
        "data": [
            {
                "id": 1,
                "image_path": "scans/abc123.jpg",
                "predicted_disease": "Tomato___Early_blight",
                "confidence": 0.95,
                "created_at": "2024-01-15T10:30:00Z",
                "disease": {
                    "name": "Tomato___Early_blight",
                    "description": "Early blight is a common fungal disease...",
                    "treatment_suggestions": "Remove infected leaves...",
                    "source_url": "https://example.com/treatment"
                }
            }
        ],
        "links": [...],
        "prev_page_url": null,
        "next_page_url": "/history?page=2"
    }
}
```

#### Get Scan Detail
```
GET /scan/{id}
Authorization: Bearer [token]

Response:
{
    "scan": {
        "id": 1,
        "image_path": "scans/abc123.jpg",
        "predicted_disease": "Tomato___Early_blight",
        "confidence": 0.95,
        "created_at": "2024-01-15T10:30:00Z",
        "disease": {
            "id": 5,
            "name": "Tomato___Early_blight",
            "description": "Early blight is a common fungal disease...",
            "treatment_suggestions": "Remove infected leaves...",
            "source_url": "https://example.com/treatment"
        }
    },
    "relatedDiseases": [
        {
            "id": 6,
            "name": "Tomato___Late_blight",
            "description": "Late blight is another fungal disease...",
            "treatment_suggestions": "..."
        }
    ]
}
```

#### Get Disease Library
```
GET /disease-library
Authorization: Bearer [token]

Response:
{
    "diseases": [
        {
            "id": 1,
            "name": "Apple___Apple_scab",
            "description": "Apple scab is a serious disease...",
            "treatment_suggestions": "Apply fungicide...",
            "plant_type": "Apple",
            "severity_level": "High",
            "source_url": "https://example.com/apple-scab"
        }
    ],
    "plantTypes": ["Apple", "Tomato", "Grape", "Corn"]
}
```

## Database Migrations

### Users Table
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

### Diseases Table
```php
Schema::create('diseases', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->text('description');
    $table->text('scientific_details')->nullable();
    $table->text('treatment_suggestions');
    $table->text('prevention_methods')->nullable();
    $table->text('required_tools')->nullable();
    $table->text('environmental_factors')->nullable();
    $table->enum('severity_level', ['Low', 'Medium', 'High'])->nullable();
    $table->float('average_treatment_time')->nullable();
    $table->string('plant_type')->nullable();
    $table->json('seasonal_prevalence')->nullable();
    $table->json('statistics')->nullable();
    $table->string('source_url')->nullable();
    $table->timestamps();
});
```

### Scans Table
```php
Schema::create('scans', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('disease_id')->constrained()->onDelete('cascade');
    $table->string('image_path');
    $table->string('predicted_disease');
    $table->float('confidence');
    $table->timestamps();
});
```

## Middleware

### Authentication Middleware
```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/history', [DashboardController::class, 'history'])->name('history');
    Route::get('/scan/{id}', [DashboardController::class, 'showScan'])->name('scan.show');
    Route::get('/disease-library', [DashboardController::class, 'diseaseLibrary'])->name('disease.library');
});
```

### API Middleware
```php
// routes/api.php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public endpoints (temporarily)
Route::post('/predict', [PredictionController::class, 'store']);
Route::post('/test-model', [PredictionController::class, 'testModel']);
```

## Jobs & Queues

### ProcessPrediction Job
```php
// app/Jobs/ProcessPrediction.php
class ProcessPrediction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $imagePath,
        public int $userId
    ) {}

    public function handle(): void
    {
        // Process prediction asynchronously
        $python = env('PYTHON_EXECUTABLE_PATH');
        $script = env('PREDICTION_SCRIPT_PATH');
        
        $process = new Process([$python, $script, $this->imagePath]);
        $process->run();
        
        // Handle results...
    }
}
```

## Configuration

### Environment Variables
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=plant_disease_detection
DB_USERNAME=root
DB_PASSWORD=

# ML Model
PYTHON_EXECUTABLE_PATH=/usr/bin/python3
PREDICTION_SCRIPT_PATH=/path/to/predict.py

# File Storage
FILESYSTEM_DISK=public

# Queue
QUEUE_CONNECTION=database
```

### Model Configuration
```php
// config/filesystems.php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
    ],
],
```

## Error Handling

### Global Exception Handler
```php
// app/Exceptions/Handler.php
public function register(): void
{
    $this->reportable(function (Throwable $e) {
        if ($e instanceof \Symfony\Component\Process\Exception\ProcessTimedOutException) {
            Log::error('ML model timeout', [
                'message' => $e->getMessage(),
                'command' => $e->getCommand(),
            ]);
        }
    });
}
```

### Custom Exceptions
```php
// app/Exceptions/PredictionException.php
class PredictionException extends Exception
{
    public function __construct(
        string $message = "Prediction failed",
        int $code = 0,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function render($request)
    {
        return response()->json([
            'error' => 'Prediction failed',
            'message' => $this->getMessage(),
        ], 500);
    }
}
```

## Testing

### Feature Tests
```php
// tests/Feature/PredictionTest.php
class PredictionTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_predict_disease_from_image()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/api/predict', [
                'image' => UploadedFile::fake()->image('plant.jpg'),
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'scan' => [
                    'id',
                    'user_id',
                    'disease_id',
                    'image_path',
                    'predicted_disease',
                    'confidence',
                ],
                'disease' => [
                    'id',
                    'name',
                    'description',
                    'treatment_suggestions',
                ],
            ]);
    }

    public function test_requires_valid_image()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->post('/api/predict', [
                'image' => 'invalid-file',
            ]);

        $response->assertStatus(422);
    }
}
```

### Model Tests
```php
// tests/Unit/DiseaseTest.php
class DiseaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_plant_type_from_name()
    {
        $disease = Disease::factory()->create([
            'name' => 'Tomato___Early_blight',
        ]);

        $this->assertEquals('Tomato', $disease->plant);
    }

    public function test_can_detect_healthy_condition()
    {
        $healthyDisease = Disease::factory()->create([
            'name' => 'Tomato___healthy',
        ]);

        $diseasedDisease = Disease::factory()->create([
            'name' => 'Tomato___Early_blight',
        ]);

        $this->assertTrue($healthyDisease->is_healthy);
        $this->assertFalse($diseasedDisease->is_healthy);
    }
}
```

### API Tests
```php
// tests/Feature/ApiTest.php
class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_dashboard_data()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->get('/dashboard');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('stats')
                ->has('history')
            );
    }

    public function test_can_get_scan_history()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->get('/history');

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('History')
                ->has('scans')
            );
    }
}
```

This documentation provides comprehensive information about the backend architecture, models, controllers, and APIs. For additional questions or clarifications, please refer to the source code or contact the development team.