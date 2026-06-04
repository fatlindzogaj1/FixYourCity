<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportStatusUpdateRequest;
use App\Models\Report;
use App\Models\ReportStatusHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class ReportStatusController extends Controller
{
    public function update(ReportStatusUpdateRequest $request, Report $report): RedirectResponse
    {
        DB::transaction(function () use ($request, $report) {
            $status = $request->validated('status');

            $report->update(['status' => $status]);

            ReportStatusHistory::create([
                'report_id' => $report->id,
                'status' => $status,
                'changed_by' => $request->user()->id,
            ]);
        });

        if ($request->routeIs('dashboard.*')) {
            return back();
        }

        return redirect()->route('reports.show', $report);
    }
}
