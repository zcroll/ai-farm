<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessAIResponse;
use App\Models\AIChat;
use App\Models\Disease;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AIChatController extends Controller
{
    /**
     * Display a listing of AI chats.
     */
    public function index()
    {
        $chats = Auth::user()->aiChats()
            ->with('messages')
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return Inertia::render('AIChat/Index', [
            'chats' => $chats,
        ]);
    }

    /**
     * Show the form for creating a new chat.
     */
    public function create()
    {
        $diseases = Disease::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('AIChat/Create', [
            'diseases' => $diseases,
        ]);
    }

    /**
     * Store a newly created chat.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'context' => 'nullable|array',
        ]);

        $chat = Auth::user()->aiChats()->create($validated);

        return redirect()->route('ai-chat.show', $chat);
    }

    /**
     * Display the specified chat.
     */
    public function show(AIChat $chat)
    {
        $this->authorize('view', $chat);

        $chat->load(['messages' => function ($query) {
            $query->orderBy('created_at', 'asc');
        }]);

        $diseases = Disease::orderBy('name')->get(['id', 'name']);

        return Inertia::render('AIChat/Show', [
            'chat' => $chat,
            'diseases' => $diseases,
        ]);
    }

    /**
     * Send a message to the AI.
     */
    public function sendMessage(Request $request, AIChat $chat)
    {
        $this->authorize('view', $chat);

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'context' => 'nullable|array',
        ]);

        // Dispatch the job to process the AI response
        ProcessAIResponse::dispatch($chat, $validated['message'], $validated['context'] ?? []);

        return response()->json([
            'message' => 'Message sent! AI is processing your request.',
        ]);
    }

    /**
     * Get the latest messages for a chat.
     */
    public function getMessages(AIChat $chat)
    {
        $this->authorize('view', $chat);

        $messages = $chat->messages()
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Update the specified chat.
     */
    public function update(Request $request, AIChat $chat)
    {
        $this->authorize('update', $chat);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'context' => 'nullable|array',
            'status' => 'nullable|string|in:active,archived,deleted',
        ]);

        $chat->update($validated);

        if ($request->expectsJson()) {
            return response()->json([
                'chat' => $chat->fresh(),
                'message' => 'Chat updated successfully!',
            ]);
        }

        return back()->with('success', 'Chat updated successfully!');
    }

    /**
     * Remove the specified chat.
     */
    public function destroy(AIChat $chat)
    {
        $this->authorize('delete', $chat);

        $chat->delete();

        if (request()->expectsJson()) {
            return response()->json([
                'message' => 'Chat deleted successfully!',
            ]);
        }

        return redirect()->route('ai-chat.index')
            ->with('success', 'Chat deleted successfully!');
    }

    /**
     * Archive a chat.
     */
    public function archive(AIChat $chat)
    {
        $this->authorize('update', $chat);

        $chat->update(['status' => 'archived']);

        return response()->json([
            'message' => 'Chat archived successfully!',
        ]);
    }

    /**
     * Get disease context for AI chat.
     */
    public function getDiseaseContext(Disease $disease)
    {
        $context = [
            'disease_name' => $disease->name,
            'description' => $disease->description,
            'symptoms' => $disease->symptoms,
            'causes' => $disease->causes,
            'treatment_suggestions' => $disease->treatment_suggestions,
            'prevention_methods' => $disease->prevention_methods,
            'severity_level' => $disease->severity_level,
        ];

        return response()->json($context);
    }

    /**
     * Get chat suggestions based on user's scan history.
     */
    public function getSuggestions()
    {
        $user = Auth::user();
        
        // Get recent scans to suggest relevant topics
        $recentScans = $user->scans()
            ->with('disease')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $suggestions = [];
        
        foreach ($recentScans as $scan) {
            if ($scan->disease) {
                $suggestions[] = "Tell me more about {$scan->disease->name}";
                $suggestions[] = "How can I prevent {$scan->disease->name}?";
                $suggestions[] = "What are the best treatments for {$scan->disease->name}?";
            }
        }

        // Add general suggestions
        $suggestions = array_merge($suggestions, [
            "What are the most common plant diseases?",
            "How can I improve my plant's health?",
            "What are the signs of plant stress?",
            "How do I identify plant diseases early?",
        ]);

        return response()->json(array_slice($suggestions, 0, 8));
    }
}