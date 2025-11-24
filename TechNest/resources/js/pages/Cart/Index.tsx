import React, { useMemo, useState } from 'react';
import { Head, router, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Product {
  id: number;
  name: string;
  image_url?: string;
  price?: number;
  slug?: string;
}

interface Variant {
  id: number;
  variant_name: string;
  image_url?: string;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product | null;
  variant: Variant | null;
}

interface CartProps {
  cart: {
    id: number;
    items: CartItem[];
  };
}

export default function Index({ cart }: CartProps) {
  const { props } = usePage();
  const flash = (props as any).flash || {};
  const errors = (props as any).errors || {};

  const [showClearModal, setShowClearModal] = useState(false);
  const [processingClear, setProcessingClear] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [updatingItemIds, setUpdatingItemIds] = useState<number[]>([]);

  const formatCurrency = (v: any) => {
    if (v == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v));
  };

  const handleUpdate = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingItemIds((s) => [...s, itemId]);
    router.post(`/cart/update/${itemId}`, { quantity }, {
      onFinish: () => setUpdatingItemIds((s) => s.filter((id) => id !== itemId)),
    });
  };

  const handleDelete = (itemId: number) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
    router.post(`/cart/delete/${itemId}`);
  };

  const handleClearConfirmed = () => {
    setProcessingClear(true);
    setLocalError(null);
    router.post('/cart/clear', {}, {
      onSuccess: () => {
        setProcessingClear(false);
        setShowClearModal(false);
      },
      onError: () => {
        setProcessingClear(false);
        setLocalError('Xóa thất bại, thử lại.');
      }
    });
  };

  const firstError = Object.keys(errors).length ? (errors[Object.keys(errors)[0]] as any)[0] : null;

  const items = cart.items || [];

  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => {
      const price = Number(it.product?.price ?? 0);
      return s + price * (Number(it.quantity) || 0);
    }, 0);
    // future: apply discount, shipping...
    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items]);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Giao diện người dùng', href: '/' },
        { title: 'Giỏ hàng', href: '/cart' }
      ]}
    >
      <Head title="Giỏ hàng" />

      {/* thêm nền xanh giống Orders Index */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Notifications */}
          {flash.success && <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-800">{flash.success}</div>}
          {flash.error && <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">{flash.error}</div>}
          {firstError && <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">{firstError}</div>}
          {localError && <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">{localError}</div>}

          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Giỏ hàng của bạn</h1>
              <p className="text-sm text-slate-500 mt-1">Xem lại sản phẩm, thay đổi số lượng hoặc tiến hành thanh toán.</p>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-2">
                <Link href="/products" className="text-sm px-3 py-2 rounded border hover:bg-slate-50">Tiếp tục mua sắm</Link>
                <button onClick={() => setShowClearModal(true)} className="text-sm px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700">Xóa tất cả</button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {/* Empty state */}
              {items.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                  <div className="text-gray-500 text-lg font-medium mb-2">Giỏ hàng trống</div>
                  <div className="text-sm text-slate-500 mb-4">Thêm sản phẩm để bắt đầu mua sắm.</div>
                  <div>
                    <Link href="/products" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Tiếp tục mua sắm</Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Mobile / card list */}
                  <div className="space-y-4 lg:hidden">
                    {items.map((item) => {
                      const imageSrc = item.variant?.image_url ?? item.product?.image_url ?? '';
                      const price = Number(item.product?.price ?? 0);
                      const subtotal = price * (Number(item.quantity) || 0);
                      const updating = updatingItemIds.includes(item.id);

                      return (
                        <div key={item.id} className="flex gap-4 items-center bg-white border border-slate-200 rounded-lg p-4">
                          <img src={imageSrc || '/placeholder.png'} alt={item.product?.name || ''} className="w-20 h-20 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <Link href={item.product?.slug ? `/products/${item.product.slug}` : '#'} className="block font-medium text-slate-900 truncate">{item.product?.name || '-'}</Link>
                            <div className="text-sm text-slate-500 truncate">{item.variant?.variant_name || '-'}</div>
                            <div className="mt-2 flex items-center justify-between gap-4">
                              <div className="text-sm font-semibold text-slate-800">{formatCurrency(price)}</div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleUpdate(item.id, Number(item.quantity) - 1)} className="px-2 py-1 border rounded disabled:opacity-50" disabled={updating || item.quantity <= 1}>-</button>
                                <input type="number" min={1} value={item.quantity} onChange={e => handleUpdate(item.id, Number(e.target.value))} className="w-16 text-center border rounded px-2 py-1" />
                                <button onClick={() => handleUpdate(item.id, Number(item.quantity) + 1)} className="px-2 py-1 border rounded disabled:opacity-50" disabled={updating}>+</button>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600">Xóa</button>
                              <Link href={`/checkout?item_id=${item.id}`} className="ml-2 text-sm text-green-600">Mua</Link>
                              <div className="ml-auto text-sm text-slate-500">Tổng: {formatCurrency(subtotal)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden lg:block bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm text-slate-500">Sản phẩm</th>
                          <th className="px-4 py-3 text-left text-sm text-slate-500">Biến thể</th>
                          <th className="px-4 py-3 text-center text-sm text-slate-500">Giá</th>
                          <th className="px-4 py-3 text-center text-sm text-slate-500">Số lượng</th>
                          <th className="px-4 py-3 text-center text-sm text-slate-500">Thành tiền</th>
                          <th className="px-4 py-3 text-center text-sm text-slate-500">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => {
                          const imageSrc = item.variant?.image_url ?? item.product?.image_url ?? '';
                          const price = Number(item.product?.price ?? 0);
                          const subtotal = price * (Number(item.quantity) || 0);
                          const updating = updatingItemIds.includes(item.id);

                          return (
                            <tr key={item.id} className="border-b last:border-b-0">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={imageSrc || '/placeholder.png'} alt={item.product?.name || ''} className="w-16 h-16 object-cover rounded" />
                                  <div className="min-w-0">
                                    <Link href={item.product?.slug ? `/products/${item.product.slug}` : '#'} className="font-medium text-slate-900 truncate block">{item.product?.name || '-'}</Link>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-600">{item.variant?.variant_name || '-'}</td>
                              <td className="px-4 py-4 text-center text-sm font-medium">{formatCurrency(price)}</td>
                              <td className="px-4 py-4 text-center">
                                <div className="inline-flex items-center border rounded">
                                  <button onClick={() => handleUpdate(item.id, Number(item.quantity) - 1)} className="px-3 py-1" disabled={updating || item.quantity <= 1}>-</button>
                                  <input type="number" min={1} value={item.quantity} onChange={e => handleUpdate(item.id, Number(e.target.value))} className="w-16 text-center border-l border-r px-2 py-1" />
                                  <button onClick={() => handleUpdate(item.id, Number(item.quantity) + 1)} className="px-3 py-1" disabled={updating}>+</button>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center text-sm font-medium">{formatCurrency(subtotal)}</td>
                              <td className="px-4 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Xóa</button>
                                  <Link href={`/checkout?item_id=${item.id}`} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Mua</Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Tóm tắt đơn hàng — giờ nằm phía dưới danh sách */}
            <div className="lg:max-w-3xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-medium">Tóm tắt đơn hàng</h3>
                <div className="mt-3 text-sm text-slate-600">
                  <div className="flex justify-between py-1">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Phí vận chuyển</span>
                    <span>{totals.shipping ? formatCurrency(totals.shipping) : 'Miễn phí'}</span>
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between items-center font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-lg text-green-600">{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/checkout" className={`block text-center w-full px-4 py-2 rounded ${items.length ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}>
                    Tiến hành thanh toán
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                <div className="font-medium mb-2">Ghi chú</div>
                <div>• Kiểm tra kỹ sản phẩm trước khi xác nhận nhận hàng.</div>
                <div>• Vui lòng liên hệ support nếu có vấn đề với đơn hàng.</div>
              </div>
            </div>
          </div>

          {/* Modal Xóa tất cả */}
          {showClearModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowClearModal(false)}></div>
              <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-2">Xóa tất cả sản phẩm</h3>
                <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?</p>
                <div className="flex justify-end gap-2">
                  <button type="button" className="px-4 py-2 rounded border" onClick={() => setShowClearModal(false)} disabled={processingClear}>Hủy</button>
                  <button type="button" className="px-4 py-2 rounded bg-red-600 text-white" onClick={handleClearConfirmed} disabled={processingClear}>{processingClear ? 'Đang xóa...' : 'Xóa tất cả'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
