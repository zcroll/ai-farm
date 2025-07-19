# Plant Disease Detection API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Backend APIs](#backend-apis)
3. [Frontend Components](#frontend-components)
4. [Data Models](#data-models)
5. [Machine Learning Integration](#machine-learning-integration)
6. [Authentication & Authorization](#authentication--authorization)
7. [Error Handling](#error-handling)
8. [Examples](#examples)

## Overview

This application is a plant disease detection system built with Laravel (PHP) backend and React/TypeScript frontend. It uses a deep learning model (EfficientNetB4) to classify plant diseases from uploaded images.

### Technology Stack
- **Backend**: Laravel 10.x (PHP)
- **Frontend**: React 18.x with TypeScript
- **ML Model**: TensorFlow/Keras (EfficientNetB4)
- **Database**: MySQL/PostgreSQL
- **UI Framework**: Shadcn/ui components
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## Backend APIs

### 1. Plant Disease Prediction API

#### Endpoint
```
POST /api/predict
```

#### Description
Uploads an image and returns plant disease prediction using the ML model.

#### Request
- **Content-Type**: `multipart/form-data`
- **Authentication**: Optional (uses default user if not authenticated)

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | File | Yes | Image file (max 2MB, supported formats: jpg, jpeg, png, gif) |

#### Response
```json
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
    "treatment_suggestions": "Remove infected leaves and apply fungicide...",
    "source_url": "https://example.com/treatment"
  }
}
```

#### Error Responses
```json
{
  "error": "Image file is required",
  "details": "Validation failed"
}
```

```json
{
  "error": "Prediction failed",
  "details": "ML model error details"
}
```

#### Example Usage
```bash
curl -X POST /api/predict \
  -H "Content-Type: multipart/form-data" \
  -F "image=@plant_image.jpg"
```

### 2. Test Model API

#### Endpoint
```
POST /api/test-model
```

#### Description
Tests the ML model to ensure it's working correctly.

#### Request
- **Content-Type**: `application/json`
- **Authentication**: Not required

#### Response
```json
{
  "output": "Model test completed successfully",
  "status": "success"
}
```

### 3. Dashboard API

#### Endpoint
```
GET /dashboard
```

#### Description
Returns dashboard data including user statistics and scan history.

#### Request
- **Authentication**: Required
- **Content-Type**: `application/json`

#### Response
```json
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

### 4. Scan History API

#### Endpoint
```
GET /history
```

#### Description
Returns paginated scan history for the authenticated user.

#### Request
- **Authentication**: Required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 20)

#### Response
```json
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

### 5. Scan Detail API

#### Endpoint
```
GET /scan/{id}
```

#### Description
Returns detailed information about a specific scan.

#### Request
- **Authentication**: Required
- **Parameters**:
  - `id`: Scan ID (integer)

#### Response
```json
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

### 6. Disease Library API

#### Endpoint
```
GET /disease-library
```

#### Description
Returns all available diseases and plant types.

#### Request
- **Authentication**: Required

#### Response
```json
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

## Frontend Components

### 1. PlantScanner Component

#### Description
Main component for uploading and analyzing plant images.

#### Props
```typescript
interface PlantScannerProps {
  // No props required
}
```

#### State
```typescript
interface PlantScannerState {
  selectedImage: File | null;
  previewUrl: string | null;
  isLoading: boolean;
  scanResult: PredictionResult | null;
  error: string | null;
  scanAnimation: boolean;
  cameraActive: boolean;
}
```

#### Methods
- `handleImageChange(e: ChangeEvent)`: Handles file input changes
- `handleDrop(e: DragEvent)`: Handles drag and drop
- `handleSubmit()`: Submits image for analysis
- `resetScan()`: Resets the scanner state
- `openCamera()`: Opens device camera
- `closeCamera()`: Closes device camera
- `takePhoto()`: Captures photo from camera

#### Usage
```tsx
import PlantScanner from '@/components/plant-scanner';

function Dashboard() {
  return (
    <div>
      <PlantScanner />
    </div>
  );
}
```

### 2. AnimatedResultCard Component

#### Description
Displays scan results with animations and treatment information.

#### Props
```typescript
interface AnimatedResultCardProps {
  scan: Scan;
  disease: Disease;
  onSaveResult?: () => void;
  onNewScan?: () => void;
}
```

#### Features
- Animated entrance effects
- Confidence progress bar
- Treatment suggestions display
- Health status indicators
- External link to learn more

#### Usage
```tsx
import AnimatedResultCard from '@/components/animated-result-card';

function ResultPage({ scan, disease }) {
  const handleNewScan = () => {
    // Reset to scanner
  };

  return (
    <AnimatedResultCard
      scan={scan}
      disease={disease}
      onNewScan={handleNewScan}
    />
  );
}
```

### 3. Dashboard Component

#### Description
Main dashboard page showing statistics and scan history.

#### Props
```typescript
interface DashboardProps {
  auth: {
    user: {
      name: string;
    };
  };
  stats: {
    total: number;
    healthy: number;
    diseased: number;
    successRate: number;
    commonDiseases: Array<{
      predicted_disease: string;
      count: number;
    }>;
  };
  history: {
    data: ScanHistoryItem[];
    links: any[];
    prev_page_url: string | null;
    next_page_url: string | null;
  };
}
```

#### Features
- Statistics cards
- Plant scanner integration
- Scan history table
- Pagination support

### 4. UI Components

#### Button Component
```tsx
import { Button } from '@/components/ui/button';

// Variants: default, destructive, outline, secondary, ghost, link
<Button variant="default" size="sm" disabled={false}>
  Click me
</Button>
```

#### Card Component
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

#### Progress Component
```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={75} className="w-full" />
```

## Data Models

### 1. Disease Model

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
```

#### Relationships
- `hasMany(Scan::class)`: One disease can have many scans

#### Accessor Methods
- `getPlantAttribute()`: Extracts plant type from disease name
- `getConditionAttribute()`: Extracts condition from disease name
- `getIsHealthyAttribute()`: Checks if disease represents healthy condition

### 2. Scan Model

#### Attributes
```php
protected $fillable = [
    'image_path',           // Path to stored image
    'predicted_disease',    // ML model prediction
    'confidence',           // Prediction confidence (0-1)
    'user_id',             // Associated user ID
    'disease_id',          // Associated disease ID
];
```

#### Relationships
- `belongsTo(User::class)`: Scan belongs to a user
- `belongsTo(Disease::class)`: Scan belongs to a disease

### 3. User Model

#### Relationships
- `hasMany(Scan::class)`: User can have many scans

## Machine Learning Integration

### Python Prediction Script (`predict.py`)

#### Usage
```bash
python predict.py /path/to/image.jpg
```

#### Input
- Image file path as command line argument

#### Output
```json
{
  "prediction": "Tomato___Early_blight",
  "confidence": 0.95
}
```

#### Supported Classes
The model supports 38 different plant disease classes:
- Apple diseases (4 classes)
- Blueberry (1 class)
- Cherry (2 classes)
- Corn/Maize (4 classes)
- Grape (4 classes)
- Orange (1 class)
- Peach (2 classes)
- Pepper (2 classes)
- Potato (3 classes)
- Raspberry (1 class)
- Soybean (1 class)
- Squash (1 class)
- Strawberry (2 classes)
- Tomato (10 classes)

#### Model Details
- **Architecture**: EfficientNetB4
- **Input Size**: 380x380 pixels
- **Output**: 38-class classification
- **Framework**: TensorFlow/Keras

## Authentication & Authorization

### Authentication Methods
1. **Laravel Sanctum**: API token authentication
2. **Session-based**: Web interface authentication
3. **Guest Access**: Limited functionality for unauthenticated users

### Authorization Rules
- Users can only view their own scans
- Admin users have access to all data
- Guest users can use prediction API with default user

### CSRF Protection
- Web forms include CSRF tokens
- API requests require proper headers

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details",
  "message": "Exception message",
  "file": "File where error occurred",
  "line": "Line number"
}
```

### Common Error Scenarios
1. **Invalid Image Format**: Returns 400 with validation error
2. **File Too Large**: Returns 400 with size limit error
3. **ML Model Failure**: Returns 500 with model error details
4. **Unauthorized Access**: Returns 401/403
5. **Database Errors**: Returns 500 with database error details

## Examples

### Complete Frontend Integration Example

```tsx
import React, { useState } from 'react';
import PlantScanner from '@/components/plant-scanner';
import AnimatedResultCard from '@/components/animated-result-card';

function PlantAnalysisPage() {
  const [scanResult, setScanResult] = useState(null);

  const handleScanComplete = (result) => {
    setScanResult(result);
  };

  const handleNewScan = () => {
    setScanResult(null);
  };

  if (scanResult) {
    return (
      <AnimatedResultCard
        scan={scanResult.scan}
        disease={scanResult.disease}
        onNewScan={handleNewScan}
      />
    );
  }

  return <PlantScanner onScanComplete={handleScanComplete} />;
}
```

### Backend API Integration Example

```php
// Custom controller method
public function analyzePlant(Request $request)
{
    try {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $image = $request->file('image');
        $imagePath = $image->store('scans', 'public');

        // Call ML model
        $python = env('PYTHON_EXECUTABLE_PATH');
        $script = env('PREDICTION_SCRIPT_PATH');
        $process = new Process([$python, $script, Storage::disk('public')->path($imagePath)]);
        $process->run();

        if (!$process->isSuccessful()) {
            throw new Exception('Prediction failed: ' . $process->getErrorOutput());
        }

        $output = json_decode($process->getOutput(), true);
        
        // Save scan record
        $scan = Scan::create([
            'user_id' => auth()->id(),
            'image_path' => $imagePath,
            'predicted_disease' => $output['prediction'],
            'confidence' => $output['confidence'],
        ]);

        return response()->json([
            'success' => true,
            'scan' => $scan,
            'prediction' => $output
        ]);

    } catch (Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}
```

### Database Seeding Example

```php
// Disease seeder
public function run()
{
    Disease::create([
        'name' => 'Tomato___Early_blight',
        'description' => 'Early blight is a common fungal disease of tomatoes...',
        'treatment_suggestions' => 'Remove infected leaves and apply fungicide...',
        'plant_type' => 'Tomato',
        'severity_level' => 'Medium',
        'source_url' => 'https://extension.umn.edu/plant-diseases/early-blight-tomato'
    ]);
}
```

This documentation provides a comprehensive overview of all public APIs, functions, and components in the plant disease detection application. For additional support or questions, please refer to the project's README or contact the development team.