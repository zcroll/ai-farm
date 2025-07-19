<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiseaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Disease::query();
        
        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('plant_type', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Filter by plant type
        if ($request->has('plant_type') && $request->get('plant_type') !== 'all') {
            $query->where('plant_type', $request->get('plant_type'));
        }
        
        $diseases = $query->orderBy('name')->paginate(12);
        
        // Get unique plant types for filter
        $plantTypes = Disease::distinct()->pluck('plant_type')->sort()->values();
        
        return Inertia::render('Diseases/Index', [
            'diseases' => $diseases,
            'plantTypes' => $plantTypes,
            'filters' => $request->only(['search', 'plant_type']),
        ]);
    }
    
    public function show(Disease $disease)
    {
        return Inertia::render('Diseases/Show', [
            'disease' => $disease,
        ]);
    }
}