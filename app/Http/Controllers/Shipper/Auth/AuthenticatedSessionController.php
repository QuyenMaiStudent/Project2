<?php

namespace App\Http\Controllers\Shipper\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Shipper/Auth/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('shipper')->attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'Thông tin đăng nhập không chính xác.'])->onlyInput('email');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('shipper.dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('shipper')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('shipper.login');
    }
}
