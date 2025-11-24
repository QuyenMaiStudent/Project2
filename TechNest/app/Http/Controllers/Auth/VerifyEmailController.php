<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->redirectToDashboard($user, true);
        }

        $request->fulfill();

        return $this->redirectToDashboard($user, true);
    }

    /**
     * Redirect user to appropriate dashboard based on role
     */
    private function redirectToDashboard($user, bool $verified = false): RedirectResponse
    {
        $queryParam = $verified ? '?verified=1' : '';

        if ($user->isSeller()) {
            return redirect()->intended(route('seller.dashboard', absolute: false) . $queryParam);
        }

        if ($user->isAdmin() || $user->isSuperAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false) . $queryParam);
        }

        if ($user->isCustomer()) {
            return redirect()->intended(route('customer.dashboard', absolute: false) . $queryParam);
        }

        // Fallback to home if no role matches
        return redirect()->intended(route('home', absolute: false) . $queryParam);
    }
}
