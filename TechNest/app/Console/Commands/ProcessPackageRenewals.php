<?php

namespace App\Console\Commands;

use App\Models\PackageSubscription;
use Illuminate\Console\Command;

class ProcessPackageRenewals extends Command
{
    protected $signature = 'package:renewals {--force : Renew even if not yet expired}';

    protected $description = 'Process package auto renewals';

    public function handle(): int
    {
        $query = PackageSubscription::with('package')
            ->when(! $this->option('force'), fn ($q) => $q->dueForRenewal())
            ->when($this->option('force'), fn ($q) => $q->where('status', 'active')->where('auto_renew', true));

        $count = 0;

        $query->chunk(50, function ($subscriptions) use (&$count) {
            foreach ($subscriptions as $subscription) {
                $package = $subscription->package;
                $from = $subscription->expires_at ?? now();
                $to = $from->copy()->addDays($package->duration_days);

                $subscription->renewals()->create([
                    'status' => 'processed',
                    'processed_at' => now(),
                    'renewed_from' => $from,
                    'renewed_to' => $to,
                ]);

                $subscription->update([
                    'expires_at' => $to,
                    'next_renewal_at' => $to,
                    'last_renewed_at' => now(),
                    'status' => 'active',
                ]);

                $count++;
            }
        });

        $this->info("Processed {$count} renewals.");

        return self::SUCCESS;
    }
}