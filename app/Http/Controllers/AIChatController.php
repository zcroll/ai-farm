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
            ->with('messages')
            ->orderBy('last_activity', 'desc')
            ->paginate(10);

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

        // Generate AI response (placeholder - you'll need to integrate with an AI service)
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

    private function generateAIResponse($message, $chat)
    {
        // Use the model from the chat or default to gemini-2.0-flash
        $model = $chat->model ?? 'gemini-2.0-flash';
        if ($model === 'gemini-2.0-flash') {
            // Hardcoded Gemini API endpoint and key
            $endpoint = 'https://prisme.example.com/gemini/v1/chat'; // <-- replace with actual endpoint
            $apiKey = 'YOUR_GEMINI_API_KEY'; // <-- replace with actual key
            try {
                $client = new \GuzzleHttp\Client();
                $response = $client->post($endpoint, [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $apiKey,
                        'Content-Type' => 'application/json',
                    ],
                    'json' => [
                        'model' => 'gemini-2.0-flash',
                        'messages' => [
                            ['role' => 'user', 'content' => $message],
                        ],
                    ],
                    'timeout' => 30,
                ]);
                $data = json_decode($response->getBody(), true);
                if (isset($data['choices'][0]['message']['content'])) {
                    return $data['choices'][0]['message']['content'];
                } elseif (isset($data['message'])) {
                    return $data['message'];
                } else {
                    return 'Sorry, I could not process your request.';
                }
            } catch (\Exception $e) {
                return 'Error communicating with Gemini: ' . $e->getMessage();
            }
        }
        // ... fallback for other models or placeholder ...
        $responses = [
            "I understand you're asking about plant health. Based on your question, I'd recommend checking the soil moisture and ensuring proper drainage.",
            "That's an interesting question about plant diseases. The symptoms you're describing could be related to several common issues. Let me help you identify the problem.",
            "For plant disease prevention, I recommend regular monitoring, proper spacing, and maintaining good air circulation around your plants.",
            "Based on your description, this sounds like it could be a fungal infection. I'd suggest removing affected leaves and applying a fungicide.",
            "Healthy plants typically have vibrant green leaves, strong stems, and no visible spots or discoloration. If you're seeing unusual symptoms, it's best to act quickly.",
        ];
        return $responses[array_rand($responses)];
    }
}