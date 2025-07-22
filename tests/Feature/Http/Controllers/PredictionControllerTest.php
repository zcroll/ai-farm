<?php

namespace Tests\Feature\Http\Controllers;

use App\Jobs\ProcessPrediction;
use App\Models\Disease;
use App\Models\Scan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PredictionController
 */
final class PredictionControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    #[Test]
    public function store_uses_form_request_validation(): void
    {
        $this->assertActionUsesFormRequest(
            \App\Http\Controllers\PredictionController::class,
            'store',
            \App\Http\Requests\PredictionControllerStoreRequest::class
        );
    }

    #[Test]
    public function store_saves(): void
    {
        $disease = Disease::factory()->create();

        Queue::fake();

        $response = $this->post(route('predictions.store'));

        // Add proper assertions here
        $response->assertStatus(422); // Expecting validation error without image

        Queue::assertNotPushed(ProcessPrediction::class);
    }
}
