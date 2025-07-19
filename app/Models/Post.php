<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'disease_id',
        'title',
        'content',
        'category',
        'views_count',
        'likes_count',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'views_count' => 'integer',
        'likes_count' => 'integer',
    ];

    /**
     * Get the user that created the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the disease associated with the post.
     */
    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }

    /**
     * Get the comments for the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the top-level comments (not replies).
     */
    public function topLevelComments(): HasMany
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id');
    }

    /**
     * Increment the view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Get the total comments count including replies.
     */
    public function getTotalCommentsCountAttribute(): int
    {
        return $this->comments()->count();
    }
}