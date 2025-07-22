<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Models\Scan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $scans = $user->scans()->with('disease')->orderByDesc('created_at')->paginate(10);

        // Get diseases that the user has encountered through scans
        $userDiseaseNames = $user->scans()
            ->whereNotNull('predicted_disease')
            ->pluck('predicted_disease')
            ->unique()
            ->toArray();

        // Get detailed disease information for diseases the user has encountered
        $userDiseases = Disease::whereIn('name', $userDiseaseNames)->get();

        // Get all diseases for reference
        $allDiseases = Disease::all();

        $total = $user->scans()->count();
        $healthy = $user->scans()->where('predicted_disease', 'LIKE', '%healthy')->count();
        $diseased = $total - $healthy;

        // Get most common diseases for this user
        $commonDiseases = $user->scans()
            ->select('predicted_disease')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('predicted_disease')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Calculate success rate (assuming healthy is success)
        $successRate = $total > 0 ? round(($healthy / $total) * 100, 1) : 0;

        $stats = [
            'total' => $total,
            'healthy' => $healthy,
            'diseased' => $diseased,
            'successRate' => $successRate,
            'commonDiseases' => $commonDiseases,
        ];

        return Inertia::render('dashboard', [
            'auth' => $user,
            'stats' => $stats,
            'history' => $scans,
            'diseases' => $userDiseases, // User's encountered diseases for AI context
            'allDiseases' => $allDiseases, // All diseases for reference
        ]);
    }

    public function scan(Request $request)
    {
        return Inertia::render('Scan');
    }

    public function history(Request $request)
    {
        $user = $request->user();
        $scans = $user->scans()->with('disease')->orderByDesc('created_at')->paginate(20);

        return Inertia::render('History', [
            'scans' => $scans,
        ]);
    }

    public function showScan(Request $request, $id)
    {
        $user = $request->user();
        $scan = Scan::with('disease')->findOrFail($id);

        // Check if the scan belongs to the authenticated user
        if ($scan->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Get similar diseases (same plant type)
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

    public function diseaseLibrary(Request $request)
    {
        $diseases = Disease::all();
        $plantTypes = Disease::select('plant_type')->distinct()->pluck('plant_type');

        return Inertia::render('DiseaseLibrary', [
            'diseases' => $diseases,
            'plantTypes' => $plantTypes,
        ]);
    }
}
