<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Dashboard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * @see \App\Http\Controllers\DashboardController
 */
final class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function index_behaves_as_expected(): void
    {
        $dashboards = Dashboard::factory()->count(3)->create();

        $response = $this->get(route('dashboards.index'));
    }
}
