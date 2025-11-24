import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Download } from 'lucide-react';

export default function Show({ transaction }: any) {
  const formatCurrency = (v?: number) => {
    if (v == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v));
  };

  const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    return iso;
  };

  const translateStatus = (s?: string) => {
    if (!s) return '-';
    const map: Record<string, string> = {
      succeeded: 'Thành công',
      success: 'Thành công',
      pending: 'Đang xử lý',
      failed: 'Thất bại',
      cancelled: 'Đã hủy',
      canceled: 'Đã hủy',
    };
    return map[s.toLowerCase()] || s;
  };

  const order = transaction?.order ?? null;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Giao diện người dùng', href: '/' },
      { title: 'Giao dịch', href: '/transactions' },
      { title: `#${transaction?.id ?? ''}`, href: `/transactions/${transaction?.id ?? ''}` }
    ]}>
      <Head title={`Giao dịch #${transaction?.id ?? ''}`} />

      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-lg border p-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold">Chi tiết giao dịch</h1>
              <p className="text-sm text-slate-500 mt-1">Mã: <span className="font-medium">{transaction?.transaction_code ?? `#${transaction?.id}`}</span></p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/transactions" className="inline-flex items-center px-3 py-2 border rounded bg-white text-slate-700 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4 mr-2" /> Danh sách
              </Link>
              <a href={`/transactions/${transaction?.id}/invoice`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" /> Tải hóa đơn
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Thông tin giao dịch</h3>
              <div className="text-sm text-slate-800 space-y-2">
                <div><span className="text-slate-500">Mã giao dịch:</span> <span className="font-medium">{transaction?.transaction_code ?? transaction?.id}</span></div>
                <div><span className="text-slate-500">Cổng thanh toán:</span> <span className="font-medium">{transaction?.gateway ?? '-'}</span></div>
                <div><span className="text-slate-500">Trạng thái:</span> <span className="font-medium">{translateStatus(transaction?.status)}</span></div>
                <div><span className="text-slate-500">Thời gian xử lý:</span> <span className="font-medium">{formatDate(transaction?.processed_at)}</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Đơn hàng & số tiền</h3>
              <div className="text-sm text-slate-800 space-y-2">
                <div>
                  <span className="text-slate-500">Đơn hàng:</span>{' '}
                  {order ? <Link href={`/customer/orders/${order.id}`} className="text-blue-600 font-medium">#{order.id}</Link> : <span className="font-medium">-</span>}
                </div>
                <div><span className="text-slate-500">Tổng đơn hàng:</span> <span className="font-medium">{formatCurrency(order?.total_amount ?? transaction?.amount)}</span></div>
                <div><span className="text-slate-500">Số tiền giao dịch:</span> <span className="font-medium">{formatCurrency(transaction?.amount)}</span></div>
                <div><span className="text-slate-500">Ngày đặt / xử lý:</span> <span className="font-medium">{formatDate(order?.placed_at ?? transaction?.processed_at)}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">Tóm tắt hóa đơn</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-slate-600">Mô tả</th>
                    <th className="px-4 py-2 text-right text-slate-600">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Thanh toán cho đơn hàng {order ? `#${order.id}` : transaction?.transaction_code ?? ''}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(transaction?.amount)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td className="px-4 py-3 text-right font-semibold">Tổng cộng</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(order?.total_amount ?? transaction?.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {transaction?.raw_response && (
              <div className="mt-4 text-xs text-slate-500">
                <details className="text-sm">
                  <summary className="cursor-pointer">Xem raw response</summary>
                  <pre className="mt-2 text-xs bg-slate-50 p-3 rounded overflow-auto">{JSON.stringify(transaction.raw_response, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 text-center">Hóa đơn được tạo tự động. Sử dụng nút "Tải hóa đơn" để lưu hoặc in.</p>
        </div>
      </div>
    </AppLayout>
  );
}