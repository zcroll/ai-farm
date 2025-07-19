<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Models\Scan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
    
    public function diagnosed(Request $request)
    {
        $user = $request->user();
        
        // Get diagnosed diseases from user's scans
        $diagnosedDiseases = DB::table('scans')
            ->join('diseases', 'scans.disease_id', '=', 'diseases.id')
            ->where('scans.user_id', $user->id)
            ->select([
                'diseases.id',
                'diseases.name',
                'diseases.description',
                'diseases.treatment_suggestions',
                'diseases.severity_level',
                'diseases.average_treatment_time',
                'diseases.plant_type',
                DB::raw('COUNT(scans.id) as detection_count'),
                DB::raw('AVG(scans.confidence) as confidence_avg'),
                DB::raw('MAX(scans.created_at) as last_detected')
            ])
            ->groupBy('diseases.id', 'diseases.name', 'diseases.description', 'diseases.treatment_suggestions', 'diseases.severity_level', 'diseases.average_treatment_time', 'diseases.plant_type')
            ->orderBy('detection_count', 'desc')
            ->get();
        
        // Get stats
        $stats = [
            'total_detections' => Scan::where('user_id', $user->id)->count(),
            'unique_diseases' => $diagnosedDiseases->count(),
            'healthy_detections' => Scan::where('user_id', $user->id)
                ->whereHas('disease', function($q) {
                    $q->where('name', 'like', '%healthy%');
                })->count(),
            'diseased_detections' => Scan::where('user_id', $user->id)
                ->whereHas('disease', function($q) {
                    $q->where('name', 'not like', '%healthy%');
                })->count(),
        ];
        
        return Inertia::render('Diseases/Index', [
            'diagnosedDiseases' => $diagnosedDiseases,
            'stats' => $stats,
        ]);
    }
    
    public function show(Disease $disease)
    {
        return Inertia::render('Diseases/Show', [
            'disease' => $disease,
        ]);
    }
}