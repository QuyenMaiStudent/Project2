<?php 

namespace App\Http\Requests\Subscription;

use App\Models\Package;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class RenewalRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user) {
            return false;
        }

        if (method_exists($user, 'hasRole') && $user->hasRole('admin')) {
            return true;
        }
        if (isset($user->is_admin) && $user->is_admin) {
            return true;
        }

        return Gate::forUser($user)->allows('manage', Package::class);
    }

    public function rules(): array
    {
        return [
            'subscription_ids' => ['required', 'array', 'min:1'],
            'subscription_ids.*' => ['integer', 'exists:package_subscriptions,id'],
        ];
    }
}