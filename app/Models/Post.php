<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'image_path',
        'category',
        'tags',
        'views',
        'likes',
        'is_featured',
        'is_pinned',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['likes_count', 'comments_count'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->with(['user', 'replies.user']);
    }

    public function allComments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'post_likes')
                    ->withTimestamps();
    }

    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'post_bookmarks')
                    ->withTimestamps();
    }

    // Accessors
    public function getLikesCountAttribute(): int
    {
        return $this->likes()->count();
    }

    public function getCommentsCountAttribute(): int
    {
        return $this->allComments()->count();
    }

    public function getIsLikedAttribute(): bool
    {
        if (!auth()->check()) {
            return false;
        }
        
        return $this->likes()->where('user_id', auth()->id())->exists();
    }

    public function getIsBookmarkedAttribute(): bool
    {
        if (!auth()->check()) {
            return false;
        }
        
        return $this->bookmarks()->where('user_id', auth()->id())->exists();
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeByCategory($query, $category)
    {
        if (empty($category)) {
            return $query;
        }
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        if (empty($search)) {
            return $query;
        }
        
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhereHas('user', function ($userQuery) use ($search) {
                  $userQuery->where('name', 'like', "%{$search}%");
              });
        });
    }

    public function scopeWithStats($query)
    {
        return $query->withCount(['allComments', 'likes']);
    }

    public function scopeSortBy($query, $sort = 'latest')
    {
        switch ($sort) {
            case 'popular':
                return $query->orderByDesc('likes')->orderByDesc('created_at');
            case 'discussed':
                return $query->withCount('allComments')->orderByDesc('all_comments_count')->orderByDesc('created_at');
            case 'unanswered':
                return $query->whereDoesntHave('allComments')->orderByDesc('created_at');
            case 'latest':
            default:
                return $query->orderByDesc('created_at');
        }
    }

    // Helper methods
    public function incrementViews()
    {
        $this->increment('views');
    }

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

    public function toggleBookmark(User $user)
    {
        if ($this->bookmarks()->where('user_id', $user->id)->exists()) {
            $this->bookmarks()->detach($user->id);
            return false; // unbookmarked
        } else {
            $this->bookmarks()->attach($user->id);
            return true; // bookmarked
        }
    }

    // Boot method to set published_at when creating
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($post) {
            if (is_null($post->published_at)) {
                $post->published_at = now();
            }
        });
    }
}