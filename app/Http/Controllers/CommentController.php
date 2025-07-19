<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|min:2|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $comment = new Comment($validated);
        $comment->user_id = Auth::id();
        $comment->post_id = $post->id;
        $comment->save();

        $comment->load('user');

        return back()->with('success', 'Comment added successfully!');
    }

    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|min:2|max:1000',
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment updated successfully!');
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully!');
    }

    public function like(Comment $comment)
    {
        $comment->incrementLikes();

        return response()->json(['likes' => $comment->fresh()->likes]);
    }
}