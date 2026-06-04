<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    protected $model = Report::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(6),
            'description' => fake()->paragraph(3),
            'category' => fake()->randomElement(Report::categories()),
            'status' => fake()->randomElement(Report::statuses()),
            'latitude' => fake()->latitude(42.55, 43.35),
            'longitude' => fake()->longitude(20.05, 21.85),
            'city_id' => City::factory(),
        ];
    }
}
