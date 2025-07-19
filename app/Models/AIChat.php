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
        'model',
        'context',
        'is_active',
        'last_activity',
    ];

    protected $casts = [
        'context' => 'array',
        'is_active' => 'boolean',
        'last_activity' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(AIMessage::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function updateLastActivity()
    {
        $this->update(['last_activity' => now()]);
    }

    public function getLastMessageAttribute()
    {
        return $this->messages()->latest()->first();
    }

    public function getMessageCountAttribute()
    {
        return $this->messages()->count();
    }
}