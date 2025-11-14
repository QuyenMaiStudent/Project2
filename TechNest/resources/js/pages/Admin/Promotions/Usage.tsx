import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Usage() {
  const page = usePage().props as any;
  const promotion = page.promotion ?? {};
  const usages = page.usages ?? [];
  const total = page.total_used ?? 0;

  const breadcrumbs = [
    { title: 'Trang quản trị', href: '/admin/dashboard' },
    { title: 'Khuyến mãi', href: '/admin/promotions' },
    { title: 'Thống kê', href: `/admin/promotions/${promotion.id}/usage` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Lượt sử dụng: ${promotion.code}`} />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Lượt sử dụng: {promotion.code}</h1>
        <div className="mb-4">Tổng sử dụng: {total}</div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Người dùng</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Số lần</th>
            </tr>
          </thead>
          <tbody>
            {usages.length === 0 ? (
              <tr><td colSpan={3} className="py-6 text-center text-gray-500">Chưa có lượt sử dụng</td></tr>
            ) : usages.map((u:any) => (
              <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.used_times ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Link href="/admin/promotions" className="px-4 py-2 rounded bg-gray-200">Quay lại</Link>
        </div>
      </div>
    </AppLayout>
  );
}
