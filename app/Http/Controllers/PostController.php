<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $categories = [
            'all' => 'All Posts',
            'general' => 'General Discussion',
            'question' => 'Questions',
            'experience' => 'Experiences',
            'tip' => 'Tips & Tricks',
        ];

        $featuredPosts = Post::with('user')
            ->featured()
            ->published()
            ->latest()
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
        $post->load(['user', 'approvedComments.user', 'approvedComments.replies.user']);
        $post->incrementViews();

        $relatedPosts = Post::with('user')
            ->where('id', '!=', $post->id)
            ->where('category', $post->category)
            ->published()
            ->latest()
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
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Community/Edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

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
        if ($post->user_id !== Auth::id()) {
            abort(403);
        }

        $post->delete();

        return redirect()->route('community.index')
            ->with('success', 'Post deleted successfully!');
    }
}