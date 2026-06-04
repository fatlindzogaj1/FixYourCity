<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportCommentStoreRequest;
use App\Models\Comment;
use App\Models\Report;
use Illuminate\Http\RedirectResponse;

class ReportCommentController extends Controller
{
    public function store(ReportCommentStoreRequest $request, Report $report): RedirectResponse
    {
        $report->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->validated('content'),
        ]);

        return redirect()->route('reports.show', $report);
    }

    public function destroy(Report $report, Comment $comment): RedirectResponse
    {
        if ($comment->report_id !== $report->id) {
            abort(404);
        }

        $user = request()->user();

        if ($comment->user_id !== $user->id && ! $user->isAdminOrModerator()) {
            abort(403);
        }

        $comment->delete();

        return redirect()->route('reports.show', $report);
    }
}

