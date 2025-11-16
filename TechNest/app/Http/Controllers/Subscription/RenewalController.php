<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\RenewalRequest;
use Illuminate\Http\RedirectResponse;

use App\Models\Package;
use App\Models\PackageSubscription;

use function Symfony\Component\Clock\now;

class RenewalController extends Controller
{
    public function run(RenewalRequest $request): RedirectResponse
    {
        $this->authorize('manage', Package::class);

        $query = PackageSubscription::with(['package', 'renewals', 'user'])
            ->whereIn('id', $request->validated('subscription_ids'));

        $processed = 0;

        $query->get()->each(function (PackageSubscription $subscription) use (&$processed) {
            if (! $subscription->isActive()) {
                return;
            }

            if (! $subscription->auto_renew) {
                return;
            }

            $package = $subscription->package;

            $from = $subscription->expires_at ?? now();
            $to = $from->copy()->addDays($package->duration_days);

            $renewal = $subscription->renewals()->create([
                'status' => 'processed',
                'processed_at' => now(),
                'renewed_from' => $from,
                'renewed_to' => $to,
            ]);

            $subscription->update([
                'status' => 'active',
                'last_renewed_at' => now(),
                'expires_at' => $to,
                'next_renewal_at' => $to,
            ]);

            $processed++;
        });

        return back()->with('success', trans_choice(':count subscription renewed.', $processed, ['count' => $processed]));
    }
}