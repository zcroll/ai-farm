<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comment_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('comment_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Ensure a user can only like a comment once
            $table->unique(['user_id', 'comment_id']);
            
            // Index for faster queries
            $table->index(['comment_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comment_likes');
    }
};