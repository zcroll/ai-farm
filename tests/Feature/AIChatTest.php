<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('ai chat direct message endpoint works', function () {
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
        ->postJson('/ai-chat/message', [
            'message' => 'Hello, can you help me with my plant?',
            'model' => 'gemini-2.0-flash'
        ]);
    
    $response->assertStatus(200)
        ->assertJsonStructure([
            'message'
        ]);
    
    expect($response->json('message'))->toBeString();
});

test('ai chat direct message requires authentication', function () {
    $response = $this->postJson('/ai-chat/message', [
        'message' => 'Hello, can you help me with my plant?'
    ]);
    
    $response->assertStatus(401);
});

test('ai chat direct message validates required fields', function () {
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
        ->postJson('/ai-chat/message', []);
    
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('ai chat direct message validates message length', function () {
    $user = User::factory()->create();
    
    $longMessage = str_repeat('a', 2001); // Exceeds 2000 character limit
    
    $response = $this->actingAs($user)
        ->postJson('/ai-chat/message', [
            'message' => $longMessage
        ]);
    
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});
