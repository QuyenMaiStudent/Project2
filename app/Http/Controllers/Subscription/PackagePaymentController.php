<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\PackageSubscription;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PackagePaymentController extends Controller
{
    protected PaymentService $payments;

    public function __construct(PaymentService $payments)
    {
        $this->payments = $payments;
    }

    // show checkout page with payment options
    public function checkout(Request $request, Package $package): Response
    {
        $this->authorize('subscribe', $package);

        return Inertia::render('Packages/Checkout', [
            'package' => $package,
        ]);
    }

    // process payment (select gateway via request)
    public function process(Request $request, Package $package): RedirectResponse
    {
        $this->authorize('subscribe', $package);

        $gateway = $request->input('gateway', 'momo'); // ví dụ mặc định
        $user = $request->user();

        // tạo metadata để webhook biết đây là mua gói
        $metadata = [
            'type' => 'package_subscription',
            'package_id' => $package->id,
            'user_id' => $user->id,
        ];

        // PaymentService trả về url redirect hoặc payment token
        $result = $this->payments->createPayment([
            'amount' => $package->price,
            'currency' => 'VND',
            'description' => "Thanh toán gói {$package->name}",
            'gateway' => $gateway,
            'metadata' => $metadata,
            'return_url' => route('packages.payment.return', $package),
        ]);

        // nếu service trả về url redirect -> redirect user
        if (!empty($result['redirect_url'])) {
            return redirect()->to($result['redirect_url']);
        }

        // fallback: quay về danh sách gói với lỗi
        return back()->with('error', __('Unable to start payment.'));
    }

    // optional: handle return from provider, you can also use existing webhooks to finalize
    public function return(Request $request, Package $package): RedirectResponse
    {
        // provider sẽ gửi lại info; tốt nhất xử lý ở webhook và verify
        // local simple flow: nếu provider kèm param success -> tạo subscription
        if ($request->input('status') === 'success') {
            $user = $request->user();
            $expiresAt = now()->addDays($package->duration_days);

            PackageSubscription::create([
                'package_id' => $package->id,
                'user_id' => $user->id,
                'status' => 'active',
                'auto_renew' => true,
                'price' => $package->price,
                'started_at' => now(),
                'expires_at' => $expiresAt,
                'next_renewal_at' => $expiresAt,
            ]);

            return redirect()->route('packages.index')->with('success', __('Payment successful — subscription activated.'));
        }

        return redirect()->route('packages.index')->with('error', __('Payment failed or cancelled.'));
    }

    public function pay(Request $request, Package $package)
    {
        $this->authorize('subscribe', $package);

        $user = $request->user();
        $gateway = $request->input('gateway', 'momo');

        $payload = [
            'gateway' => $gateway,
            'amount' => $package->price,
            'currency' => 'VND',
            'user_id' => $user?->id,
            'metadata' => [
                'type' => 'package_subscription',
                'package_id' => $package->id,
                'user_id' => $user?->id,
            ],
        ];

        $service = app(PaymentService::class);
        $result = $service->createPayment($payload);

        $redirect = $result['redirect_url'] ?? $result['data']['redirect_url'] ?? null;

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => (bool) $redirect,
                'redirect_url' => $redirect,
                'package_payment_id' => $result['package_payment_id'] ?? null,
                'message' => $result['message'] ?? null,
                'data' => $result,
            ]);
        }

        if ($redirect) {
            return redirect()->away($redirect);
        }

        return back()->with('error', $result['message'] ?? __('Unable to start payment.'));
    }
}