// @ts-nocheck
import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Product {
  id: number;
  name?: string;
  image?: string;
}

interface Variant {
  id: number;
  name?: string;
  image?: string;
}

interface Item {
  id: number;
  product?: Product | null;
  variant?: Variant | null;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  is_default: boolean;
}

interface Promotion {
  id: number;
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  description?: string;
  min_order_amount?: number;
  seller_id?: number | null;
}

interface PaymentMethod {
  id: number;
  name: string;
  provider: string;
}

export default function Checkout({ 
  cart, 
  addresses = [], 
  paymentMethods = [],
  promotions = [], 
  placeOrderUrl, 
  cart_item_id = null 
}: any) {
  const { data, setData, post, processing, errors } = useForm({
    shipping_address_id: addresses.length ? addresses.find((a: Address) => a.is_default)?.id ?? addresses[0].id : null,
    payment_method_id: paymentMethods.length ? paymentMethods[0].id : null,
    promotion_id: null,
    cart_item_id: cart_item_id,
  });

  const computeTotals = (): { total: number; discount: number; final: number } => {
    const total = cart?.total ?? 0;
    const promo: Promotion | undefined = promotions.find((p: Promotion) => p.id === data.promotion_id);
    let discount = 0;
    if (promo) {
      if (promo.type === 'fixed') {
        discount = Math.min(promo.value, total);
      } else {
        discount = Math.round(total * (promo.value / 100) * 100) / 100;
      }
    }
    const finalTotal = Math.max(0, total - discount);
    return { total, discount, final: finalTotal };
  };

  const { total, discount, final } = computeTotals();

  const onPlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!data.shipping_address_id) {
      alert('Vui lòng chọn địa chỉ giao hàng');
      return;
    }
    if (!data.payment_method_id) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }
    
    if (!confirm('Xác nhận đặt hàng?')) return;
    
    post(placeOrderUrl);
  };

  // Format tiền: nếu là số nguyên thì không hiện phần thập phân (.00)
  const formatMoney = (v: any) => {
    if (v == null) return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return '-';
    if (Math.abs(n - Math.round(n)) < 1e-9) {
      return Math.round(n).toLocaleString('vi-VN') + '₫';
    }
    return n.toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + '₫';
  };

  // selected address object for display
  const selectedAddress = addresses.find((a: Address) => Number(a.id) === Number(data.shipping_address_id)) || null;
  const selectedPayment = paymentMethods.find((pm: PaymentMethod) => Number(pm.id) === Number(data.payment_method_id)) || null;

  // Thêm log chi tiết hơn để debug
  useEffect(() => {
    console.log('Available promotions:', promotions);
    if (promotions && promotions.length === 0) {
      console.log('Không có khuyến mãi nào khả dụng');
    } else if (promotions && promotions.length > 0) {
      console.log('Số lượng khuyến mãi: ', promotions.length);
      console.log('Chi tiết khuyến mãi đầu tiên:', promotions[0]);
    }
  }, [promotions]);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Trang chủ', href: '/' },
        { title: 'Thanh toán', href: '/checkout' }
      ]}
    >
      <Head title="Thanh toán" />

      {/* Mở rộng toàn bộ vùng hiển thị */}
      <div className="max-w-screen-2xl mx-auto px-12 py-10">
        {(!cart || !cart.items || cart.items.length === 0) ? (
          <>
            <h1 className="text-4xl font-bold mb-8">Xác nhận đơn hàng</h1>
            <div className="text-xl text-gray-500">Giỏ hàng trống.</div>
          </>
        ) : (
          <div className="grid grid-cols-12 gap-10">
            {/* Sản phẩm: chiếm 7/12 - tiêu đề đặt trong cột này để align top */}
            <div className="col-span-7">
              <h1 className="text-4xl font-bold mb-6">Xác nhận đơn hàng</h1>
              <div className="space-y-6">
                {cart.items.map((it: Item) => {
                  const imageSrc = it.variant?.image ?? it.product?.image ?? '';
                  return (
                    <div key={it.id} className="flex gap-6 items-start p-5 border rounded-lg bg-white shadow-sm">
                      <div className="flex-shrink-0">
                        {imageSrc ? (
                          <img src={imageSrc} alt={it.product?.name} className="h-28 w-28 object-contain rounded" />
                        ) : (
                          <div className="h-28 w-28 bg-gray-100 rounded" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="font-semibold text-2xl mb-3">{it.product?.name || '-'}</div>

                        <div className="text-lg text-gray-700 space-y-2">
                          <div><span className="font-medium">Biến thể:</span> <span className="ml-3">{it.variant?.name || '-'}</span></div>
                          <div><span className="font-medium">Đơn giá:</span> <span className="ml-3">{formatMoney(it.price)}</span></div>
                          <div><span className="font-medium">Số lượng:</span> <span className="ml-3">{it.quantity}</span></div>
                          <div><span className="font-medium">Thành tiền:</span> <span className="ml-3">{formatMoney(it.subtotal)}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aside: chiếm 5/12 - giờ sẽ đứng ngang hàng với phần sản phẩm */}
            <aside className="col-span-5">
              {/* Địa chỉ giao hàng */}
              <div className="mb-6">
                <h3 className="font-semibold text-2xl mb-4">Địa chỉ giao hàng</h3>
                {addresses.length === 0 ? (
                  <div className="text-lg text-red-600">Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ.</div>
                ) : (
                  <>
                    <select
                      value={data.shipping_address_id ?? ''}
                      onChange={(e) => setData('shipping_address_id', e.target.value ? Number(e.target.value) : null)}
                      className="border p-4 rounded w-full text-lg"
                    >
                      {addresses.map((a: Address) => (
                        <option key={a.id} value={a.id}>
                          {a.recipient_name} — {a.phone} {a.is_default ? '(Mặc định)' : ''}
                        </option>
                      ))}
                    </select>

                    {selectedAddress && (
                      <div className="mt-4 p-4 bg-gray-50 rounded text-base space-y-1">
                        <div className="font-semibold">{selectedAddress.recipient_name}</div>
                        <div className="text-gray-600">{selectedAddress.phone}</div>
                        <div className="text-gray-700">{selectedAddress.full_address || selectedAddress.address_line}</div>
                      </div>
                    )}
                  </>
                )}
                {errors.shipping_address_id && <div className="text-red-600 text-sm mt-2">{errors.shipping_address_id}</div>}
              </div>

              {/* Phương thức thanh toán */}
              <div className="mb-6">
                <h3 className="font-semibold text-2xl mb-4">Phương thức thanh toán</h3>
                {paymentMethods.length === 0 ? (
                  <div className="text-lg text-red-600">Không có phương thức thanh toán khả dụng.</div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((pm: PaymentMethod) => (
                      <label key={pm.id} className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment_method"
                          value={pm.id}
                          checked={Number(data.payment_method_id) === Number(pm.id)}
                          onChange={() => setData('payment_method_id', pm.id)}
                          className="w-4 h-4"
                        />
                        <div>
                          <div className="font-medium">{pm.name}</div>
                          {pm.provider && <div className="text-sm text-gray-500">{pm.provider}</div>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                {errors.payment_method_id && <div className="text-red-600 text-sm mt-2">{errors.payment_method_id}</div>}
              </div>

              {/* Mã khuyến mãi */}
              <div className="mb-6">
                <h3 className="font-semibold text-2xl mb-4">Mã khuyến mãi</h3>
                <select
                  value={data.promotion_id ?? ''}
                  onChange={(e) => setData('promotion_id', e.target.value ? Number(e.target.value) : null)}
                  className="border p-4 rounded w-full text-lg"
                >
                  <option value="">-- Không sử dụng --</option>
                  {promotions.map((p: Promotion) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.type === 'fixed' ? formatMoney(p.value) : `${p.value}%`}
                      {p.description && ` — ${p.description}`}
                    </option>
                  ))}
                </select>
                {errors.promotion_id && <div className="text-red-600 text-sm mt-2">{errors.promotion_id}</div>}
              </div>

              {/* Tóm tắt đơn hàng */}
              <div className="p-6 border rounded-lg mb-5 bg-white shadow-sm">
                <div className="flex justify-between mb-3 text-lg">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{formatMoney(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-3 text-lg">
                    <span>Giảm giá</span>
                    <span className="font-semibold text-red-600">- {formatMoney(discount)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Tổng thanh toán</span>
                    <span className="text-blue-600">{formatMoney(final)}</span>
                  </div>
                </div>
              </div>

              {/* Nút Đặt hàng */}
              <form onSubmit={onPlaceOrder}>
                <button 
                  type="submit" 
                  disabled={processing || !data.shipping_address_id || !data.payment_method_id}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded text-xl font-semibold transition"
                >
                  {processing ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>
              </form>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
