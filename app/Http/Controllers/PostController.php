<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Disease;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     */
    public function index(Request $request)
    {
        $query = Post::with(['user', 'disease']);

        // Apply filters
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('disease_id')) {
            $query->where('disease_id', $request->disease_id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'popularity') {
            $query->orderBy('views_count', $sortOrder);
        } elseif ($sortBy === 'comments') {
            $query->withCount('comments')->orderBy('comments_count', $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $posts = $query->paginate(15)->withQueryString();

        // Get categories and diseases for filters
        $categories = Post::distinct()->pluck('category')->filter()->values();
        $diseases = Disease::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Community/Index', [
            'posts' => $posts,
            'filters' => [
                'category' => $request->category,
                'disease_id' => $request->disease_id,
                'search' => $request->search,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
            ],
            'categories' => $categories,
            'diseases' => $diseases,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create()
    {
        $diseases = Disease::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Community/Create', [
            'diseases' => $diseases,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'category' => 'required|string|in:general,disease-specific,treatment,prevention',
            'disease_id' => 'nullable|exists:diseases,id',
        ]);

        $post = Auth::user()->posts()->create($validated);

        return redirect()->route('community.show', $post)
            ->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post)
    {
        // Increment view count
        $post->incrementViews();

        // Load post with relationships
        $post->load([
            'user',
            'disease',
            'topLevelComments.user',
            'topLevelComments.replies.user',
        ]);

        return Inertia::render('Community/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        $diseases = Disease::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('Community/Edit', [
            'post' => $post,
            'diseases' => $diseases,
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'category' => 'required|string|in:general,disease-specific,treatment,prevention',
            'disease_id' => 'nullable|exists:diseases,id',
        ]);

        $post->update($validated);

        return redirect()->route('community.show', $post)
            ->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('community.index')
            ->with('success', 'Post deleted successfully!');
    }

    /**
     * Get featured posts.
     */
    public function featured()
    {
        $featuredPosts = Post::where('is_featured', true)
            ->with(['user', 'disease'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json($featuredPosts);
    }

    /**
     * Get posts by category.
     */
    public function byCategory(string $category)
    {
        $posts = Post::where('category', $category)
            ->with(['user', 'disease'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Community/ByCategory', [
            'posts' => $posts,
            'category' => $category,
        ]);
    }
}