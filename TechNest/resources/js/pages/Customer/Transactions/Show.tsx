import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Show({ transaction }: any) {
  const formatCurrency = (v: number) => {
    if (v == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  };

  const order = transaction?.order ?? null;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Trang chủ', href: '/' },
      { title: 'Giao dịch', href: '/transactions' },
      { title: `#${transaction?.id ?? ''}`, href: `/transactions/${transaction?.id ?? ''}` }
    ]}>
      <Head title={`Giao dịch #${transaction?.id ?? ''}`} />

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Chi tiết giao dịch</h1>
            <p className="text-sm text-gray-500 mt-1">Mã: <span className="font-medium">{transaction?.transaction_code ?? `#${transaction?.id}`}</span></p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/transactions"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              « Danh sách
            </Link>

            <a
              href={`/transactions/${transaction?.id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Tải hóa đơn (PDF)
            </a>
          </div>
        </div>

        <div className="bg-white border rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Thông tin giao dịch</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <div><span className="text-gray-500">Mã giao dịch:</span> <span className="font-medium">{transaction?.transaction_code ?? transaction?.id}</span></div>
                <div><span className="text-gray-500">Cổng thanh toán:</span> <span className="font-medium">{transaction?.gateway ?? '-'}</span></div>
                <div><span className="text-gray-500">Trạng thái:</span> <span className="font-medium">{transaction?.status ?? '-'}</span></div>
                <div><span className="text-gray-500">Thời gian xử lý:</span> <span className="font-medium">{transaction?.processed_at ?? '-'}</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Thông tin đơn hàng & thanh toán</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <div>
                  <span className="text-gray-500">Đơn hàng:</span>{' '}
                  {order ? (
                    <Link href={`/customer/orders/${order.id}`} className="text-blue-600 font-medium">#{order.id}</Link>
                  ) : (
                    <span className="font-medium">-</span>
                  )}
                </div>
                <div><span className="text-gray-500">Tổng đơn hàng:</span> <span className="font-medium">{formatCurrency(order?.total_amount ?? transaction?.amount)}</span></div>
                <div><span className="text-gray-500">Số tiền giao dịch:</span> <span className="font-medium">{formatCurrency(transaction?.amount)}</span></div>
                <div><span className="text-gray-500">Ngày đặt / xử lý:</span> <span className="font-medium">{order?.placed_at ?? transaction?.processed_at ?? '-'}</span></div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Tóm tắt hóa đơn</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Mô tả</th>
                    <th className="px-4 py-2 text-right text-gray-600">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Thanh toán cho đơn hàng {order ? `#${order.id}` : ''}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(transaction?.amount)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-right font-semibold">Tổng cộng</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(order?.total_amount ?? transaction?.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Hóa đơn được tạo tự động. Vui lòng sử dụng nút "Tải hóa đơn (PDF)" để lưu hoặc in.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}