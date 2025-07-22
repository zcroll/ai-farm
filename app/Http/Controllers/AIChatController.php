<?php

namespace App\Http\Controllers;

use App\Models\AIChat;
use App\Models\AIMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AIChatController extends Controller
{
    public function index()
    {
        $chats = Auth::user()->aiChats()
            ->with('messages')
            ->orderBy('last_activity', 'desc')
            ->paginate(10);

        dsd($chats);

        return Inertia::render('AIChat/Index', [
            'chats' => $chats,
        ]);
    }

    public function show(AIChat $chat)
    {
        $this->authorize('view', $chat);

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
            'model' => 'nullable|string|in:gpt-3.5-turbo,gpt-4,claude-3,gemini-2.0-flash',
        ]);

        $chat = new AIChat($validated);
        $chat->user_id = Auth::id();
        $chat->last_activity = now();
        $chat->save();

        // Add system message
        $systemMessage = new AIMessage([
            'role' => 'system',
            'content' => 'You are a helpful AI assistant specialized in plant disease detection and gardening advice. You can help users identify plant diseases, provide treatment recommendations, and answer gardening questions.',
        ]);
        $chat->messages()->save($systemMessage);

        return redirect()->route('ai-chat.show', $chat);
    }

    public function sendMessage(Request $request, AIChat $chat)
    {
        $this->authorize('update', $chat);

        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        // Save user message
        $userMessage = new AIMessage([
            'role' => 'user',
            'content' => $validated['message'],
        ]);
        $chat->messages()->save($userMessage);

        // Generate AI response
        $aiResponse = $this->generateAIResponse($validated['message'], $chat);

        // Save AI response
        $aiMessage = new AIMessage([
            'role' => 'assistant',
            'content' => $aiResponse,
        ]);
        $chat->messages()->save($aiMessage);

        // Update chat activity
        $chat->updateLastActivity();

        return response()->json([
            'user_message' => $userMessage,
            'ai_message' => $aiMessage,
        ]);
    }

    public function destroy(AIChat $chat)
    {
        $this->authorize('delete', $chat);

        $chat->delete();

        return redirect()->route('ai-chat.index')
            ->with('success', 'Chat deleted successfully!');
    }

    /**
     * Direct message endpoint for chatput functionality
     * Creates a temporary chat session and returns AI response
     */
    public function directMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'model' => 'nullable|string|in:gpt-3.5-turbo,gpt-4,claude-3,gemini-2.0-flash',
        ]);

        try {
            // Generate AI response directly without saving to database
            $aiResponse = $this->generateDirectAIResponse($validated['message'], $validated['model'] ?? 'gemini-2.0-flash');

            return response()->json([
                'message' => $aiResponse,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in direct message: ' . $e->getMessage());
            return response()->json([
                'message' => 'Sorry, there was an error processing your request.',
            ], 500);
        }
    }

    private function generateAIResponse($message, $chat)
    {
        // Use the model from the chat or default to gemini-2.0-flash
        $model = $chat->model ?? 'gemini-2.0-flash';

        try {
            // Use Prism to generate response with simple prompt
            $response = prism()
                ->text()
                ->using('gemini', 'gemini-2.0-flash')
                ->withPrompt($message)
                ->generate();

            return $response->text;

        } catch (\Exception $e) {
            Log::error('Error generating AI response: ' . $e->getMessage());

            // Fallback responses
            $responses = [
                "I understand you're asking about plant health. Based on your question, I'd recommend checking the soil moisture and ensuring proper drainage.",
                "That's an interesting question about plant diseases. The symptoms you're describing could be related to several common issues. Let me help you identify the problem.",
                "For plant disease prevention, I recommend regular monitoring, proper spacing, and maintaining good air circulation around your plants.",
            ];
            return $responses[array_rand($responses)];
        }
    }

    /**
     * Generate AI response for direct messages (chatput functionality)
     */
    private function generateDirectAIResponse($message, $model = 'gemini-2.0-flash')
    {
        try {
            // Create a prompt with system context
            $prompt = "You are a helpful AI assistant specialized in plant disease detection and gardening advice. You can help users identify plant diseases, provide treatment recommendations, and answer gardening questions.\n\nUser: " . $message;

            // Use Prism to generate response
            $response = prism()
                ->text()
                ->using('gemini', 'gemini-2.0-flash')
                ->withPrompt($prompt)
                ->generate();

            return $response->text;

        } catch (\Exception $e) {
            Log::error('Error generating direct AI response: ' . $e->getMessage());

            // Fallback responses
            $responses = [
                "I understand you're asking about plant health. Based on your question, I'd recommend checking the soil moisture and ensuring proper drainage.",
                "That's an interesting question about plant diseases. The symptoms you're describing could be related to several common issues. Let me help you identify the problem.",
                "For plant disease prevention, I recommend regular monitoring, proper spacing, and maintaining good air circulation around your plants.",
            ];
            return $responses[array_rand($responses)];
        }
    }
}
