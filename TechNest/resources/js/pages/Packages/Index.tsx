import React from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import PackageList from "@/components/packages/PackageList";
import PackageSubscriptionStatus from "@/components/packages/PackageSubscriptionStatus";
import { PackageItem } from "@/components/packages/PackageCard";
import { Button } from "@/components/ui/button";
import { CreditCard, Eye } from "lucide-react";

interface PageProps {
  packages: PackageItem[];
  activeSubscription?: {
    id: number;
    status: string;
    package_id: number;
    auto_renew: boolean;
    expires_at: string | null;
    price: number;
  } | null;
  recentPayments?: {
    data?: {
      id?: number;
      transaction_code?: string;
      package_id?: number;
      package_name?: string;
      amount?: number;
      currency?: string;
      gateway?: string;
      status?: string;
      paid_at?: string | null;
      created_at?: string;
    }[];
    current_page?: number;
    last_page?: number;
    prev_page_url?: string | null;
    next_page_url?: string | null;
  };
  [key: string]: any;
}

const PackagesIndex = () => {
  const { props } = usePage<PageProps>();
  const active = props.activeSubscription;
  const recentPaginated = props.recentPayments || { data: [], current_page: 1, last_page: 1, prev_page_url: null, next_page_url: null };
  const recent = recentPaginated.data || [];

  const handleSubscribe = (pkg: PackageItem) => {
    router.post(`/packages/${pkg.id}/subscribe`);
  };

  const toggleAutoRenew = () => {
    if (!active) return;
    router.post(`/packages/subscriptions/${active.id}/toggle-auto-renew`);
  };

  const cancel = () => {
    if (!active) return;
    router.post(`/packages/subscriptions/${active.id}/cancel`);
  };

  const formatCurrency = (v?: number, cur = "VND") => {
    if (v == null) return "-";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: cur }).format(Number(v));
  };

  // dịch trạng thái sang tiếng Việt
  const translateStatus = (s?: string) => {
    if (!s) return '-';
    const map: Record<string, string> = {
      active: 'Đang hoạt động',
      succeeded: 'Thành công',
      success: 'Thành công',
      pending: 'Đang chờ',
      failed: 'Thất bại',
      cancelled: 'Đã huỷ',
      canceled: 'Đã huỷ',
      inactive: 'Chưa kích hoạt',
      expired: 'Hết hạn',
    };
    return map[s.toLowerCase()] || s;
  };

  const statusBadge = (s?: string) => {
    const st = (s || '').toLowerCase();
    const map: Record<string, string> = {
      succeeded: 'bg-green-100 text-green-800',
      success: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      canceled: 'bg-gray-100 text-gray-800',
    };
    const cls = map[st] || 'bg-gray-100 text-gray-800';
    return <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${cls}`}>{translateStatus(s)}</span>;
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Gói vận chuyển", href: "/packages" }]}>
      <Head title="Gói vận chuyển" />

      {/* background + padding similar to transactions */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <CreditCard className="h-6 w-6 text-slate-600" />
              <div>
                <h1 className="text-2xl font-semibold">Gói vận chuyển tháng</h1>
                <p className="text-sm text-slate-500 mt-1">Chọn gói phù hợp và quản lý thanh toán.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {active ? (
                <>
                  <Button variant="secondary" onClick={toggleAutoRenew}>
                    {active.auto_renew ? "Tắt tự gia hạn" : "Bật tự gia hạn"}
                  </Button>
                  <Button variant="destructive" onClick={cancel}>
                    Huỷ gói
                  </Button>
                </>
              ) : (
                <Link href="/packages" className="px-3 py-2 rounded-md border bg-white text-slate-700 hover:bg-slate-50 text-sm">Khám phá gói</Link>
              )}
            </div>
          </div>

          {/* Subscription status (replaced with prominent card) */}
          {active ? (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-md flex items-center gap-6">
              <div className={`w-2 h-16 rounded-md`} style={{
                background: ((): string => {
                  const s = (active.status || '').toLowerCase();
                  if (s === 'active' || s === 'succeeded' || s === 'success') return '#10b981'; // green
                  if (s === 'pending') return '#f59e0b'; // amber
                  if (s === 'failed' || s === 'cancelled' || s === 'canceled') return '#ef4444'; // red
                  return '#0ea5e9'; // blue fallback
                })()
              }} />

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-slate-500 uppercase tracking-wider">Trạng thái</div>
                    <div className="mt-1 text-2xl font-extrabold text-slate-900">{translateStatus(active.status)}</div>
                    <div className="mt-2 text-sm text-slate-500">
                      Hạn: <span className="font-medium text-slate-700">{active.expires_at ?? '—'}</span>
                      {typeof active.price !== 'undefined' && (
                        <span className="ml-4">Phí đã thanh toán: <span className="font-semibold text-slate-900">{formatCurrency(active.price)}</span></span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold"
                         style={{
                           background: ((): string => {
                             const s = (active.status || '').toLowerCase();
                             if (s === 'active' || s === 'succeeded' || s === 'success') return 'rgba(16,185,129,0.12)';
                             if (s === 'pending') return 'rgba(245,158,11,0.12)';
                             if (s === 'failed' || s === 'cancelled' || s === 'canceled') return 'rgba(239,68,68,0.12)';
                             return 'rgba(14,165,233,0.12)';
                           })(),
                           color: ((): string => {
                             const s = (active.status || '').toLowerCase();
                             if (s === 'active' || s === 'succeeded' || s === 'success') return '#065f46';
                             if (s === 'pending') return '#78350f';
                             if (s === 'failed' || s === 'cancelled' || s === 'canceled') return '#7f1d1d';
                             return '#064e3b';
                           })()
                         }}>
                      {active.auto_renew ? 'Tự động gia hạn' : 'Không tự động'}
                    </div>
                    <div className="mt-3">
                      <button onClick={toggleAutoRenew} className="mr-2 px-3 py-2 rounded-md bg-white border text-sm">Chỉnh sửa</button>
                      <button onClick={cancel} className="px-3 py-2 rounded-md bg-red-600 text-white text-sm">Huỷ ngay</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm text-center">
              <div className="text-lg font-semibold">Bạn chưa đăng ký gói</div>
              <div className="text-sm text-slate-500 mt-1">Chọn gói phù hợp để bắt đầu.</div>
            </div>
          )}

          {/* Packages list in a card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-medium mb-4">Các gói hiện có</h2>
            <PackageList
              packages={props.packages}
              onSubscribe={handleSubscribe}
              activePackageId={active?.package_id}
            />
          </div>

          {/* Recent payments with improved UI */}
          <section className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">Giao dịch gói gần đây</h3>
                <p className="text-sm text-slate-500">Lịch sử thanh toán gói — hiển thị theo trang.</p>
              </div>
            </div>

            {recent.length === 0 ? (
              <div className="py-8 text-center text-slate-600">
                Bạn chưa có giao dịch cho gói nào. <br />
                <Link href="/" className="text-sm text-blue-600 hover:underline">Khám phá sản phẩm</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mã</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gói</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cổng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Số tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-slate-100">
                    {recent.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{p.transaction_code ?? p.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{p.package_name ?? "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {p.gateway?.toUpperCase() ?? 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{p.paid_at ?? p.created_at}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">{formatCurrency(p.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{statusBadge(p.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* pagination */}
                {(recentPaginated.prev_page_url || recentPaginated.next_page_url) && (
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm text-slate-500">Trang <span className="font-semibold">{recentPaginated.current_page}</span> / <span className="font-semibold">{recentPaginated.last_page}</span></div>
                    <div className="flex gap-2">
                      {recentPaginated.prev_page_url && <Link href={recentPaginated.prev_page_url} className="px-3 py-1 bg-white border rounded text-sm">Trước</Link>}
                      {recentPaginated.next_page_url && <Link href={recentPaginated.next_page_url} className="px-3 py-1 bg-white border rounded text-sm">Tiếp</Link>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default PackagesIndex;