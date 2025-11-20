import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Eye, Edit, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react'; // Thêm icons từ lucide-react

export default function Index() {
  const page = usePage().props as any;

  // format money: drop trailing .00 and add " đ"
  const formatMoney = (v: any) => {
    if (v === null || v === undefined || v === '') return '';
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    // integer -> show without decimals
    if (Math.abs(n - Math.round(n)) < 1e-9) {
      return Math.round(n).toLocaleString('vi-VN') + ' đ';
    }
    // otherwise keep two decimals
    return n.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' đ';
  };

  const promotions = page.promotions ?? { data: [], links: [] };
  const brands = page.brands ?? [];
  const products = page.products ?? [];
  const brandMap = Object.fromEntries(brands.map((b: any) => [String(b.id), b.name]));
  const productMap = Object.fromEntries(products.map((p: any) => [String(p.id), p.name || (`#${p.id}`)]));
  const filters = page.filters ?? {};
  const flash = page.flash ?? {};
  const breadcrumbs = [
    { title: 'Giao diện người bán', href: '/seller/dashboard' },
    { title: 'Khuyến mãi', href: '/seller/promotions' },
  ];

  const toggle = (id: number) => router.post(`/seller/promotions/${id}/toggle-status`);
 
   // modal confirm state (delete)
   const [confirmModal, setConfirmModal] = useState<{ open: boolean; id?: number | null; code?: string }>({ open: false, id: null, code: undefined });
   const askDelete = (id: number, code?: string) => setConfirmModal({ open: true, id, code });
   const cancelDelete = () => setConfirmModal({ open: false, id: null, code: undefined });
   const confirmDelete = (id?: number | null) => {
     if (!id) return cancelDelete();
     router.delete(`/seller/promotions/${id}`);
     setConfirmModal({ open: false, id: null, code: undefined });
   };
 
   // action menu (portal) state so menu can appear outside table and not push content
   const [openMenu, setOpenMenu] = useState<Record<number, boolean>>({});
   const [menuAnchor, setMenuAnchor] = useState<{ id: number | null; rect?: DOMRect }>({ id: null });
   const toggleMenu = (id: number, e?: any) => {
     e?.stopPropagation();
     const rect = e?.currentTarget?.getBoundingClientRect?.();
     setOpenMenu(prev => ({ ...prev, [id]: !prev[id] }));
     setMenuAnchor({ id, rect });
   };
   const closeMenu = (id: number) => {
     setOpenMenu(prev => ({ ...prev, [id]: false }));
     setMenuAnchor(prev => (prev.id === id ? { id: null } : prev));
   };
 
   function PortalMenu({ rect, children, onClose }: { rect?: DOMRect | null; children: any; onClose: () => void }) {
     const [pos, setPos] = useState({ top: 0, left: 0 });
     useEffect(() => {
       if (!rect) return;
       const top = rect.bottom + window.scrollY + 6;
       const menuWidth = 176;
       let left = rect.right + window.scrollX - menuWidth + 8;
       left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
       setPos({ top, left });
     }, [rect]);
 
     useEffect(() => {
       const handler = (e: MouseEvent) => onClose();
       document.addEventListener('click', handler);
       return () => document.removeEventListener('click', handler);
     }, [onClose]);
 
     if (!rect) return null;
     return createPortal(
       <div
         className="origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]"
         style={{ position: 'absolute', top: pos.top, left: pos.left, width: 176 }}
         onClick={(e) => e.stopPropagation()}
       >
         {children}
       </div>,
       document.body
     );
   }
 
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Khuyến mãi của tôi" />
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        {/* Flash messages với cải thiện */}
        {flash?.success && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-800 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              {flash.success}
            </div>
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {flash.error}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Khuyến mãi của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý các chương trình khuyến mãi để tăng doanh số bán hàng</p>
          </div>
          <Link
            href="/seller/promotions/create"
            className="px-6 py-3 bg-[#0AC1EF] text-white rounded-lg hover:bg-[#09b3db] transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Tạo khuyến mãi mới</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Mã khuyến mãi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Giá trị</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Áp dụng cho</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Giới hạn</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Đơn hàng tối thiểu</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {promotions.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khuyến mãi nào</h3>
                        <p className="text-gray-500 mb-4">Hãy tạo khuyến mãi đầu tiên để thu hút khách hàng</p>
                        <Link
                          href="/seller/promotions/create"
                          className="px-4 py-2 bg-[#0AC1EF] text-white rounded-lg hover:bg-[#09b3db] transition-colors"
                        >
                          Tạo khuyến mãi đầu tiên
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  promotions.data.map((p: any) => {
                    const conds = p.conditions ?? [];
                    const parts = conds.length === 0
                      ? ['Tất cả sản phẩm của tôi']
                      : conds.map((c: any) => {
                          if (c.condition_type === 'product') return `Sản phẩm: ${productMap[String(c.target_id)] ?? ('#' + c.target_id)}`;
                          if (c.condition_type === 'brand') return `Thương hiệu: ${brandMap[String(c.target_id)] ?? ('#' + c.target_id)}`;
                          if (c.condition_type === 'category') return `Danh mục: #${c.target_id}`;
                          return `${c.condition_type}:${c.target_id}`;
                        });

                    let valueDisplay = '';
                    if (p.type === 'fixed') {
                      valueDisplay = formatMoney(p.value);
                    } else {
                      const raw = Number(p.value) || 0;
                      let percent = raw > 0 && raw <= 1 ? raw * 100 : raw;
                      percent = Math.round((percent + Number.EPSILON) * 100) / 100;
                      valueDisplay = (Number.isInteger(percent) ? percent.toLocaleString('vi-VN') : percent.toLocaleString('vi-VN', { maximumFractionDigits: 2 })) + '%';
                    }

                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#0AC1EF] rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-sm">{p.code.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-gray-900">{p.code}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.type === 'fixed' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {p.type === 'fixed' ? 'Giảm giá cố định' : 'Giảm giá %'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold text-[#0AC1EF]">{valueDisplay}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {p.is_active ? (
                              <>
                                <ToggleRight className="w-3 h-3 mr-1" />
                                Hoạt động
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-3 h-3 mr-1" />
                                Tắt
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {parts.map((part, idx) => (
                              <div key={idx} className="mb-1 last:mb-0">{part}</div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {p.usage_limit === null ? 'Không giới hạn' : `${p.usage_limit} lượt`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatMoney(p.min_order_amount)}
                        </td>
                        <td className="px-6 py-4 text-center relative">
                          <div className="inline-block relative">
                            <button
                              onClick={(e) => toggleMenu(p.id, e)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-150"
                              aria-haspopup="true"
                              aria-expanded={!!openMenu[p.id]}
                            >
                              <span className="text-lg">⋯</span>
                            </button>
                            {openMenu[p.id] && (
                              <PortalMenu rect={menuAnchor.rect} onClose={() => closeMenu(p.id)}>
                                <div className="py-1">
                                  <Link href={`/seller/promotions/${p.id}/edit`} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100" onClick={() => closeMenu(p.id)}>
                                    <Edit className="w-4 h-4 mr-3" />
                                    <span>Sửa</span>
                                  </Link>
                                  <Link href={`/seller/promotions/${p.id}/usage`} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border-b border-gray-100" onClick={() => closeMenu(p.id)}>
                                    <Eye className="w-4 h-4 mr-3" />
                                    <span>Lượt sử dụng</span>
                                  </Link>
                                  <button onClick={() => { toggle(p.id); closeMenu(p.id); }} className={`flex items-center w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100 ${p.is_active ? 'text-gray-700 hover:bg-yellow-50 hover:text-yellow-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}>
                                    {p.is_active ? <ToggleLeft className="w-4 h-4 mr-3" /> : <ToggleRight className="w-4 h-4 mr-3" />}
                                    <span>{p.is_active ? 'Tắt' : 'Bật'}</span>
                                  </button>
                                  <button onClick={() => { askDelete(p.id, p.code); closeMenu(p.id); }} className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">
                                    <Trash2 className="w-4 h-4 mr-3" />
                                    <span>Xóa</span>
                                  </button>
                                </div>
                              </PortalMenu>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination cải thiện */}
        <div className="mt-6 flex justify-center bg-white p-4 rounded-lg shadow-md">
          <nav className="flex gap-2">
            {promotions.links?.map((link: any, idx: number) =>
              link.url ? (
                <button
                  key={idx}
                  onClick={() => router.visit(link.url)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    link.active
                      ? 'bg-[#0AC1EF] text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-400"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              )
            )}
          </nav>
        </div>
      </div>

      {/* Modal xác nhận xóa cải thiện */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm" onClick={cancelDelete} />
          <div className="bg-white rounded-xl shadow-2xl z-10 max-w-md w-full p-6 transform transition-all duration-300 scale-100 border-t-4 border-[#0AC1EF]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Bạn có chắc muốn xóa mã khuyến mãi <strong className="text-[#0AC1EF]">{confirmModal.code}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => confirmDelete(confirmModal.id)}
                className="px-4 py-2 bg-[#0AC1EF] text-white rounded-lg hover:bg-[#09b3db] transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
