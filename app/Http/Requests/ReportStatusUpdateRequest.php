<?php

namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportStatusUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->isAdminOrModerator();
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(array_values(array_filter(Report::statuses(), fn (string $status) => $status !== 'pending')))],
        ];
    }
}

