<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        // shipping addresses (minimal fields)
        $addresses = ShippingAddress::where('user_id', $user->id)
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'recipient_name' => $a->recipient_name,
                    'phone' => $a->phone,
                    'address_line' => $a->address_line,
                    'is_default' => (bool) $a->is_default,
                ];
            });

        return Inertia::render('CustomerDashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'addresses' => $addresses,
        ]);
    }
}
