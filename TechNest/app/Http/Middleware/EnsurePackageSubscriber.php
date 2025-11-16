<?php 

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsurePackageSubscriber
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()?->hasActivePackageSubscription()) {
            return redirect()->route('packages.index')
                ->with('error', __('An active subscription is required.'));
        }

        return $next($request);
    }
}
