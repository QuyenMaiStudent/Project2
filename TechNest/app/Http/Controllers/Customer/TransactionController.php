<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class TransactionController extends Controller
{
    /**
     *  Hiển thị danh sách giao dịch của user (paginate)
     */
    public function index(Request $request)
    {
        Log::info('Customer transaction list requested', ['user_id' => Auth::id()]);

        $transactions = Transaction::with(['payment.order'])
            ->whereHas('payment.order', function ($q) {
                $q->where('user_id', Auth::id());
            })
            ->orderByDesc('processed_at')
            ->paginate(15);

        // map để frontend dễ dùng
        // chuyển đổi trực tiếp paginator và dùng nó luôn
        $transactions = $transactions->through(function ($t) {
            return [
                'id' => $t->id,
                'payment_id' => $t->payment_id,
                'gateway' => $t->gateway,
                'transaction_code' => $t->transaction_code,
                'status' => $t->status,
                'amount' => $t->amount,
                'processed_at' => $t->processed_at ? Carbon::parse($t->processed_at)->format('d/m/Y H:i') : null,
                'order_id' => $t->payment?->order?->id ?? null,
            ];
        });

        return Inertia::render('Customer/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Hiển thị chi tiết 1 giao dịch
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['payment.order', 'payment']);

        $order = $transaction->payment?->order;
        if (!$order || $order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to transaction.');
        }

        return Inertia::render('Customer/Transactions/Show', [
            'transaction' => [
                'id' => $transaction->id,
                'payment_id' => $transaction->payment_id,
                'gateway' => $transaction->gateway,
                'transaction_code' => $transaction->transaction_code,
                'status' => $transaction->status,
                'amount' => $transaction->amount,
                'processed_at' => $transaction->processed_at ? Carbon::parse($transaction->processed_at)->format('d/m/Y H:i') : null,
                'raw' => $transaction->toArray(),
                'order' => $order ? [
                    'id' => $order->id,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                ] : null,
            ],
        ]);
    }

    
}
