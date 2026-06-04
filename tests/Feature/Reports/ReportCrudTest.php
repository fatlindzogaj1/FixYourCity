<?php

use App\Models\City;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('authenticated user can create a report with location and image', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $city = City::factory()->create();

    $response = $this->actingAs($user)->post(route('reports.store'), [
        'title' => 'Broken street light',
        'description' => 'The light has not worked for days.',
        'category' => 'light',
        'city_id' => $city->id,
        'latitude' => 42.6641,
        'longitude' => 21.1655,
        'images' => [UploadedFile::fake()->image('light.jpg')],
    ]);

    $report = Report::query()->first();

    $response->assertRedirect(route('reports.show', $report));

    expect($report)->not->toBeNull();
    expect($report->user_id)->toBe($user->id);
    expect($report->status)->toBe('pending');
    expect($report->images()->count())->toBe(1);

    $reportImage = $report->images()->first();

    expect($reportImage)->not->toBeNull();
    Storage::disk('public')->assertExists($reportImage->image_path);
});

test('owner can update and delete their report', function () {
    $user = User::factory()->create();
    $city = City::factory()->create();
    $report = Report::factory()->for($user)->for($city)->create();

    $this->actingAs($user)->put(route('reports.update', $report), [
        'title' => 'Updated issue title',
        'description' => 'Updated description',
        'category' => 'road',
        'city_id' => $city->id,
        'latitude' => 42.7000,
        'longitude' => 21.2000,
    ])->assertRedirect(route('reports.show', $report));

    $report->refresh();

    expect($report->title)->toBe('Updated issue title');
    expect($report->category)->toBe('road');

    $this->actingAs($user)
        ->delete(route('reports.destroy', $report))
        ->assertRedirect(route('reports.index'));

    $this->assertDatabaseMissing('reports', ['id' => $report->id]);
});

test('moderator can verify and change report status', function () {
    $moderator = User::factory()->create(['role' => 'moderator']);
    $report = Report::factory()->create(['status' => 'pending']);

    $this->actingAs($moderator)
        ->post(route('reports.verifications.store', $report), [
            'status' => 'approved',
            'note' => 'Valid report',
        ])
        ->assertRedirect(route('reports.show', $report));

    $report->refresh();

    expect($report->status)->toBe('verified');

    $this->actingAs($moderator)
        ->patch(route('reports.status.update', $report), [
            'status' => 'resolved',
        ])
        ->assertRedirect(route('reports.show', $report));

    $report->refresh();

    expect($report->status)->toBe('resolved');
    expect($report->statusHistories()->count())->toBeGreaterThanOrEqual(2);
});

test('regular users cannot access moderation routes', function () {
    $user = User::factory()->create(['role' => 'user']);
    $report = Report::factory()->create();

    $this->actingAs($user)
        ->post(route('reports.verifications.store', $report), [
            'status' => 'approved',
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->patch(route('reports.status.update', $report), [
            'status' => 'resolved',
        ])
        ->assertForbidden();
});

