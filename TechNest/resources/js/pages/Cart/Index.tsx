import React, { useState } from 'react';
import { Head, router, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Product {
  id: number;
  name: string;
  image_url?: string;
  price?: number;
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

  const handleUpdate = (itemId: number, quantity: number) => {
    router.post(`/cart/update/${itemId}`, { quantity });
  };

  const handleDelete = (itemId: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      router.post(`/cart/delete/${itemId}`);
    }
  };

  const formatCurrency = (v: any) => {
    if (v == null) return '-';
    return Number(v).toLocaleString('vi-VN') + '₫';
  };

  const handleClearConfirmed = () => {
    setProcessingClear(true);
    setLocalError(null);
    router.post('/cart/clear', {}, {
      onSuccess: () => {
        setProcessingClear(false);
        setShowClearModal(false);
        // Inertia sẽ follow redirect và cập nhật props (bao gồm flash)
      },
      onError: () => {
        setProcessingClear(false);
        setLocalError('Xóa thất bại, thử lại.');
      }
    });
  };

  // Lấy first validation error (nếu có)
  const firstError = Object.keys(errors).length ? (errors[Object.keys(errors)[0]] as any)[0] : null;

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Giao diện người dùng', href: '/' },
        { title: 'Giỏ hàng', href: '/cart' }
      ]}
    >
      <Head title="Giỏ hàng" />

      <div className="max-w-6xl mx-auto p-6"> 
        {/* Flash success */}
        {flash.success ? (
          <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-800">
            {flash.success}
          </div>
        ) : null}

        {/* Flash error or local error */}
        {flash.error ? (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">
            {flash.error}
          </div>
        ) : null}

        {firstError ? (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">
            {firstError}
          </div>
        ) : null}

        {localError ? (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-800">
            {localError}
          </div>
        ) : null}

        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="text-sm text-gray-600">
            Tổng mặt hàng: {cart.items.length}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/checkout"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mua tất cả
            </Link>

            <button
              onClick={() => setShowClearModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <div className="text-lg font-medium mb-2">Giỏ hàng trống.</div>
            <div className="text-sm mb-4">Bạn chưa có sản phẩm nào trong giỏ.</div>
            <div>
              <Link
                href="/products"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                href="/"
                className="ml-3 inline-block border px-4 py-2 rounded hover:bg-gray-100"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full border rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Sản phẩm</th>
                  <th className="py-2 px-3 text-left">Biến thể</th>
                  <th className="py-2 px-3 text-center">Giá</th>
                  <th className="py-2 px-3 text-center">Thành tiền</th>
                  <th className="py-2 px-3 text-center">Số lượng</th>
                  <th className="py-2 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
                  const imageSrc = item.variant?.image_url ?? item.product?.image_url ?? '';
                  const price = item.product?.price ?? 0;
                  const subtotal = price * (item.quantity || 0);

                  return (
                    <tr key={item.id}>
                      <td className="py-2 px-3 flex items-center gap-2">
                        {imageSrc ? (
                          <img src={imageSrc} alt={item.product?.name || ''} className="h-10 w-10 object-contain rounded" />
                        ) : null}
                        {item.product?.name || '-'}
                      </td>
                      <td className="py-2 px-3">{item.variant?.variant_name || '-'}</td>
                      <td className="py-2 px-3 text-center">
                        {price ? formatCurrency(price) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {subtotal ? formatCurrency(subtotal) : '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => handleUpdate(item.id, Number(e.target.value))}
                          className="border rounded px-2 py-1 w-16 text-center"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Xóa
                          </button>

                          <Link
                            href={`/checkout?item_id=${item.id}`}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Mua
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Xóa tất cả */}
        {showClearModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowClearModal(false)}></div>
            <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-2">Xóa tất cả sản phẩm</h3>
              <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => setShowClearModal(false)}
                  disabled={processingClear}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-600 text-white"
                  onClick={handleClearConfirmed}
                  disabled={processingClear}
                >
                  {processingClear ? 'Đang xóa...' : 'Xóa tất cả'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
