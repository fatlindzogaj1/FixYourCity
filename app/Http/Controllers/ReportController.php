<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportStoreRequest;
use App\Http\Requests\ReportUpdateRequest;
use App\Models\City;
use App\Models\Report;
use App\Models\ReportStatusHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Report::class, 'report');
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'category', 'city_id', 'search']);

        $reportsQuery = Report::query()
            ->with(['user:id,name', 'city:id,name', 'images:id,report_id,image_path'])
            ->withCount('comments')
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['category'] ?? null, fn ($query, $category) => $query->where('category', $category))
            ->when($filters['city_id'] ?? null, fn ($query, $cityId) => $query->where('city_id', $cityId))
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($inner) use ($search) {
                $inner->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->latest();

        $reports = $reportsQuery->paginate(12)->withQueryString();

        $mapReports = (clone $reportsQuery)
            ->select(['id', 'title', 'category', 'status', 'latitude', 'longitude', 'city_id', 'user_id'])
            ->with(['city:id,name', 'user:id,name'])
            ->get();

        return Inertia::render('reports/index', [
            'reports' => $reports,
            'mapReports' => $mapReports,
            'filters' => $filters,
            'categories' => Report::categories(),
            'statuses' => Report::statuses(),
            'cities' => City::query()->select(['id', 'name'])->orderBy('name')->get(),
            'canModerate' => $request->user()?->isAdminOrModerator() ?? false,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('reports/create', [
            'categories' => Report::categories(),
            'cities' => City::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    public function store(ReportStoreRequest $request): RedirectResponse
    {
        $report = DB::transaction(function () use ($request) {
            $data = $request->validated();

            unset($data['images']);

            $report = Report::create([
                ...$data,
                'user_id' => $request->user()->id,
                'status' => 'pending',
            ]);

            foreach ($request->file('images', []) as $image) {
                $path = $image->store('reports', 'public');
                $report->images()->create(['image_path' => $path]);
            }

            ReportStatusHistory::create([
                'report_id' => $report->id,
                'status' => 'pending',
                'changed_by' => $request->user()->id,
            ]);

            return $report;
        });

        return redirect()->route('reports.show', $report);
    }

    public function show(Report $report): Response
    {
        $report->load([
            'user:id,name',
            'city:id,name',
            'images:id,report_id,image_path',
            'comments:id,report_id,user_id,content,created_at',
            'comments.user:id,name',
            'verifications:id,report_id,verified_by,status,note,verified_at',
            'verifications.verifier:id,name',
            'statusHistories:id,report_id,status,changed_by,changed_at',
            'statusHistories.user:id,name',
        ]);

        return Inertia::render('reports/show', [
            'report' => $report,
            'canModerate' => request()->user()->isAdminOrModerator(),
            'categories' => Report::categories(),
            'statuses' => Report::statuses(),
        ]);
    }

    public function edit(Report $report): Response
    {
        $report->load(['images:id,report_id,image_path']);

        return Inertia::render('reports/edit', [
            'report' => $report,
            'categories' => Report::categories(),
            'cities' => City::query()->select(['id', 'name'])->orderBy('name')->get(),
        ]);
    }

    public function update(ReportUpdateRequest $request, Report $report): RedirectResponse
    {
        DB::transaction(function () use ($request, $report) {
            $data = $request->validated();
            $deletedImageIds = $data['deleted_image_ids'] ?? [];

            unset($data['images'], $data['deleted_image_ids']);

            $report->update($data);

            if (! empty($deletedImageIds)) {
                $images = $report->images()->whereIn('id', $deletedImageIds)->get();

                foreach ($images as $image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }

            foreach ($request->file('images', []) as $image) {
                $path = $image->store('reports', 'public');
                $report->images()->create(['image_path' => $path]);
            }
        });

        return redirect()->route('reports.show', $report);
    }

    public function destroy(Report $report): RedirectResponse
    {
        $paths = $report->images()->pluck('image_path');

        $report->delete();

        Storage::disk('public')->delete($paths->all());

        if (request()->routeIs('dashboard.*')) {
            return back();
        }

        return redirect()->route('reports.index');
    }
}

