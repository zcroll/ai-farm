<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_id',
        'parent_id',
        'content',
        'likes',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];

    protected $appends = ['likes_count', 'is_liked'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('user');
    }

    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'comment_likes')
                    ->withTimestamps();
    }

    // Accessors
    public function getLikesCountAttribute(): int
    {
        return $this->likes()->count();
    }

    public function getIsLikedAttribute(): bool
    {
        if (!auth()->check()) {
            return false;
        }
        
        return $this->likes()->where('user_id', auth()->id())->exists();
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeWithStats($query)
    {
        return $query->withCount('likes');
    }

    // Helper methods
    public function toggleLike(User $user)
    {
        if ($this->likes()->where('user_id', $user->id)->exists()) {
            $this->likes()->detach($user->id);
            return false; // unliked
        } else {
            $this->likes()->attach($user->id);
            return true; // liked
        }
    }

    // Boot method to auto-approve comments (you can change this logic)
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($comment) {
            if (is_null($comment->is_approved)) {
                $comment->is_approved = true; // Auto-approve for now
            }
        });
    }
}