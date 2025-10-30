import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
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
  const [showClearModal, setShowClearModal] = useState(false);
  const [processingClear, setProcessingClear] = useState(false);

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
    router.post('/cart/clear', {}, {
      onSuccess: () => {
        setProcessingClear(false);
        setShowClearModal(false);
        router.reload();
      },
      onError: () => {
        setProcessingClear(false);
        alert('Xóa thất bại, thử lại.');
      }
    });
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Trang chủ', href: '/' },
        { title: 'Giỏ hàng', href: '/cart' }
      ]}
    >
      <Head title="Giỏ hàng" />

      {/* tăng chiều ngang: lớn hơn container + cho phép cuộn ngang nếu cần */}
      <div className="max-w-6xl mx-auto p-6"> 
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
          <div className="text-gray-500 text-center py-12">Giỏ hàng trống.</div>
        ) : (
          // wrapper cho scroll ngang trên màn hình nhỏ
          <div className="overflow-x-auto">
            {/* đảm bảo bảng có chiều ngang tối thiểu để rộng ra */}
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
