import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CreditCard, Eye } from 'lucide-react';

interface Transaction {
  id: number;
  transaction_code?: string;
  order_id?: number | null;
  gateway?: string | null;
  processed_at?: string | null;
  amount?: number;
  status?: string;
}

export default function Index({ transactions }: { transactions: { data: Transaction[]; current_page?: number; last_page?: number; prev_page_url?: string | null; next_page_url?: string | null } }) {
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

  const getStatusBadge = (status?: string) => {
    const s = (status || '').toLowerCase();
    const config: Record<string, { bg: string; text: string; label: string }> = {
      succeeded: { bg: 'bg-green-100', text: 'text-green-800', label: 'Thành công' },
      success: { bg: 'bg-green-100', text: 'text-green-800', label: 'Thành công' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang xử lý' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Thất bại' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã hủy' },
    };
    const c = config[s] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status || '-' };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  const rows = transactions?.data || [];

  return (
    <AppLayout breadcrumbs={[{ title: 'Giao diện người dùng', href: '/' }, { title: 'Giao dịch', href: '/transactions' }]}>
      <Head title="Giao dịch của tôi" />

      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-lg p-6 border border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-3">
                <CreditCard className="h-6 w-6 text-slate-600" /> Giao dịch của tôi
              </h1>
              <p className="text-sm text-slate-500 mt-1">Lịch sử thanh toán và giao dịch của bạn</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm">Tiếp tục mua sắm</Link>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <CreditCard className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg text-slate-600">Bạn chưa có giao dịch nào</p>
              <p className="text-sm text-slate-500 mt-2">Mọi giao dịch thành công hoặc thất bại sẽ hiển thị tại đây.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mã giao dịch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Đơn hàng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cổng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Số tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-slate-100">
                    {rows.map((t: Transaction) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{t.transaction_code ?? t.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{t.order_id ? `#${t.order_id}` : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {t.gateway?.toUpperCase() ?? 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(t.processed_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">{formatCurrency(t.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(t.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Link href={`/transactions/${t.id}`} className="inline-flex items-center px-3 py-2 rounded-md bg-[#0AC1EF] text-white hover:bg-[#09b3db] text-sm">
                            <Eye className="h-4 w-4 mr-1" /> Chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* simple pagination */}
              {(transactions.prev_page_url || transactions.next_page_url) && (
                <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm text-slate-500">Trang <span className="font-semibold">{transactions.current_page}</span> / <span className="font-semibold">{transactions.last_page}</span></div>
                  <div className="flex gap-2">
                    {transactions.prev_page_url && <Link href={transactions.prev_page_url} className="px-3 py-1 bg-white border rounded text-sm">Trước</Link>}
                    {transactions.next_page_url && <Link href={transactions.next_page_url} className="px-3 py-1 bg-white border rounded text-sm">Tiếp</Link>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}