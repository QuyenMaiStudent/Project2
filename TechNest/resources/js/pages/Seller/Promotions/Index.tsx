import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Index() {
  const page = usePage().props as any;
  const promotions = page.promotions ?? { data: [], links: [] };
  const brands = page.brands ?? [];
  const brandMap = Object.fromEntries(brands.map((b: any) => [String(b.id), b.name]));
  const filters = page.filters ?? {};
  const flash = page.flash ?? {};
  const breadcrumbs = [
    { title: 'Seller Dashboard', href: '/seller/dashboard' },
    { title: 'Khuyến mãi', href: '/seller/promotions' },
  ];

  const toggle = (id: number) => router.post(`/seller/promotions/${id}/toggle-status`);
  const remove = (id: number) => {
    if (!confirm('Xóa mã khuyến mãi?')) return;
    router.delete(`/seller/promotions/${id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Khuyến mãi của tôi" />
      {flash?.success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.success}</div>}
      {flash?.error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Khuyến mãi</h1>
          <Link href="/seller/promotions/create" className="bg-green-600 text-white px-4 py-2 rounded">Tạo mới</Link>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Mã</th>
                <th className="px-4 py-3 text-left">Loại</th>
                <th className="px-4 py-3 text-left">Giá trị</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Áp dụng</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {promotions.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">Chưa có khuyến mãi</td>
                </tr>
              ) : (
                promotions.data.map((p: any) => {
                  const conds = p.conditions ?? [];
                  const applyText = conds.length === 0
                    ? 'Tất cả sản phẩm của tôi'
                    : conds.map((c: any) => {
                        if (c.condition_type === 'brand') {
                          return brandMap[String(c.target_id)] ?? `Thương hiệu #${c.target_id}`;
                        }
                        if (c.condition_type === 'product') {
                          return `Sản phẩm #${c.target_id}`;
                        }
                        if (c.condition_type === 'category') {
                          return `Danh mục #${c.target_id}`;
                        }
                        return `${c.condition_type}:${c.target_id}`;
                      }).join(', ');

                  return (
                    <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-3">{p.code}</td>
                      <td className="px-4 py-3">{p.type}</td>
                      <td className="px-4 py-3">{p.value}</td>
                      <td className="px-4 py-3">{p.is_active ? 'Hoạt động' : 'Tắt'}</td>
                      <td className="px-4 py-3">{applyText}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/seller/promotions/${p.id}/edit`} className="px-2 py-1 bg-yellow-500 text-white rounded">Sửa</Link>
                          <button onClick={() => toggle(p.id)} className="px-2 py-1 bg-indigo-600 text-white rounded">{p.is_active ? 'Tắt' : 'Bật'}</button>
                          <Link href={`/seller/promotions/${p.id}/usage`} className="px-2 py-1 bg-blue-600 text-white rounded">Lượt</Link>
                          <button onClick={() => remove(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* simple pagination from laravel paginator links */}
        <div className="mt-4 flex justify-center gap-2">
          {promotions.links?.map((link: any, idx: number) =>
            link.url ? (
              <button key={idx} onClick={() => router.visit(link.url)} className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
            ) : (
              <span key={idx} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
            )
          )}
        </div>
      </div>
    </AppLayout>
  );
}
