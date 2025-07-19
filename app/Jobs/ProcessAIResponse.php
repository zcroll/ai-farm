<?php

namespace App\Jobs;

use App\Models\AIChat;
use App\Models\AIMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessAIResponse implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 60;
    public $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected AIChat $chat,
        protected string $userMessage,
        protected array $context = []
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Store the user message
            $userMessage = $this->chat->messages()->create([
                'role' => 'user',
                'content' => $this->userMessage,
            ]);

            // Prepare the conversation history
            $conversationHistory = $this->prepareConversationHistory();
            
            // Get AI response from external API
            $aiResponse = $this->getAIResponse($conversationHistory);
            
            // Store the AI response
            $this->chat->messages()->create([
                'role' => 'assistant',
                'content' => $aiResponse['content'],
                'metadata' => [
                    'response_time' => $aiResponse['response_time'] ?? null,
                    'tokens_used' => $aiResponse['tokens_used'] ?? null,
                    'model_used' => $aiResponse['model_used'] ?? null,
                ],
            ]);

            // Update chat title if it's the first message
            if ($this->chat->messages()->count() === 2) {
                $this->chat->update([
                    'title' => $this->generateChatTitle($this->userMessage),
                ]);
            }

        } catch (\Exception $e) {
            Log::error('AI Response processing failed', [
                'chat_id' => $this->chat->id,
                'error' => $e->getMessage(),
            ]);
            
            // Store error message
            $this->chat->messages()->create([
                'role' => 'assistant',
                'content' => 'I apologize, but I encountered an error processing your request. Please try again later.',
                'metadata' => [
                    'error' => $e->getMessage(),
                ],
            ]);
            
            throw $e;
        }
    }

    /**
     * Prepare conversation history for AI context.
     */
    protected function prepareConversationHistory(): array
    {
        $history = [];
        
        // Add context if available
        if (!empty($this->context)) {
            $history[] = [
                'role' => 'system',
                'content' => 'You are a plant disease expert assistant. Use the following context to provide accurate information: ' . json_encode($this->context),
            ];
        }

        // Add recent conversation history (last 10 messages)
        $recentMessages = $this->chat->messages()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->reverse();

        foreach ($recentMessages as $message) {
            $history[] = [
                'role' => $message->role,
                'content' => $message->content,
            ];
        }

        return $history;
    }

    /**
     * Get AI response from external API.
     */
    protected function getAIResponse(array $conversationHistory): array
    {
        $startTime = microtime(true);
        
        // This is a placeholder for the actual API integration
        // You would replace this with your preferred AI service (OpenAI, Claude, etc.)
        $response = Http::timeout(30)->post(config('services.ai.endpoint'), [
            'messages' => $conversationHistory,
            'model' => config('services.ai.model', 'gpt-3.5-turbo'),
            'max_tokens' => 1000,
            'temperature' => 0.7,
        ]);

        $responseTime = microtime(true) - $startTime;

        if ($response->successful()) {
            $data = $response->json();
            return [
                'content' => $data['choices'][0]['message']['content'] ?? 'No response received',
                'response_time' => $responseTime,
                'tokens_used' => $data['usage']['total_tokens'] ?? null,
                'model_used' => $data['model'] ?? null,
            ];
        }

        // Fallback response if API fails
        return [
            'content' => 'I apologize, but I\'m currently unable to process your request. Please try again later.',
            'response_time' => $responseTime,
        ];
    }

    /**
     * Generate a title for the chat based on the first message.
     */
    protected function generateChatTitle(string $message): string
    {
        $words = explode(' ', trim($message));
        $title = implode(' ', array_slice($words, 0, 5));
        
        if (strlen($title) > 50) {
            $title = substr($title, 0, 47) . '...';
        }
        
        return $title ?: 'New Chat';
    }
}