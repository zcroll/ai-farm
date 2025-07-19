<?php

namespace Tests\Feature\Http\Controllers;

use App\Jobs\ProcessPrediction;
use App\Models\Disease:name,request;
use App\Models\Scan:userId,predictedDisease,confidence,imagePath,diseaseId;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Queue;
use JMac\Testing\Traits\AdditionalAssertions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\PredictionController
 */
final class PredictionControllerTest extends TestCase
{
    use AdditionalAssertions, RefreshDatabase, WithFaker;

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
        $prediction = Disease:name,request::factory()->create();

        Queue::fake();

        $response = $this->post(route('predictions.store'));

        $response->assertSessionHas('image:scans', $image:scans);

        $this->assertDatabaseHas(scan:userId,predictedDisease,confidence,imagePath,diseaseIds, [ /* ... */ ]);

        Queue::assertPushed(ProcessPrediction::class);
    }
}
