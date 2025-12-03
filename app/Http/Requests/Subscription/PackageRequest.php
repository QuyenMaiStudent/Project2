<?php 

namespace App\Http\Requests\Subscription;

use App\Models\Package;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class PackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user) {
            return false;
        }

        // quick admin shortcuts if model provides them
        if (method_exists($user, 'hasRole') && $user->hasRole('admin')) {
            return true;
        }
        if (isset($user->is_admin) && $user->is_admin) {
            return true;
        }

        // Use Gate to avoid calling unknown methods on the User model directly
        return Gate::forUser($user)->allows('manage', Package::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'array'],
            'features.*' => ['nullable', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $this->merge([
                'is_active' => filter_var($this->input('is_active'), FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        if ($this->has('features') && is_string($this->features)) {
            $features = array_filter(array_map('trim', preg_split('/\r?\n/', $this->features)));
            $this->merge(['features' => array_values($features)]);
        }
    }
}