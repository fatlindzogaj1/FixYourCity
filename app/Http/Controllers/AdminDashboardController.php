<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'category', 'search']);

        $reports = Report::query()
            ->with(['user:id,name', 'city:id,name', 'images:id,report_id,image_path'])
            ->withCount('comments')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('dashboard', [
            'reports' => $reports,
            'filters' => $filters,
            'categories' => Report::categories(),
            'statuses' => Report::statuses(),
        ]);
    }
}

