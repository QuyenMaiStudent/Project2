<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\PackageRequest;
use App\Models\Package;
use App\Models\PackageSubscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function adminIndex(): Response
    {
        $this->authorize('manage', Package::class);

        $packages = Package::query()
            ->withCount(['subscriptions as active_subscriptions_count' => fn ($q) => $q->active()])
            ->orderByDesc('updated_at')
            ->get();

        return Inertia::render('Packages/Manage', [
            'packages' => $packages,
        ]);
    }

    public function store(PackageRequest $request): RedirectResponse
    {
        $this->authorize('manage', Package::class);

        Package::create($request->validated());

        return back()->with('success', __('Package created successfully.'));
    }

    public function toggleStatus(Package $package): RedirectResponse
    {
        $this->authorize('manage', Package::class);

        $package->update(['is_active' => ! $package->is_active]);

        return back()->with('success', __('Package status updated.'));
    }

    public function index(Request $request): Response
    {
        $user = $request->user();

        $packages = Package::active()->get();

        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'activeSubscription' => $user?->activePackageSubscription(),
        ]);
    }

    public function subscribe(Package $package)
    {
        $this->authorize('subscribe', $package);

        $user = auth()->user();

        // nếu gói có phí > 0 -> chuyển sang bước thanh toán
        if ($package->price > 0) {
            return redirect()->route('packages.checkout', $package);
        }

        $subscription = $user->packageSubscriptions()
            ->where('package_id', $package->id)
            ->first();

        $expiresAt = now()->addDays($package->duration_days);

        if ($subscription && $subscription->isActive()) {
            $subscription->update([
                'expires_at' => $subscription->expires_at->addDays($package->duration_days),
                'next_renewal_at' => $subscription->expires_at,
                'price' => $package->price,
            ]);
        } else {
            $subscription = PackageSubscription::create([
                'package_id' => $package->id,
                'user_id' => $user->id,
                'status' => 'active',
                'auto_renew' => true,
                'price' => $package->price,
                'started_at' => now(),
                'expires_at' => $expiresAt,
                'next_renewal_at' => $expiresAt,
            ]);
        }

        return back()->with('success', __('Subscription activated.'));
    }

    public function cancel(Request $request, PackageSubscription $subscription): RedirectResponse
    {
        abort_unless($subscription->user_id === $request->user()->id, 403);

        $subscription->update([
            'status' => 'cancelled',
            'auto_renew' => false,
            'cancelled_at' => now(),
        ]);

        return back()->with('success', __('Subscription cancelled.'));
    }

    public function toggleAutoRenew(Request $request, PackageSubscription $subscription): RedirectResponse
    {
        abort_unless($subscription->user_id === $request->user()->id, 403);

        $subscription->update([
            'auto_renew' => ! $subscription->auto_renew,
        ]);

        return back()->with('success', __('Auto renew preference updated.'));
    }
}