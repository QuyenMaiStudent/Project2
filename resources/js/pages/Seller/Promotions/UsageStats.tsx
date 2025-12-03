import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BarChart2, UserPlus, Download } from 'lucide-react';

export default function UsageStats() {
  const page = usePage().props as any;
  const promotion = page.promotion;
  const usages = page.usages ?? [];
  const flash = page.flash ?? {};
  const breadcrumbs = [
    { title: 'Giao diện người bán', href: '/seller/dashboard' },
    { title: 'Khuyến mãi', href: '/seller/promotions' },
    { title: `Thống kê: ${promotion?.code}`, href: `/seller/promotions/${promotion?.id}/usage` },
  ];

  const totalUses = usages.reduce((acc: number, u: any) => acc + (u.used_times ?? u.pivot?.used_times ?? 0), 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Thống kê ${promotion?.code}`} />
      <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="rounded-lg overflow-hidden shadow grid lg:grid-cols-12 bg-white">
          <div className="lg:col-span-9 p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Thống kê: <span className="text-indigo-600">{promotion?.code}</span></h1>
                <p className="text-sm text-gray-500 mt-1">Theo dõi số lượt và người dùng đã sử dụng mã.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="#" className="inline-flex items-center gap-2 rounded bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500">
                  <Download className="w-4 h-4" /> Export
                </Link>
                <Link href="/seller/promotions" className="px-3 py-2 rounded border bg-white text-sm">Quay lại</Link>
              </div>
            </div>

            {flash?.success && <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">{flash.success}</div>}
            {flash?.error && <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded">{flash.error}</div>}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng người dùng</p>
                    <p className="text-xl font-semibold mt-1">{usages.length}</p>
                  </div>
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng lượt dùng</p>
                    <p className="text-xl font-semibold mt-1">{totalUses}</p>
                  </div>
                  <BarChart2 className="w-6 h-6 text-cyan-600" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border">
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="text-lg font-medium mt-1">{promotion?.is_active ? 'Đang kích hoạt' : 'Đã tắt'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white border rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3">Người dùng</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3">Số lần đã dùng</th>
                      <th className="text-left px-4 py-3">Lần dùng cuối</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usages.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500">Chưa có lượt sử dụng</td>
                      </tr>
                    ) : (
                      usages.map((u: any) => (
                        <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                          <td className="px-4 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-white flex items-center justify-center text-sm">
                              {((u.name || u.email || '').charAt(0) || '#').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{u.name ?? `#${u.id}`}</div>
                              <div className="text-xs text-gray-500">{u.mobile ?? ''}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">{u.email ?? '—'}</td>
                          <td className="px-4 py-4 font-medium">{u.used_times ?? u.pivot?.used_times ?? 0}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{u.last_used_at ? new Date(u.last_used_at).toLocaleString('vi-VN') : '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-3 border-l p-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded shadow-sm">
                <BarChart2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold">Chi tiết chiến dịch</h4>
                <p className="text-sm text-gray-600 mt-1">Mã: <span className="font-medium">{promotion?.code}</span></p>
                <p className="text-sm text-gray-600 mt-1">Thời gian: <span className="block text-xs text-gray-500">{promotion?.starts_at ?? '—'} → {promotion?.expires_at ?? '—'}</span></p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border bg-white p-4">
              <h5 className="text-sm font-semibold">Gợi ý</h5>
              <ul className="text-sm text-gray-600 mt-2 list-disc pl-5 space-y-2">
                <li>Kiểm tra tổng lượt dùng để quyết định kéo dài thời gian.</li>
                <li>Xuất dữ liệu nếu cần phân tích chi tiết.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
