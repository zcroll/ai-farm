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
        'tokens_used',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function aiChat(): BelongsTo
    {
        return $this->belongsTo(AIChat::class);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeUserMessages($query)
    {
        return $query->where('role', 'user');
    }

    public function scopeAssistantMessages($query)
    {
        return $query->where('role', 'assistant');
    }

    public function scopeSystemMessages($query)
    {
        return $query->where('role', 'system');
    }
}