<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hóa đơn #{{ $transaction['id'] }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; color:#1f2937; font-size:14px; }
        .container { max-width:720px; margin:0 auto; padding:24px; }
        h1 { font-size:22px; margin:0 0 16px; }
        table { width:100%; border-collapse:collapse; margin-top:24px; }
        th, td { border:1px solid #e5e7eb; padding:12px; text-align:left; }
        th { background:#f9fafb; }
        .right { text-align:right; }
        .muted { color:#6b7280; font-size:12px; margin-top:32px; text-align:center; }
    </style>
</head>
<body>
<div class="container">
    <h1>HÓA ĐƠN THANH TOÁN</h1>
    <p>Ngày xuất: {{ $generated_at }}</p>

    <h2>Thông tin khách hàng</h2>
    <p>{{ $customer['name'] ?? '-' }}<br>{{ $customer['email'] ?? '-' }}</p>

    <h2>Thông tin giao dịch</h2>
    <p>Mã: {{ $transaction['transaction_code'] ?? $transaction['id'] }}<br>
       Cổng: {{ $transaction['gateway'] ?? '-' }}<br>
       Trạng thái: {{ $transaction['status'] }}<br>
       Thời gian xử lý: {{ $transaction['processed_at'] ?? '-' }}</p>

    <table>
        <thead>
        <tr>
            <th>Mô tả</th>
            <th class="right">Số tiền</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Đơn hàng #{{ $order['id'] }}</td>
            <td class="right">{{ number_format($transaction['amount'] ?? 0, 0, ',', '.') }} ₫</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <th class="right">Tổng cộng</th>
            <th class="right">{{ number_format($order['total_amount'] ?? $transaction['amount'] ?? 0, 0, ',', '.') }} ₫</th>
        </tr>
        </tfoot>
    </table>

    <p class="muted">Hóa đơn được tạo tự động, vui lòng lưu lại để đối chiếu.</p>
</div>
</body>
</html>