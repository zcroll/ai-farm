<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIChat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'context',
        'status',
    ];

    protected $casts = [
        'context' => 'array',
    ];

    /**
     * Get the user that owns the chat.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the messages in this chat.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(AIMessage::class);
    }

    /**
     * Get the user messages in this chat.
     */
    public function userMessages(): HasMany
    {
        return $this->hasMany(AIMessage::class)->where('role', 'user');
    }

    /**
     * Get the assistant messages in this chat.
     */
    public function assistantMessages(): HasMany
    {
        return $this->hasMany(AIMessage::class)->where('role', 'assistant');
    }

    /**
     * Get the last message in the chat.
     */
    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(AIMessage::class)->latest();
    }

    /**
     * Check if the chat is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get the message count.
     */
    public function getMessageCountAttribute(): int
    {
        return $this->messages()->count();
    }
}