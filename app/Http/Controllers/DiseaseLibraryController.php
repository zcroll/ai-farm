<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiseaseLibraryController extends Controller
{
    /**
     * Display the disease library.
     */
    public function index(Request $request)
    {
        $query = Disease::query();

        // Apply filters
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('plant_type')) {
            $query->where('plant_type', $request->plant_type);
        }

        if ($request->filled('severity')) {
            $query->where('severity_level', $request->severity);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if ($sortBy === 'popularity') {
            $query->orderBy('views_count', $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $diseases = $query->paginate(12)->withQueryString();

        // Get unique plant types and severity levels for filters
        $plantTypes = Disease::distinct()->pluck('plant_type')->filter()->values();
        $severityLevels = Disease::distinct()->pluck('severity_level')->filter()->values();

        return Inertia::render('DiseaseLibrary/Index', [
            'diseases' => $diseases,
            'filters' => [
                'search' => $request->search,
                'plant_type' => $request->plant_type,
                'severity' => $request->severity,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
            'plantTypes' => $plantTypes,
            'severityLevels' => $severityLevels,
        ]);
    }

    /**
     * Display the specified disease.
     */
    public function show(Disease $disease)
    {
        // Increment view count
        $disease->incrementViews();

        // Load related posts
        $relatedPosts = $disease->posts()
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('DiseaseLibrary/Show', [
            'disease' => $disease->load('scans'),
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Get popular diseases.
     */
    public function popular()
    {
        $popularDiseases = Disease::orderBy('views_count', 'desc')
            ->limit(10)
            ->get();

        return response()->json($popularDiseases);
    }

    /**
     * Get diseases by plant type.
     */
    public function byPlantType(string $plantType)
    {
        $diseases = Disease::where('plant_type', $plantType)
            ->orderBy('name')
            ->get();

        return Inertia::render('DiseaseLibrary/ByPlantType', [
            'diseases' => $diseases,
            'plantType' => $plantType,
        ]);
    }
}