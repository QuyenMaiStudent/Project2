import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Index({ transactions }: any) {
  const formatCurrency = (v: number) => {
    if (v == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Trang chủ', href: '/' }, { title: 'Giao dịch', href: '/transactions' }]}>
      <Head title="Giao dịch của tôi" />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Giao dịch</h1>

        {(!transactions || transactions.data.length === 0) ? (
          <div className="text-gray-600">Không có giao dịch.</div>
        ) : (
          <div className="space-y-4">
            {transactions.data.map((t: any) => (
              <div key={t.id} className="p-4 border rounded flex items-center justify-between bg-white">
                <div>
                  <div className="font-semibold">#{t.transaction_code ?? t.id}</div>
                  <div className="text-sm text-gray-600">{t.gateway?.toUpperCase() ?? 'N/A'} — {t.processed_at ?? '-'}</div>
                  <div className="text-sm text-gray-600">Order: {t.order_id ? `#${t.order_id}` : '-'}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold mb-1">{formatCurrency(t.amount)}</div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded text-sm ${t.status === 'succeeded' ? 'bg-green-100 text-green-800' : (t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800')}`}>
                      {t.status}
                    </span>
                  </div>
                  <Link href={`/transactions/${t.id}`} className="mt-2 inline-block text-blue-600">Chi tiết</Link>
                </div>
              </div>
            ))}

            {/* Simple pagination controls */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">Trang {transactions.current_page} / {transactions.last_page}</div>
              <div className="space-x-2">
                {transactions.prev_page_url && <Link href={transactions.prev_page_url} className="text-blue-600">« Trước</Link>}
                {transactions.next_page_url && <Link href={transactions.next_page_url} className="text-blue-600">Tiếp »</Link>}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}