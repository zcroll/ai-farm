<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommunityController extends Controller
{
    public function likePost(Request $request, Post $post): JsonResponse
    {
        $user = auth()->user();
        $isLiked = $post->toggleLike($user);
        $likesCount = $post->likes()->count();

        return response()->json([
            'success' => true,
            'is_liked' => $isLiked,
            'likes_count' => $likesCount,
            'message' => $isLiked ? 'Post liked!' : 'Post unliked!',
        ]);
    }

    public function bookmarkPost(Request $request, Post $post): JsonResponse
    {
        $user = auth()->user();
        $isBookmarked = $post->toggleBookmark($user);

        return response()->json([
            'success' => true,
            'is_bookmarked' => $isBookmarked,
            'message' => $isBookmarked ? 'Post bookmarked!' : 'Bookmark removed!',
        ]);
    }

    public function likeComment(Request $request, Comment $comment): JsonResponse
    {
        $user = auth()->user();
        $isLiked = $comment->toggleLike($user);
        $likesCount = $comment->likes()->count();

        return response()->json([
            'success' => true,
            'is_liked' => $isLiked,
            'likes_count' => $likesCount,
            'message' => $isLiked ? 'Comment liked!' : 'Comment unliked!',
        ]);
    }

    public function getPosts(Request $request): JsonResponse
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

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }

    public function getComments(Request $request, Post $post): JsonResponse
    {
        $comments = $post->comments()
            ->approved()
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Add like status for authenticated users
        if (auth()->check()) {
            $comments->each(function ($comment) {
                $comment->setAttribute('is_liked', $comment->is_liked);
                $comment->setAttribute('likes_count', $comment->likes_count);
                
                if ($comment->replies) {
                    $comment->replies->each(function ($reply) {
                        $reply->setAttribute('is_liked', $reply->is_liked);
                        $reply->setAttribute('likes_count', $reply->likes_count);
                    });
                }
            });
        }

        return response()->json([
            'success' => true,
            'data' => $comments,
        ]);
    }

    public function searchPosts(Request $request): JsonResponse
    {
        $search = $request->get('query', '');
        $category = $request->get('category', '');
        $limit = $request->get('limit', 10);

        $query = Post::with(['user'])
            ->published()
            ->withStats();

        if (!empty($search)) {
            $query->search($search);
        }

        if (!empty($category)) {
            $query->byCategory($category);
        }

        $posts = $query->limit($limit)->get();

        // Add like status for authenticated users
        if (auth()->check()) {
            $posts->transform(function ($post) {
                $post->setAttribute('is_liked', $post->is_liked);
                $post->setAttribute('is_bookmarked', $post->is_bookmarked);
                $post->setAttribute('likes', $post->likes_count);
                return $post;
            });
        }

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }

    public function getUserStats(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        $stats = [
            'posts_count' => Post::where('user_id', $user->id)->count(),
            'comments_count' => Comment::where('user_id', $user->id)->count(),
            'likes_given' => $user->likedPosts()->count() + $user->likedComments()->count(),
            'bookmarks_count' => $user->bookmarkedPosts()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}