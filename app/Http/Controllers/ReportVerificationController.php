<?php

namespace App\Http\Controllers;

use App\Http\Requests\VerificationStoreRequest;
use App\Models\Report;
use App\Models\ReportStatusHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ReportVerificationController extends Controller
{
    public function store(VerificationStoreRequest $request, Report $report): RedirectResponse
    {
        DB::transaction(function () use ($request, $report) {
            $verificationStatus = $request->validated('status');
            $reportStatus = $verificationStatus === 'approved' ? 'verified' : 'rejected';

            $report->verifications()->create([
                'verified_by' => $request->user()->id,
                'status' => $verificationStatus,
                'note' => $request->validated('note'),
            ]);

            $report->update(['status' => $reportStatus]);

            ReportStatusHistory::create([
                'report_id' => $report->id,
                'status' => $reportStatus,
                'changed_by' => $request->user()->id,
            ]);
        });

        return redirect()->route('reports.show', $report);
    }
}

