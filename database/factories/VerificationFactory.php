<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Verification>
 */
class VerificationFactory extends Factory
{
    protected $model = Verification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'report_id' => Report::factory(),
            'verified_by' => User::factory(),
            'status' => fake()->randomElement(['approved', 'rejected']),
            'note' => fake()->optional()->sentence(),
        ];
    }
}
