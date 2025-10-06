import React from 'react';
import { Head, router } from '@inertiajs/react';
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
  const handleUpdate = (itemId: number, quantity: number) => {
    router.post(`/cart/update/${itemId}`, { quantity });
  };

  const handleDelete = (itemId: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      router.post(`/cart/delete/${itemId}`);
    }
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Trang chủ', href: '/' },
        { title: 'Giỏ hàng', href: '/cart' }
      ]}
    >
      <Head title="Giỏ hàng" />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
        {cart.items.length === 0 ? (
          <div className="text-gray-500 text-center py-12">Giỏ hàng trống.</div>
        ) : (
          <table className="w-full border rounded">
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
              {cart.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-3 flex items-center gap-2">
                    {item.product?.image_url && (
                      <img src={item.product.image_url} alt={item.product.name} className="h-10 w-10 object-contain rounded" />
                    )}
                    {item.product?.name || '-'}
                  </td>
                  <td className="py-2 px-3">{item.variant?.variant_name || '-'}</td>
                  <td className="py-2 px-3 text-center">{item.product?.price?.toLocaleString() || '-'}</td>
                  <td className="py-2 px-3 text-center">{(item.product?.price && item.quantity) ? (item.product.price * item.quantity).toLocaleString() : '-'}</td>
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
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppLayout>
  );
}
