<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Disease;
use App\Models\Scan;
use App\Models\User;

class ScanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Scan::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'image_path' => fake()->regexify('[A-Za-z0-9]{25f5}'),
            'predicted_disease' => fake()->regexify('[A-Za-z0-9]{255}'),
            'confidence' => fake()->randomFloat(2, 0, 999.99),
            'user_id' => User::factory(),
            'disease_id' => Disease::factory(),
        ];
    }
}
