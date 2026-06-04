<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reports = Report::all();
        $users = User::all();

        foreach ($reports as $report) {
            $count = random_int(0, 4);

            for ($i = 0; $i < $count; $i++) {
                Comment::create([
                    'report_id' => $report->id,
                    'user_id' => $users->random()->id,
                    'content' => fake()->sentence(18),
                ]);
            }
        }
    }
}
