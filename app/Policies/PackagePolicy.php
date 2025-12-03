<?php 

namespace App\Policies;

use App\Models\Package;
use App\Models\User;

class PackagePolicy
{
    public function manage(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('super-admin');
    }

    public function subscribe(User $user, Package $package): bool
    {
        return $package->is_active && $user->hasVerifiedEmail();
    }
}