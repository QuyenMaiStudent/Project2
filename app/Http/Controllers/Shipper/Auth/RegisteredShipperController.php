<?php

namespace App\Http\Controllers\Shipper\Auth;

use App\Http\Controllers\Controller;
use App\Models\Shipper;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredShipperController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Shipper/Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:shippers,email'],
            'phone' => ['nullable', 'string', 'max:25'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $shipper = \App\Models\Shipper::create($data);
        event(new Registered($shipper));

        return redirect()->route('shipper.login')
            ->with('success', 'Đăng ký shipper thành công. Vui lòng đăng nhập.');
    }
}
