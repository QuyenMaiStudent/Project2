import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Show({ transaction }: any) {
  const formatCurrency = (v: number) => {
    if (v == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'Trang chủ', href: '/' },
      { title: 'Giao dịch', href: '/transactions' },
      { title: `#${transaction.id}`, href: `/transactions/${transaction.id}` }
    ]}>
      <Head title={`Giao dịch #${transaction.id}`} />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Chi tiết giao dịch</h1>

        <div className="bg-white border rounded p-6 space-y-4">
          <div><strong>Mã giao dịch:</strong> {transaction.transaction_code ?? transaction.id}</div>
          <div><strong>Nhà cung cấp:</strong> {transaction.gateway}</div>
          <div><strong>Số tiền:</strong> {formatCurrency(transaction.amount)}</div>
          <div><strong>Trạng thái:</strong> {transaction.status}</div>
          <div><strong>Thời gian xử lý:</strong> {transaction.processed_at ?? '-'}</div>
          <div><strong>Order:</strong> {transaction.order ? <Link href={`/customer/orders/${transaction.order.id}`} className="text-blue-600">#{transaction.order.id}</Link> : '-'}</div>

          <div>
            <h3 className="font-semibold mt-4">Payload (raw)</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">{JSON.stringify(transaction.raw ?? transaction, null, 2)}</pre>
          </div>

          <div className="mt-4">
            <Link href="/transactions" className="text-blue-600">« Quay lại danh sách giao dịch</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}