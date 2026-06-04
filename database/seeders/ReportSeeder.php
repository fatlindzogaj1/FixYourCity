<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::pluck('id');
        $cities = City::pluck('id');

        foreach (range(1, 20) as $i) {
            Report::create([
                'user_id' => $users->random(),
                'title' => 'Issue ' . $i,
                'description' => 'Sample problem in the city',
                'category' => collect(['trash', 'road', 'light', 'other'])->random(),
                'status' => 'pending',
                'latitude' => rand(42000000, 43000000) / 1000000,
                'longitude' => rand(20000000, 21000000) / 1000000,
                'city_id' => $cities->random()
            ]);
        }

    }
}
