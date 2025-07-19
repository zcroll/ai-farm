<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Load the user relationship for the response
        $comment->load('user');

        if ($request->expectsJson()) {
            return response()->json([
                'comment' => $comment,
                'message' => 'Comment added successfully!',
            ]);
        }

        return back()->with('success', 'Comment added successfully!');
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment->update($validated);

        if ($request->expectsJson()) {
            return response()->json([
                'comment' => $comment->fresh(),
                'message' => 'Comment updated successfully!',
            ]);
        }

        return back()->with('success', 'Comment updated successfully!');
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        if (request()->expectsJson()) {
            return response()->json([
                'message' => 'Comment deleted successfully!',
            ]);
        }

        return back()->with('success', 'Comment deleted successfully!');
    }

    /**
     * Get comments for a post.
     */
    public function getComments(Post $post)
    {
        $comments = $post->topLevelComments()
            ->with(['user', 'replies.user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Like a comment.
     */
    public function like(Comment $comment)
    {
        // Simple like implementation - you might want to use a separate likes table
        $comment->increment('likes_count');

        return response()->json([
            'likes_count' => $comment->fresh()->likes_count,
            'message' => 'Comment liked!',
        ]);
    }

    /**
     * Unlike a comment.
     */
    public function unlike(Comment $comment)
    {
        if ($comment->likes_count > 0) {
            $comment->decrement('likes_count');
        }

        return response()->json([
            'likes_count' => $comment->fresh()->likes_count,
            'message' => 'Comment unliked!',
        ]);
    }
}