<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'ai_chat_id',
        'role',
        'content',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the chat that the message belongs to.
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(AIChat::class, 'ai_chat_id');
    }

    /**
     * Check if the message is from the user.
     */
    public function isFromUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Check if the message is from the assistant.
     */
    public function isFromAssistant(): bool
    {
        return $this->role === 'assistant';
    }

    /**
     * Get the response time from metadata.
     */
    public function getResponseTimeAttribute(): ?float
    {
        return $this->metadata['response_time'] ?? null;
    }

    /**
     * Get the tokens used from metadata.
     */
    public function getTokensUsedAttribute(): ?int
    {
        return $this->metadata['tokens_used'] ?? null;
    }
}