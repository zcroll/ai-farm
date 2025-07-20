<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:2|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // If parent_id is provided, ensure it belongs to the same post
        if ($validated['parent_id']) {
            $parentComment = Comment::find($validated['parent_id']);
            if ($parentComment->post_id !== $post->id) {
                return back()->withErrors(['parent_id' => 'Invalid parent comment.']);
            }
        }

        $comment = Comment::create([
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'],
            'user_id' => Auth::id(),
            'post_id' => $post->id,
        ]);

        $comment->load(['user', 'replies.user']);

        return back()->with('success', 'Comment added successfully!');
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|min:2|max:1000',
        ]);

        $comment->update($validated);
        $comment->touch(); // Update updated_at timestamp

        return back()->with('success', 'Comment updated successfully!');
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        // If this comment has replies, we might want to handle them differently
        // For now, we'll delete the comment and orphan the replies
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully!');
    }

    public function like(Request $request, Comment $comment)
    {
        $user = Auth::user();
        $isLiked = $comment->toggleLike($user);
        $likesCount = $comment->likes()->count();

        if ($request->expectsJson()) {
            return response()->json([
                'likes_count' => $likesCount,
                'is_liked' => $isLiked,
            ]);
        }

        return back()->with('success', $isLiked ? 'Comment liked!' : 'Comment unliked!');
    }
}