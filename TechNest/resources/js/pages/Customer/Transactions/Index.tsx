import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CreditCard, Eye } from 'lucide-react';

export default function Index({ transactions }: any) {
  const formatCurrency = (v: number) => {
    if (v == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      succeeded: { bg: 'bg-green-100', text: 'text-green-800', label: 'Thành công' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang xử lý' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Thất bại' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã hủy' },
    };

    const c = config[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Giao diện người dùng', href: '/' }, { title: 'Giao dịch', href: '/transactions' }]}>
      <Head title="Giao dịch của tôi" />
      
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <CreditCard className="mr-3 h-8 w-8" />
          Giao dịch của tôi
        </h1>

        {(!transactions || transactions.data.length === 0) ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">Bạn chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã giao dịch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cổng thanh toán
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.data.map((t: any) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          #{t.transaction_code ?? t.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {t.order_id ? `#${t.order_id}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t.gateway?.toUpperCase() ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t.processed_at ?? '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(t.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(t.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/transactions/${t.id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(transactions.prev_page_url || transactions.next_page_url) && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  {transactions.prev_page_url && (
                    <Link
                      href={transactions.prev_page_url}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Trước
                    </Link>
                  )}
                  {transactions.next_page_url && (
                    <Link
                      href={transactions.next_page_url}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Tiếp
                    </Link>
                  )}
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Trang <span className="font-medium">{transactions.current_page}</span> / <span className="font-medium">{transactions.last_page}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      {transactions.prev_page_url && (
                        <Link
                          href={transactions.prev_page_url}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Trang trước</span>
                          ‹
                        </Link>
                      )}
                      {transactions.next_page_url && (
                        <Link
                          href={transactions.next_page_url}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Trang sau</span>
                          ›
                        </Link>
                      )}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}