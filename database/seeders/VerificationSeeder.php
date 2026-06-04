<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\ReportStatusHistory;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Database\Seeder;

class VerificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $moderators = User::query()->whereIn('role', ['admin', 'moderator'])->get();

        if ($moderators->isEmpty()) {
            return;
        }

        Report::query()
            ->where('status', 'pending')
            ->inRandomOrder()
            ->limit(8)
            ->get()
            ->each(function (Report $report) use ($moderators) {
                $status = fake()->randomElement(['approved', 'rejected']);
                $reportStatus = $status === 'approved' ? 'verified' : 'rejected';
                $moderator = $moderators->random();

                Verification::create([
                    'report_id' => $report->id,
                    'verified_by' => $moderator->id,
                    'status' => $status,
                    'note' => fake()->optional()->sentence(),
                ]);

                $report->update(['status' => $reportStatus]);

                ReportStatusHistory::create([
                    'report_id' => $report->id,
                    'status' => $reportStatus,
                    'changed_by' => $moderator->id,
                ]);
            });
    }
}
