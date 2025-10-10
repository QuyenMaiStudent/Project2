// @ts-nocheck
import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Index() {
  const page = usePage().props as any;
  const promotions = page.promotions ?? { data: [], links: [] };
  const brands = page.brands ?? {};      // { id: name }
  const products = page.products ?? {};
  const categories = page.categories ?? {};
  const filters = page.filters ?? {};
  const breadcrumbs = [
    { title: 'Bảng điều khiển quản trị', href: '/admin/dashboard' },
    { title: 'Khuyến mãi', href: '/admin/promotions' },
  ];

  const toggle = (id: number) => router.post(`/admin/promotions/${id}/toggle-status`);

  // inline delete confirmation UI
  const [confirmModal, setConfirmModal] = useState<{ id: number | null; code?: string; open: boolean }>({ id: null, code: undefined, open: false });

  const askDelete = (id: number, code?: string) => setConfirmModal({ id, code, open: true });
  const cancelDelete = () => setConfirmModal({ id: null, code: undefined, open: false });
  const confirmDelete = (id: number | null) => {
    if (!id) return cancelDelete();
    router.delete(`/admin/promotions/${id}`);
    setConfirmModal({ id: null, code: undefined, open: false });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Quản lý khuyến mãi" />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Khuyến mãi</h1>
          <Link href="/admin/promotions/create" className="bg-green-600 text-white px-4 py-2 rounded">Tạo mới</Link>
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
                <th className="px-4 py-3 text-left">Giới hạn sử dụng</th>
                <th className="px-4 py-3 text-left">Giá trị đơn hàng tối thiểu</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {promotions.data.length === 0 ? (
                <tr><td colSpan={8} className="py-6 text-center text-gray-500">Chưa có khuyến mãi</td></tr>
              ) : promotions.data.map((p:any) => {
                const conds = p.conditions ?? [];
                let applyText = 'Tất cả sản phẩm';
                if (conds.length > 0) {
                  const parts = conds.map((c:any) => {
                    if (c.condition_type === 'brand') return `Thương hiệu: ${brands[c.target_id] ?? ('#' + c.target_id)}`;
                    if (c.condition_type === 'product') return `Sản phẩm: ${products[c.target_id] ?? ('#' + c.target_id)}`;
                    if (c.condition_type === 'category') return `Danh mục: ${categories[c.target_id] ?? ('#' + c.target_id)}`;
                    return `${c.condition_type}:${c.target_id}`;
                  });
                  applyText = parts.join(', ');
                }
                 return (
                   <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                     <td className="px-4 py-3">{p.code}</td>
                     <td className="px-4 py-3">{p.type}</td>
                     <td className="px-4 py-3">{p.value}</td>
                     <td className="px-4 py-3">{p.is_active ? 'Hoạt động' : 'Tắt'}</td>
                     <td className="px-4 py-3">{applyText}</td>
                     <td className="px-4 py-3">{p.usage_limit === null ? 'Không giới hạn' : p.usage_limit}</td>
                     <td className="px-4 py-3">{p.min_order_amount === null ? 'Không yêu cầu' : p.min_order_amount}</td>
                     <td className="px-4 py-3 text-center">
                       <div className="flex items-center justify-center gap-2">
                         <Link href={`/admin/promotions/${p.id}/edit`} className="px-2 py-1 bg-yellow-500 text-white rounded">Sửa</Link>
                         <Link href={`/admin/promotions/${p.id}/usage`} className="px-2 py-1 bg-blue-600 text-white rounded">Lượt</Link>
                         <button onClick={() => toggle(p.id)} className="px-2 py-1 bg-indigo-600 text-white rounded">{p.is_active ? 'Tắt' : 'Bật'}</button>

                         {/* open modal on delete */}
                         <button onClick={() => askDelete(p.id, p.code)} className="px-2 py-1 bg-red-600 text-white rounded">Xóa</button>
                       </div>
                     </td>
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {promotions.links?.map((link:any, idx:number) =>
            link.url ? (
              <button key={idx} onClick={() => router.visit(link.url)} className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
            ) : (
              <span key={idx} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
            )
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={cancelDelete} />
          <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-700 mb-4">Bạn có chắc muốn xóa mã khuyến mãi <strong>{confirmModal.code}</strong>? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Hủy</button>
              <button onClick={() => confirmDelete(confirmModal.id)} className="px-4 py-2 bg-red-600 text-white rounded">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
