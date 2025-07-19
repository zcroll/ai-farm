# Frontend Component Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Components](#core-components)
3. [UI Components](#ui-components)
4. [Layout Components](#layout-components)
5. [Page Components](#page-components)
6. [Utility Components](#utility-components)
7. [Type Definitions](#type-definitions)

## Overview

The frontend is built with React 18.x and TypeScript, using a component-based architecture with Shadcn/ui components and Tailwind CSS for styling. Framer Motion is used for animations.

### Key Technologies
- **React 18.x**: Component library
- **TypeScript**: Type safety
- **Shadcn/ui**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Axios**: HTTP client
- **Inertia.js**: SPA-like experience with server-side rendering

## Core Components

### 1. PlantScanner Component

**File**: `resources/js/components/plant-scanner.tsx`

#### Description
The main component for plant disease detection. Handles image upload, camera capture, and ML model prediction.

#### Props
```typescript
interface PlantScannerProps {
  // No props required - self-contained component
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

##### `handleImageChange(e: React.ChangeEvent<HTMLInputElement>)`
Handles file input changes and creates preview URL.

```typescript
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setScanResult(null);
    setError(null);
  }
};
```

##### `handleDrop(e: React.DragEvent<HTMLDivElement>)`
Handles drag and drop file uploads.

```typescript
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
      setError(null);
    } else {
      setError('Please drop an image file.');
    }
  }
};
```

##### `handleSubmit()`
Submits the image for ML analysis.

```typescript
const handleSubmit = async () => {
  if (!selectedImage) {
    setError('Please select an image first.');
    return;
  }

  setIsLoading(true);
  setScanAnimation(true);
  setError(null);

  const formData = new FormData();
  formData.append('image', selectedImage);

  try {
    const response = await axios.post('/api/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
      },
      withCredentials: true
    });

    setTimeout(() => {
      setScanResult(response.data);
      setIsLoading(false);
      setScanAnimation(false);
    }, 1500);
  } catch (err: any) {
    console.error('API Error:', err);
    setError(err.response?.data?.error || 'Prediction failed.');
    setIsLoading(false);
    setScanAnimation(false);
  }
};
```

##### `openCamera()`
Opens device camera for photo capture.

```typescript
const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      setScanResult(null);
      setError(null);
    }
  } catch (err) {
    setError('Unable to access camera.');
    console.error('Camera error:', err);
  }
};
```

##### `takePhoto()`
Captures photo from camera stream.

```typescript
const takePhoto = () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setSelectedImage(file);
          setPreviewUrl(URL.createObjectURL(file));
          closeCamera();
        }
      }, "image/jpeg");
    }
  }
};
```

#### Usage Example
```tsx
import PlantScanner from '@/components/plant-scanner';

function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1>Plant Disease Detection</h1>
      <PlantScanner />
    </div>
  );
}
```

#### Features
- Drag and drop file upload
- Camera capture support
- Real-time preview
- Loading animations
- Error handling
- CSRF token support
- Responsive design

### 2. AnimatedResultCard Component

**File**: `resources/js/components/animated-result-card.tsx`

#### Description
Displays scan results with smooth animations and comprehensive disease information.

#### Props
```typescript
interface AnimatedResultCardProps {
  scan: Scan;
  disease: Disease;
  onSaveResult?: () => void;
  onNewScan?: () => void;
}
```

#### Props Interface
```typescript
interface Scan {
  id: number;
  image_path: string;
  predicted_disease: string;
  confidence: number;
  created_at: string;
}

interface Disease {
  id: number;
  name: string;
  description: string;
  treatment_suggestions: string;
  source_url: string | null;
}
```

#### Key Features

##### Health Status Detection
```typescript
const isHealthy = disease.name.toLowerCase().includes('healthy');
```

##### Confidence Display
```typescript
const confidencePercent = Math.round(scan.confidence * 100);
```

##### Disease Name Formatting
```typescript
const formattedDiseaseName = disease.name.replace(/_/g, ' ');
```

#### Usage Example
```tsx
import AnimatedResultCard from '@/components/animated-result-card';

function ResultPage({ scan, disease }) {
  const handleNewScan = () => {
    // Navigate back to scanner
    window.location.href = '/dashboard';
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

#### Animation Features
- Staggered entrance animations
- Progress bar animation
- Scale and opacity transitions
- Smooth color transitions
- Responsive animations

### 3. AppHeader Component

**File**: `resources/js/components/app-header.tsx`

#### Description
Main application header with navigation, user menu, and theme controls.

#### Props
```typescript
interface AppHeaderProps {
  user?: {
    name: string;
    email: string;
  };
  showSidebar?: boolean;
  onSidebarToggle?: () => void;
}
```

#### Features
- User authentication status
- Theme switching (light/dark)
- Responsive navigation
- User dropdown menu
- Sidebar toggle for mobile

#### Usage Example
```tsx
import AppHeader from '@/components/app-header';

function Layout({ user }) {
  return (
    <div>
      <AppHeader user={user} />
      {/* Main content */}
    </div>
  );
}
```

### 4. AppSidebar Component

**File**: `resources/js/components/app-sidebar.tsx`

#### Description
Application sidebar with navigation links and user information.

#### Props
```typescript
interface AppSidebarProps {
  user?: {
    name: string;
    email: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}
```

#### Navigation Items
- Dashboard
- Scan History
- Disease Library
- Settings
- Profile

#### Usage Example
```tsx
import AppSidebar from '@/components/app-sidebar';

function Layout({ user, sidebarOpen, onSidebarClose }) {
  return (
    <div className="flex">
      <AppSidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onClose={onSidebarClose} 
      />
      {/* Main content */}
    </div>
  );
}
```

## UI Components

### 1. Button Component

**File**: `resources/js/components/ui/button.tsx`

#### Variants
- `default`: Primary button
- `destructive`: Danger/delete actions
- `outline`: Secondary actions
- `secondary`: Alternative primary
- `ghost`: Minimal styling
- `link`: Link-like appearance

#### Sizes
- `default`: Standard size
- `sm`: Small
- `lg`: Large
- `icon`: Square icon button

#### Usage Examples
```tsx
import { Button } from '@/components/ui/button';

// Primary button
<Button variant="default" onClick={handleClick}>
  Submit
</Button>

// Danger button
<Button variant="destructive" onClick={handleDelete}>
  Delete
</Button>

// Icon button
<Button variant="outline" size="icon">
  <Plus className="h-4 w-4" />
</Button>

// Loading state
<Button disabled={isLoading}>
  {isLoading ? <Spinner /> : 'Save'}
</Button>
```

### 2. Card Component

**File**: `resources/js/components/ui/card.tsx`

#### Subcomponents
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Card title
- `CardDescription`: Card description
- `CardContent`: Main content area
- `CardFooter`: Footer section

#### Usage Example
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Plant Analysis Results</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Analysis content here...</p>
  </CardContent>
</Card>
```

### 3. Progress Component

**File**: `resources/js/components/ui/progress.tsx`

#### Props
```typescript
interface ProgressProps {
  value: number; // 0-100
  className?: string;
}
```

#### Usage Example
```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={75} className="w-full" />
```

### 4. Badge Component

**File**: `resources/js/components/ui/badge.tsx`

#### Variants
- `default`: Standard badge
- `secondary`: Alternative styling
- `destructive`: Error/danger
- `outline`: Bordered style

#### Usage Example
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Healthy</Badge>
<Badge variant="destructive">Diseased</Badge>
```

## Layout Components

### 1. AppLayout Component

**File**: `resources/js/layouts/app-layout.tsx`

#### Description
Main application layout wrapper with header, sidebar, and content area.

#### Props
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  user?: User;
}
```

#### Usage Example
```tsx
import AppLayout from '@/layouts/app-layout';

function DashboardPage({ user, stats }) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <AppLayout user={user} breadcrumbs={breadcrumbs}>
      <DashboardContent stats={stats} />
    </AppLayout>
  );
}
```

### 2. Breadcrumbs Component

**File**: `resources/js/components/breadcrumbs.tsx`

#### Description
Navigation breadcrumbs for page hierarchy.

#### Props
```typescript
interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
```

#### Usage Example
```tsx
import Breadcrumbs from '@/components/breadcrumbs';

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Scan History', href: '/history' },
  { title: 'Scan #123' }
];

<Breadcrumbs items={breadcrumbs} />
```

## Page Components

### 1. Dashboard Page

**File**: `resources/js/pages/Dashboard.tsx`

#### Description
Main dashboard page with statistics, scanner, and history.

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
- Pagination
- Responsive design

### 2. History Page

**File**: `resources/js/pages/History.tsx`

#### Description
Detailed scan history with filtering and pagination.

#### Features
- Paginated scan list
- Image previews
- Confidence scores
- Date filtering
- Search functionality

### 3. ScanDetail Page

**File**: `resources/js/pages/ScanDetail.tsx`

#### Description
Detailed view of a specific scan with related diseases.

#### Features
- Full scan information
- Related diseases
- Treatment suggestions
- Image gallery
- Export functionality

### 4. DiseaseLibrary Page

**File**: `resources/js/pages/DiseaseLibrary.tsx`

#### Description
Comprehensive disease database with search and filtering.

#### Features
- Disease catalog
- Plant type filtering
- Search functionality
- Treatment information
- External links

## Utility Components

### 1. Icon Component

**File**: `resources/js/components/icon.tsx`

#### Description
Wrapper for Lucide React icons with consistent styling.

#### Usage Example
```tsx
import Icon from '@/components/icon';
import { Camera, Upload } from 'lucide-react';

<Icon name="camera" className="h-5 w-5" />
<Camera className="h-5 w-5" />
```

### 2. InputError Component

**File**: `resources/js/components/input-error.tsx`

#### Description
Displays validation errors for form inputs.

#### Props
```typescript
interface InputErrorProps {
  message?: string;
  className?: string;
}
```

#### Usage Example
```tsx
import InputError from '@/components/input-error';

<InputError message="This field is required" />
```

### 3. PlantHealthIcon Component

**File**: `resources/js/components/plant-health-icon.tsx`

#### Description
Displays plant health status with appropriate icons and colors.

#### Props
```typescript
interface PlantHealthIconProps {
  isHealthy: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Usage Example
```tsx
import PlantHealthIcon from '@/components/plant-health-icon';

<PlantHealthIcon isHealthy={true} size="lg" />
```

## Type Definitions

### Core Types

```typescript
// User types
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Disease types
interface Disease {
  id: number;
  name: string;
  description: string;
  scientific_details?: string;
  treatment_suggestions: string;
  prevention_methods?: string;
  required_tools?: string;
  environmental_factors?: string;
  severity_level?: string;
  average_treatment_time?: number;
  plant_type?: string;
  seasonal_prevalence?: any;
  statistics?: any;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

// Scan types
interface Scan {
  id: number;
  user_id: number;
  disease_id: number;
  image_path: string;
  predicted_disease: string;
  confidence: number;
  created_at: string;
  updated_at: string;
  disease?: Disease;
  user?: User;
}

// Prediction result types
interface PredictionResult {
  scan: Scan;
  disease: Disease;
}

// Statistics types
interface Stats {
  total: number;
  healthy: number;
  diseased: number;
  successRate: number;
  commonDiseases: Array<{
    predicted_disease: string;
    count: number;
  }>;
}

// Pagination types
interface PaginatedData<T> {
  data: T[];
  links: any[];
  prev_page_url: string | null;
  next_page_url: string | null;
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Breadcrumb types
interface BreadcrumbItem {
  title: string;
  href?: string;
}
```

### Component Props Types

```typescript
// Common component props
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form component props
interface FormComponentProps extends BaseComponentProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
}

// Modal component props
interface ModalComponentProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}
```

## Best Practices

### 1. Component Structure
- Use TypeScript interfaces for all props
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow consistent naming conventions

### 2. State Management
- Use local state for component-specific data
- Implement proper loading states
- Handle error states gracefully
- Use appropriate state update patterns

### 3. Styling
- Use Tailwind CSS utility classes
- Follow design system guidelines
- Implement responsive design
- Use consistent spacing and typography

### 4. Performance
- Implement proper memoization
- Use lazy loading for large components
- Optimize bundle size
- Implement proper cleanup in useEffect

### 5. Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation
- Provide alternative text for images

This documentation provides comprehensive information about all frontend components, their usage, and implementation details. For additional questions or clarifications, please refer to the component source files or contact the development team.