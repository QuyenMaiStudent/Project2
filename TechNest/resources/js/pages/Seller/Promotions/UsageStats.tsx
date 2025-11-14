import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Thống kê ${promotion?.code}`} />
      {flash?.success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.success}</div>}
      {flash?.error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>}
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Thống kê: {promotion?.code}</h1>
          <Link href="/seller/promotions" className="px-3 py-1 bg-gray-200 rounded">Quay lại</Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Người dùng</th>
              <th className="px-4 py-2 text-left">Số lần đã dùng</th>
            </tr>
          </thead>
          <tbody>
            {usages.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-6 text-center text-gray-500">Chưa có lượt sử dụng</td>
              </tr>
            ) : (
              usages.map((u: any) => (
                <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.used_times ?? u.pivot?.used_times ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
