// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { createPortal } from 'react-dom';

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
  const brands = page.brands ?? {};      // { id: name }
  const products = page.products ?? {};
  const categories = page.categories ?? {};
  const filters = page.filters ?? {};
  const breadcrumbs = [
    { title: 'Trang quản trị', href: '/admin/dashboard' },
    { title: 'Khuyến mãi', href: '/admin/promotions' },
  ];

  const toggle = (id: number) => router.post(`/admin/promotions/${id}/toggle-status`);

  // inline delete confirmation UI
  const [confirmModal, setConfirmModal] = useState<{ id: number | null; code?: string; open: boolean }>({ id: null, code: undefined, open: false });
  const [successMessage, setSuccessMessage] = useState<string>('');

  const askDelete = (id: number, code?: string) => setConfirmModal({ id, code, open: true });
  const cancelDelete = () => setConfirmModal({ id: null, code: undefined, open: false });
  const confirmDelete = (id: number | null) => {
    if (!id) return cancelDelete();

    router.delete(`/admin/promotions/${id}`, {
      onSuccess: () => {
        // close modal and show success toast/banner
        setConfirmModal({ id: null, code: undefined, open: false });
        setSuccessMessage('Xóa khuyến mãi thành công');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: () => {
        setConfirmModal({ id: null, code: undefined, open: false });
        setSuccessMessage('Xóa không thành công, vui lòng thử lại');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    });
  };

  // expanded rows for "Áp dụng" details
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const toggleExpand = (id: number) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

  // per-row action menu open state
  const [openMenu, setOpenMenu] = useState<Record<number, boolean>>({});
  // menu anchor info for portal positioning
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

  // Portal menu component so menu can render outside table (won't be clipped/push content)
  function PortalMenu({ rect, children, onClose }: { rect?: DOMRect | null; children: any; onClose: () => void }) {
    const [pos, setPos] = useState({ top: 0, left: 0 });
    useEffect(() => {
      if (!rect) return;
      const top = rect.bottom + window.scrollY + 6;
      // try to keep menu inside viewport
      const menuWidth = 176;
      let left = rect.right + window.scrollX - menuWidth + 8;
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
      setPos({ top, left });
    }, [rect]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        onClose();
      };
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    }, [onClose]);

    if (!rect) return null;

    return createPortal(
      <div
        className="origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999]"
        style={{ position: 'absolute', top: pos.top, left: pos.left, width: 176 }}
        onClick={(e) => e.stopPropagation()} // keep clicks inside menu from bubbling to document
      >
        {children}
      </div>,
      document.body
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Quản lý khuyến mãi" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Khuyến mãi</h1>
          <Link href="/admin/promotions/create" className="bg-green-600 text-white px-4 py-2 rounded">Tạo mới</Link>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full min-w-[1000px]">
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
                // summary for apply column
                const applySummary = conds.length === 0 ? 'Tất cả sản phẩm' : `${conds.length} điều kiện`;

                // detailed apply text (will show when expanded)
                const applyDetails = conds.length === 0 ? 'Áp dụng cho tất cả sản phẩm' : conds.map((c:any) => {
                  if (c.condition_type === 'brand') return `Thương hiệu: ${brands[c.target_id] ?? ('#' + c.target_id)}`;
                  if (c.condition_type === 'product') return `Sản phẩm: ${products[c.target_id] ?? ('#' + c.target_id)}`;
                  if (c.condition_type === 'category') return `Danh mục: ${categories[c.target_id] ?? ('#' + c.target_id)}`;
                  return `${c.condition_type}:${c.target_id}`;
                }).join(' • ');

                // value display: fixed => money, percent => show % (convert 0-1 -> 1-100)
                let valueDisplay = '';
                if (p.type === 'fixed') {
                  valueDisplay = formatMoney(p.value);
                } else if (p.type === 'percent' || p.type === 'percentage') {
                  const raw = Number(p.value) || 0;
                  // if stored as fraction (0..1) convert to percent
                  let percent = raw <= 1 && raw > 0 ? raw * 100 : raw;
                  // round to max 2 decimals, remove trailing .00
                  percent = Math.round((percent + Number.EPSILON) * 100) / 100;
                  valueDisplay = (Number.isInteger(percent) ? percent.toLocaleString('vi-VN') : percent.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })) + '%';
                } else {
                  valueDisplay = String(p.value);
                }

                // min order amount: drop fractional part and show currency
                const minOrderDisplay = p.min_order_amount === null || p.min_order_amount === undefined
                  ? 'Không yêu cầu'
                  : formatMoney(Math.trunc(Number(p.min_order_amount)));

                 return (
                   <React.Fragment key={p.id}>
                     <tr className="odd:bg-white even:bg-gray-50">
                       <td className="px-4 py-3">{p.code}</td>
                       <td className="px-4 py-3">{p.type}</td>
                       <td className="px-4 py-3">
                          {valueDisplay}
                       </td>
                       <td className="px-4 py-3">{p.is_active ? 'Hoạt động' : 'Tắt'}</td>
                       <td className="px-4 py-3">
                         <div className="flex items-center gap-2">
                           <span>{applySummary}</span>
                           {conds.length > 0 && (
                             <button
                               onClick={() => toggleExpand(p.id)}
                               className="text-sm text-blue-600 hover:underline ml-2"
                               aria-expanded={!!expandedRows[p.id]}
                             >
                               Chi tiết
                             </button>
                           )}
                         </div>
                       </td>
                       <td className="px-4 py-3">{p.usage_limit === null ? 'Không giới hạn' : p.usage_limit}</td>
                       <td className="px-4 py-3">{minOrderDisplay}</td>
                       <td className="px-4 py-3 text-center">
                         <div className="relative inline-block text-left">
                          <button
                            onClick={(e) => toggleMenu(p.id, e)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                            aria-haspopup="true"
                            aria-expanded={!!openMenu[p.id]}
                          >
                            <span className="text-lg">⋯</span>
                          </button>

                          {openMenu[p.id] && (
                            <PortalMenu rect={menuAnchor.rect} onClose={() => closeMenu(p.id)}>
                              <div className="py-1">
                                <Link href={`/admin/promotions/${p.id}/edit`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => closeMenu(p.id)}>Sửa</Link>
                                <Link href={`/admin/promotions/${p.id}/usage`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => closeMenu(p.id)}>Lượt</Link>
                                <button onClick={() => { toggle(p.id); closeMenu(p.id); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  {p.is_active ? 'Tắt' : 'Bật'}
                                </button>
                                <button onClick={() => { askDelete(p.id, p.code); closeMenu(p.id); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                  Xóa
                                </button>
                              </div>
                            </PortalMenu>
                          )}
                        </div>
                       </td>
                     </tr>

                     {/* details row */}
                     {expandedRows[p.id] && (
                       <tr className="bg-gray-50">
                         <td colSpan={8} className="px-4 py-3 text-sm text-gray-700">
                           <strong>Chi tiết áp dụng:</strong> {applyDetails}
                         </td>
                       </tr>
                     )}
                   </React.Fragment>
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
