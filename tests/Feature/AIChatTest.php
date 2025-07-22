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

test('ai chat direct message accepts disease context', function () {
    $user = User::factory()->create();

    $diseaseContext = [
        'recentScans' => [
            [
                'disease' => 'Tomato Leaf Blight',
                'confidence' => 85,
                'date' => '2024-01-15',
                'treatment' => 'Apply fungicide',
                'severity' => 'moderate'
            ]
        ],
        'knownDiseases' => [
            [
                'name' => 'Tomato Leaf Blight',
                'description' => 'A fungal disease affecting tomato leaves',
                'treatment' => 'Apply copper-based fungicide',
                'prevention' => 'Ensure good air circulation',
                'severity' => 'moderate',
                'plantType' => 'tomato'
            ]
        ]
    ];

    $response = $this->actingAs($user)
        ->postJson('/ai-chat/message', [
            'message' => 'What should I do about my tomato disease?',
            'model' => 'gemini-2.0-flash',
            'diseaseContext' => $diseaseContext
        ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message'
        ]);

    expect($response->json('message'))->toBeString();
    expect(strlen($response->json('message')))->toBeGreaterThan(10);
});
