<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class StatisticsFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'group_by' => ['nullable', Rule::in(['day', 'week', 'month'])],
            'preset' => ['nullable', Rule::in(['7d', '30d', '90d'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $preset = $this->input('preset', '30d');

        $defaultEnd = Carbon::now()->endOfDay();
        $defaultStart = match ($preset) {
            '7d' => Carbon::now()->subDays(7)->startOfDay(),
            '90d' => Carbon::now()->subDays(89)->startOfDay(),
            default => Carbon::now()->subDays(29)->startOfDay(),
        };

        $this->merge([
            'start_date' => $this->input('start_date', $defaultStart->toDateString()),
            'end_date' => $this->input('end_date', $defaultEnd->toDateString()),
            'group_by' => $this->input('group_by', 'day'),
            'preset' => $preset,
        ]);
    }
}
