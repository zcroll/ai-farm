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
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate(12);

        // Get categories for filter
        $categories = Post::select('category')
            ->distinct()
            ->pluck('category');

        // Get featured posts
        $featuredPosts = Post::with('user')
            ->featured()
            ->published()
            ->limit(3)
            ->get();

        return Inertia::render('Community/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'featuredPosts' => $featuredPosts,
            'filters' => [
                'category' => $request->category ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    public function show(Post $post)
    {
        $post->load(['user', 'comments.user', 'comments.replies.user']);
        
        // Increment view count
        $post->incrementViews();

        // Get related posts
        $relatedPosts = Post::with('user')
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->published()
            ->limit(3)
            ->get();

        return Inertia::render('Community/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
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
        
        // Check if user already liked this post
        $existingLike = DB::table('post_likes')
            ->where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingLike) {
            // Unlike the post
            DB::table('post_likes')
                ->where('post_id', $post->id)
                ->where('user_id', $user->id)
                ->delete();
            
            $isLiked = false;
        } else {
            // Like the post
            DB::table('post_likes')->insert([
                'post_id' => $post->id,
                'user_id' => $user->id,
                'created_at' => now(),
            ]);
            
            $isLiked = true;
        }

        // Get updated like count
        $likesCount = DB::table('post_likes')
            ->where('post_id', $post->id)
            ->count();

        if ($request->expectsJson()) {
            return response()->json([
                'likes' => $likesCount,
                'is_liked' => $isLiked,
            ]);
        }

        return back();
    }

    public function bookmark(Request $request, Post $post)
    {
        $user = auth()->user();
        
        // Check if user already bookmarked this post
        $existingBookmark = DB::table('post_bookmarks')
            ->where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existingBookmark) {
            // Remove bookmark
            DB::table('post_bookmarks')
                ->where('post_id', $post->id)
                ->where('user_id', $user->id)
                ->delete();
            
            $isBookmarked = false;
        } else {
            // Add bookmark
            DB::table('post_bookmarks')->insert([
                'post_id' => $post->id,
                'user_id' => $user->id,
                'created_at' => now(),
            ]);
            
            $isBookmarked = true;
        }

        if ($request->expectsJson()) {
            return response()->json([
                'is_bookmarked' => $isBookmarked,
            ]);
        }

        return back();
    }
}