<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\PackageRequest;
use App\Models\Package;
use App\Models\PackageSubscription;
use App\Models\PackagePayment;
use Illuminate\Support\Carbon;
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

        // paginated recent package payments for current user
        $paginated = PackagePayment::with('package')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        $collection = $paginated->getCollection()->map(function ($p) {
            return [
                'id' => $p->id,
                'transaction_code' => $p->transaction_code,
                'package_id' => $p->package_id,
                'package_name' => $p->package?->name ?? null,
                'amount' => $p->amount,
                'currency' => $p->currency,
                'gateway' => $p->gateway,
                'status' => $p->status,
                'paid_at' => $p->paid_at ? Carbon::parse($p->paid_at)->format('d/m/Y H:i') : null,
                'created_at' => Carbon::parse($p->created_at)->format('d/m/Y H:i'),
            ];
        })->toArray();

        $recentPayments = [
            'data' => $collection,
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'prev_page_url' => $paginated->previousPageUrl(),
            'next_page_url' => $paginated->nextPageUrl(),
        ];

        // format active subscription dates for frontend (avoid raw ISO with .000000Z)
        $active = $user?->activePackageSubscription();
        $activeSubscription = null;
        if ($active) {
            $activeSubscription = [
                'id' => $active->id,
                'status' => $active->status,
                'package_id' => $active->package_id,
                'auto_renew' => (bool) $active->auto_renew,
                'price' => $active->price ?? null,
                'started_at' => $active->started_at ? Carbon::parse($active->started_at)->format('d/m/Y H:i') : null,
                'expires_at' => $active->expires_at ? Carbon::parse($active->expires_at)->format('d/m/Y H:i') : null,
                'next_renewal_at' => $active->next_renewal_at ? Carbon::parse($active->next_renewal_at)->format('d/m/Y H:i') : null,
            ];
        }

        return Inertia::render('Packages/Index', [
            'packages' => $packages,
            'activeSubscription' => $activeSubscription,
            'recentPayments' => $recentPayments,
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