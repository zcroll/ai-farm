<?php

namespace App\Http\Controllers;

use App\Models\AIChat;
use App\Models\AIMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AIChatController extends Controller
{
    public function index()
    {
        $chats = Auth::user()->aiChats()
            ->with(['messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->active()
            ->latest()
            ->paginate(10);

        return Inertia::render('AIChat/Index', [
            'chats' => $chats,
        ]);
    }

    public function show(AIChat $chat)
    {
        if ($chat->user_id !== Auth::id()) {
            abort(403);
        }

        $chat->load(['messages' => function ($query) {
            $query->orderBy('created_at', 'asc');
        }]);

        return Inertia::render('AIChat/Show', [
            'chat' => $chat,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'initial_message' => 'required|string|min:1',
        ]);

        $chat = new AIChat([
            'user_id' => Auth::id(),
            'title' => $validated['title'] ?? 'New Chat',
            'status' => 'active',
        ]);
        $chat->save();

        // Create initial user message
        $userMessage = new AIMessage([
            'ai_chat_id' => $chat->id,
            'role' => 'user',
            'content' => $validated['initial_message'],
        ]);
        $userMessage->save();

        // Create AI response (simulated for now)
        $aiResponse = $this->generateAIResponse($validated['initial_message']);
        $aiMessage = new AIMessage([
            'ai_chat_id' => $chat->id,
            'role' => 'assistant',
            'content' => $aiResponse,
        ]);
        $aiMessage->save();

        return redirect()->route('ai-chat.show', $chat);
    }

    public function sendMessage(Request $request, AIChat $chat)
    {
        if ($chat->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|min:1',
        ]);

        // Create user message
        $userMessage = new AIMessage([
            'ai_chat_id' => $chat->id,
            'role' => 'user',
            'content' => $validated['content'],
        ]);
        $userMessage->save();

        // Generate AI response
        $aiResponse = $this->generateAIResponse($validated['content']);
        $aiMessage = new AIMessage([
            'ai_chat_id' => $chat->id,
            'role' => 'assistant',
            'content' => $aiResponse,
        ]);
        $aiMessage->save();

        return response()->json([
            'user_message' => $userMessage,
            'ai_message' => $aiMessage,
        ]);
    }

    public function update(AIChat $chat, Request $request)
    {
        if ($chat->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $chat->update($validated);

        return back()->with('success', 'Chat title updated successfully!');
    }

    public function destroy(AIChat $chat)
    {
        if ($chat->user_id !== Auth::id()) {
            abort(403);
        }

        $chat->update(['status' => 'deleted']);

        return redirect()->route('ai-chat.index')
            ->with('success', 'Chat deleted successfully!');
    }

    public function archive(AIChat $chat)
    {
        if ($chat->user_id !== Auth::id()) {
            abort(403);
        }

        $chat->update(['status' => 'archived']);

        return back()->with('success', 'Chat archived successfully!');
    }

    private function generateAIResponse($userMessage)
    {
        // This is a simple response generator
        // In a real application, you would integrate with an AI service like OpenAI
        $responses = [
            "I understand you're asking about plant diseases. Let me help you with that.",
            "That's an interesting question about plant health. Here's what I can tell you...",
            "Based on your question, I'd recommend checking the following...",
            "For plant disease identification, you should consider these factors...",
            "I can help you with plant care and disease prevention. Here are some tips...",
        ];

        return $responses[array_rand($responses)] . " " . 
               "This is a simulated response. In a production environment, this would be connected to a real AI service for plant disease diagnosis and advice.";
    }
}