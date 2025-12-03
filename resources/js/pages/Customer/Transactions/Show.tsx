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

      {/* Tăng padding tổng, phóng to max-width và các khung */}
      <div className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">

          <div className="bg-white rounded-lg border p-6 md:p-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Chi tiết giao dịch</h1>
              <p className="text-sm md:text-base text-slate-500 mt-2">Mã: <span className="font-medium text-lg md:text-xl">{transaction?.transaction_code ?? `#${transaction?.id}`}</span></p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/transactions" className="inline-flex items-center px-4 py-2 border rounded-md bg-white text-slate-700 hover:bg-slate-50 text-sm md:text-base">
                <ArrowLeft className="h-4 w-4 mr-2" /> Danh sách
              </Link>
              <a href={`/transactions/${transaction?.id}/invoice`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm md:text-base">
                <Download className="h-4 w-4 mr-2" /> Tải hóa đơn
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-slate-600 mb-4">Thông tin giao dịch</h3>
              <div className="text-sm md:text-base text-slate-800 space-y-3">
                <div><span className="text-slate-500">Mã giao dịch:</span> <span className="font-medium text-base md:text-lg">{transaction?.transaction_code ?? transaction?.id}</span></div>
                <div><span className="text-slate-500">Cổng thanh toán:</span> <span className="font-medium text-base md:text-lg">{transaction?.gateway ?? '-'}</span></div>
                <div><span className="text-slate-500">Trạng thái:</span> <span className="font-medium text-base md:text-lg">{translateStatus(transaction?.status)}</span></div>
                <div><span className="text-slate-500">Thời gian xử lý:</span> <span className="font-medium text-base md:text-lg">{formatDate(transaction?.processed_at)}</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-slate-600 mb-4">Đơn hàng & số tiền</h3>
              <div className="text-sm md:text-base text-slate-800 space-y-3">
                <div>
                  <span className="text-slate-500">Đơn hàng:</span>{' '}
                  {order ? <Link href={`/customer/orders/${order.id}`} className="text-blue-600 font-medium text-base md:text-lg">#{order.id}</Link> : <span className="font-medium text-base md:text-lg">-</span>}
                </div>
                <div><span className="text-slate-500">Tổng đơn hàng:</span> <span className="font-medium text-base md:text-lg">{formatCurrency(order?.total_amount ?? transaction?.amount)}</span></div>
                <div><span className="text-slate-500">Số tiền giao dịch:</span> <span className="font-medium text-base md:text-lg">{formatCurrency(transaction?.amount)}</span></div>
                <div><span className="text-slate-500">Ngày đặt / xử lý:</span> <span className="font-medium text-base md:text-lg">{formatDate(order?.placed_at ?? transaction?.processed_at)}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 md:p-8">
            <h3 className="text-base md:text-lg font-semibold text-slate-600 mb-4">Tóm tắt hóa đơn</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-slate-600">Mô tả</th>
                    <th className="px-4 md:px-6 py-3 text-right text-slate-600">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 md:px-6 py-4 text-base md:text-lg">Thanh toán cho đơn hàng {order ? `#${order.id}` : transaction?.transaction_code ?? ''}</td>
                    <td className="px-4 md:px-6 py-4 text-right font-medium text-base md:text-lg">{formatCurrency(transaction?.amount)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td className="px-4 md:px-6 py-3 text-right font-semibold text-base md:text-lg">Tổng cộng</td>
                    <td className="px-4 md:px-6 py-3 text-right font-semibold text-base md:text-lg">{formatCurrency(order?.total_amount ?? transaction?.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {transaction?.raw_response && (
              <div className="mt-4 text-xs md:text-sm text-slate-500">
                <details className="text-sm">
                  <summary className="cursor-pointer">Xem raw response</summary>
                  <pre className="mt-2 text-xs md:text-sm bg-slate-50 p-3 rounded overflow-auto">{JSON.stringify(transaction.raw_response, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>

          <p className="text-sm md:text-base text-slate-500 text-center">Hóa đơn được tạo tự động. Sử dụng nút "Tải hóa đơn" để lưu hoặc in.</p>
        </div>
      </div>
    </AppLayout>
  );
}