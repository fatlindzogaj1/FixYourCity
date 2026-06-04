<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $report = $this->route('report');

        return $this->user() !== null && $report !== null && $this->user()->can('update', $report);
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'city_id' => $this->input('city_id') === '' ? null : $this->input('city_id'),
        ]);
    }

    public function rules(): array
    {
        $report = $this->route('report');

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:3000'],
            'category' => ['required', Rule::in(Report::categories())],
            'city_id' => ['nullable', 'exists:cities,id'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'deleted_image_ids' => ['nullable', 'array'],
            'deleted_image_ids.*' => [
                'integer',
                Rule::exists('report_images', 'id')->where(fn ($query) => $query->where('report_id', $report->id)),
            ],
        ];
    }
}
