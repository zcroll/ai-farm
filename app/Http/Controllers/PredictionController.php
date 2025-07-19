<?php

namespace App\Http\Controllers;

use App\Http\Requests\PredictionStoreRequest;
use App\Jobs\ProcessPrediction;
use App\Models\Disease;
use App\Models\Scan;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PredictionController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|max:2048',
            ]);

            // Get user if authenticated, otherwise use a default user for testing
            $user = $request->user() ?? \App\Models\User::first();
            
            if (!$user) {
                return response()->json(['error' => 'User not found. Please login.'], 401);
            }
            
            $image = $request->file('image');
            $imagePath = $image->store('scans', 'public');
            
            // Get the absolute path to the stored image
            $absImagePath = Storage::disk('public')->path($imagePath);

            // Log the file path for debugging
            Log::info('Processing image', [
                'image_path' => $imagePath,
                'abs_path' => $absImagePath,
                'exists' => file_exists($absImagePath)
            ]);

            // Use the exact paths from the .env file
            $python = env('PYTHON_EXECUTABLE_PATH', '/home/zcroll/.pyenv/versions/3.11.9/bin/python3');
            $script = env('PREDICTION_SCRIPT_PATH', '/home/zcroll/Desktop/abdo/predict.py');
            
            // Log the command for debugging
            Log::info('Running prediction command', [
                'python' => $python,
                'script' => $script,
                'script_exists' => file_exists($script),
                'command' => "$python $script $absImagePath"
            ]);

            // Create the process with the command
            $process = new Process([$python, $script, $absImagePath]);
            $process->setTimeout(60); // Give it more time to run
            
            // Run the process
            $process->run();

            // Check if the process was successful
            if (!$process->isSuccessful()) {
                Log::error('Prediction process failed', [
                    'exit_code' => $process->getExitCode(),
                    'error_output' => $process->getErrorOutput(),
                    'output' => $process->getOutput()
                ]);
                
                return response()->json([
                    'error' => 'Prediction failed', 
                    'details' => $process->getErrorOutput(),
                    'output' => $process->getOutput(),
                    'command' => implode(' ', [$python, $script, $absImagePath])
                ], 500);
            }

            // Get the raw output
            $rawOutput = $process->getOutput();
            
            // Log the raw output for debugging
            Log::info('Raw prediction output', [
                'raw_output' => $rawOutput
            ]);
            
            // Extract the JSON part from the output
            // Look for the last line that contains a JSON object
            $lines = explode("\n", trim($rawOutput));
            $jsonLine = end($lines);
            
            // Parse the JSON output
            $output = json_decode($jsonLine, true);
            
            // Log the parsed output for debugging
            Log::info('Parsed prediction output', [
                'json_line' => $jsonLine,
                'parsed_output' => $output
            ]);

            if (!$output || isset($output['error'])) {
                return response()->json([
                    'error' => $output['error'] ?? 'Invalid output from prediction script',
                    'raw_output' => $rawOutput
                ], 500);
            }

            // Try to find the disease in the database with exact match
            $disease = Disease::where('name', $output['prediction'])->first();
            
            // If not found, try to find a similar disease name
            if (!$disease) {
                Log::warning('Exact disease match not found, trying similar names', [
                    'prediction' => $output['prediction']
                ]);
                
                // Get all diseases
                $allDiseases = Disease::all();
                
                // Try to find the closest match
                $bestMatch = null;
                $highestSimilarity = 0;
                
                foreach ($allDiseases as $possibleDisease) {
                    $similarity = similar_text($possibleDisease->name, $output['prediction'], $percent);
                    
                    if ($percent > $highestSimilarity) {
                        $highestSimilarity = $percent;
                        $bestMatch = $possibleDisease;
                    }
                }
                
                // If we found a match with at least 70% similarity, use it
                if ($bestMatch && $highestSimilarity >= 70) {
                    $disease = $bestMatch;
                    Log::info('Found similar disease', [
                        'original' => $output['prediction'],
                        'matched' => $disease->name,
                        'similarity' => $highestSimilarity
                    ]);
                } else {
                    // Create a new disease record as fallback
                    $disease = Disease::create([
                        'name' => $output['prediction'],
                        'description' => 'Automatically created from prediction',
                        'treatment_suggestions' => 'Please consult a plant specialist for treatment options.',
                        'source_url' => null
                    ]);
                    
                    Log::info('Created new disease record', [
                        'name' => $output['prediction']
                    ]);
                }
            }

            // Create the scan record
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
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function testModel(Request $request)
    {
        try {
            $python = env('PYTHON_EXECUTABLE_PATH', '/home/zcroll/.pyenv/versions/3.11.9/bin/python3');
            $testScript = base_path('test_model.py');
            
            Log::info('Running test model', [
                'python' => $python,
                'script' => $testScript,
                'script_exists' => file_exists($testScript)
            ]);

            $process = new Process([$python, $testScript]);
            $process->setTimeout(60);
            $process->run();

            if (!$process->isSuccessful()) {
                Log::error('Test model failed', [
                    'exit_code' => $process->getExitCode(),
                    'error_output' => $process->getErrorOutput(),
                    'output' => $process->getOutput()
                ]);
                
                return response()->json([
                    'error' => 'Test model failed',
                    'error_output' => $process->getErrorOutput(),
                    'output' => $process->getOutput(),
                    'command' => implode(' ', [$python, $testScript])
                ], 500);
            }

            return response()->json([
                'output' => $process->getOutput(),
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            Log::error('Exception in test model', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'An error occurred during test model',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
