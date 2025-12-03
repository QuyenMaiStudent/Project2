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
      <Head title={`Lượt sử dụng: ${promotion.code || ''}`} />

      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Lượt sử dụng</h1>
            <p className="text-base md:text-lg text-gray-600 mt-1">
              Mã: <span className="font-medium text-[#0AC1EF]">{promotion.code || '—'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/promotions" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-base md:text-lg">Quay lại</Link>
            <a className="px-6 py-3 bg-[#0AC1EF] hover:bg-[#0894c7] text-white rounded-lg transition text-base md:text-lg" href={`/admin/promotions/${promotion.id}/edit`}>Sửa khuyến mãi</a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Tổng lượt</p>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">{total}</p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Người dùng đã sử dụng</p>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{usages.length}</p>
            <p className="text-base md:text-lg text-gray-500 mt-1">Hiển thị trang hiện tại</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Mã</p>
            <p className="text-3xl md:text-4xl font-bold text-[#0AC1EF] mt-2">{promotion.code || '—'}</p>
            <p className="text-base md:text-lg text-gray-500 mt-1">Loại: {promotion.type ?? '—'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-base md:text-lg font-semibold">Người dùng</th>
                <th className="px-6 py-3 text-left text-base md:text-lg font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-base md:text-lg font-semibold">Số lần</th>
                <th className="px-6 py-3 text-left text-base md:text-lg font-semibold">Lần cuối</th>
              </tr>
            </thead>
            <tbody>
              {usages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500 bg-gray-50">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Chưa có lượt sử dụng</h3>
                      <p className="text-base md:text-lg text-gray-500">Chưa có dữ liệu để hiển thị.</p>
                    </div>
                  </td>
                </tr>
              ) : usages.map((u:any) => (
                <tr key={u.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-800 font-medium text-base md:text-lg">{u.name || '—'}</td>
                  <td className="px-6 py-4 text-base md:text-lg text-gray-600">{u.email || '—'}</td>
                  <td className="px-6 py-4 text-base md:text-lg text-gray-800">{u.used_times ?? '-'}</td>
                  <td className="px-6 py-4 text-base md:text-lg text-gray-600">{u.last_used_at ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* nếu có phân trang từ backend, render links (page.links) */}
        {page.links && Array.isArray(page.links) && page.links.length > 0 && (
          <div className="mt-6 flex justify-center gap-3 bg-white p-4 rounded-lg shadow-md">
            {page.links.map((link:any, idx:number) =>
              link.url ? (
                <button
                  key={idx}
                  onClick={() => window.location.href = link.url}
                  className={`px-4 py-2 rounded-lg transition text-base md:text-lg ${link.active ? 'bg-[#0AC1EF] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span key={idx} className="px-4 py-2 text-gray-400 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
              )
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
