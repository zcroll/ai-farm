<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user', 'comments'])
            ->published()
            ->withStats()
            ->orderBy('is_pinned', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->get('search'));
        }

        // Category filter
        if ($request->filled('category')) {
            $query->byCategory($request->get('category'));
        }

        // Sort functionality
        $sort = $request->get('sort', 'latest');
        $query->sortBy($sort);

        $posts = $query->paginate(12);

        // Add like and bookmark status for authenticated users
        if (auth()->check()) {
            $posts->getCollection()->transform(function ($post) {
                $post->setAttribute('is_liked', $post->is_liked);
                $post->setAttribute('is_bookmarked', $post->is_bookmarked);
                $post->setAttribute('likes', $post->likes_count);
                return $post;
            });
        }

        // Get categories for filter dropdown
        $categories = Post::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category')
            ->sort()
            ->values();

        // Get featured posts
        $featuredPosts = Post::with(['user'])
            ->featured()
            ->published()
            ->withStats()
            ->orderByDesc('created_at')
            ->limit(4)
            ->get();

        // Add stats for featured posts
        if (auth()->check()) {
            $featuredPosts->transform(function ($post) {
                $post->setAttribute('is_liked', $post->is_liked);
                $post->setAttribute('is_bookmarked', $post->is_bookmarked);
                $post->setAttribute('likes', $post->likes_count);
                return $post;
            });
        }

        return Inertia::render('Community/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'featuredPosts' => $featuredPosts,
            'filters' => $request->only(['search', 'category', 'sort']),
        ]);
    }

    public function show(Post $post)
    {
        // Load relationships with proper nested loading
        $post->load([
            'user', 
            'comments' => function ($query) {
                $query->approved()->with(['user', 'replies.user'])->orderBy('created_at', 'asc');
            }
        ]);
        
        // Increment view count
        $post->incrementViews();

        // Add like and bookmark status for authenticated users
        if (auth()->check()) {
            $post->setAttribute('is_liked', $post->is_liked);
            $post->setAttribute('is_bookmarked', $post->is_bookmarked);
            $post->setAttribute('likes', $post->likes_count);
            
            // Add like status for comments
            $post->comments->each(function ($comment) {
                $comment->setAttribute('is_liked', $comment->is_liked);
                $comment->setAttribute('likes_count', $comment->likes_count);
                
                // Add like status for replies
                if ($comment->replies) {
                    $comment->replies->each(function ($reply) {
                        $reply->setAttribute('is_liked', $reply->is_liked);
                        $reply->setAttribute('likes_count', $reply->likes_count);
                    });
                }
            });
        }

        // Get related posts
        $relatedPosts = Post::with('user')
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->published()
            ->withStats()
            ->limit(4)
            ->get();

        return Inertia::render('Community/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Community/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|in:general,question,experience,tip',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'image' => 'nullable|image|max:2048',
        ]);

        $post = new Post($validated);
        $post->user_id = Auth::id();
        $post->published_at = now();

        if ($request->hasFile('image')) {
            $post->image_path = $request->file('image')->store('posts', 'public');
        }

        $post->save();

        return redirect()->route('community.show', $post)
            ->with('success', 'Post created successfully!');
    }

    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        return Inertia::render('Community/Edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:10',
            'category' => 'required|in:general,question,experience,tip',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'image' => 'nullable|image|max:2048',
        ]);

        $post->update($validated);

        if ($request->hasFile('image')) {
            $post->image_path = $request->file('image')->store('posts', 'public');
            $post->save();
        }

        return redirect()->route('community.show', $post)
            ->with('success', 'Post updated successfully!');
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('community.index')
            ->with('success', 'Post deleted successfully!');
    }

    public function like(Request $request, Post $post)
    {
        $user = auth()->user();
        $isLiked = $post->toggleLike($user);
        $likesCount = $post->likes()->count();

        if ($request->expectsJson()) {
            return response()->json([
                'likes' => $likesCount,
                'is_liked' => $isLiked,
            ]);
        }

        return back()->with('success', $isLiked ? 'Post liked!' : 'Post unliked!');
    }

    public function bookmark(Request $request, Post $post)
    {
        $user = auth()->user();
        $isBookmarked = $post->toggleBookmark($user);

        if ($request->expectsJson()) {
            return response()->json([
                'is_bookmarked' => $isBookmarked,
            ]);
        }

        return back()->with('success', $isBookmarked ? 'Post bookmarked!' : 'Bookmark removed!');
    }
}