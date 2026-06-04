<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ReportCommentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportStatusController;
use App\Http\Controllers\ReportVerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ReportController::class, 'index'])->name('home');
Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::patch('dashboard/reports/{report}/status', [ReportStatusController::class, 'update'])
        ->name('dashboard.reports.status.update');
    Route::delete('dashboard/reports/{report}', [ReportController::class, 'destroy'])
        ->name('dashboard.reports.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('reports', ReportController::class)->except(['index']);

    Route::post('reports/{report}/comments', [ReportCommentController::class, 'store'])
        ->name('reports.comments.store');
    Route::delete('reports/{report}/comments/{comment}', [ReportCommentController::class, 'destroy'])
        ->name('reports.comments.destroy');

    Route::middleware('role:admin,moderator')->group(function () {
        Route::post('reports/{report}/verifications', [ReportVerificationController::class, 'store'])
            ->name('reports.verifications.store');
        Route::patch('reports/{report}/status', [ReportStatusController::class, 'update'])
            ->name('reports.status.update');
    });
});

require __DIR__.'/settings.php';
