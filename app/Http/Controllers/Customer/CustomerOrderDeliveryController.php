<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CustomerOrderDeliveryController extends Controller
{
    public function confirm(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        if ($order->status !== Order::STATUS_DELIVERED_AWAITING_CONFIRMATION) {
            abort(422, 'Đơn hàng chưa ở trạng thái chờ xác nhận.');
        }

        $order->forceFill([
            'status' => Order::STATUS_DELIVERED,
        ])->save();

        return Redirect::back()->with('success', 'Cảm ơn bạn đã xác nhận.');
    }
}
