// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Checkout(props: any) {
  const {
    cart, 
    addresses = [], 
    paymentMethods = [],
    promotions = [], 
    placeOrderUrl, 
    cart_item_id = null,
    shippingFees = {},
    hasFreeShipping = false,
    shippingRatePerKm = null,
  } = props;

  const page = usePage();
  const { data, setData, post, processing, errors } = useForm({
    shipping_address_id: addresses.length ? addresses.find((a: Address) => a.is_default)?.id ?? addresses[0].id : null,
    payment_method_id: paymentMethods.length ? paymentMethods[0].id : null,
    promotion_id: null,
    cart_item_id: cart_item_id,
    shipping_fee: null,
    discount_amount: 0,
    final_total: 0,
    subtotal: 0,
  });

  // toast message state (fix ReferenceError: toastMessage is not defined)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // optional: a type-safe processing state already exists; keep consistency
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const shippingFeesMap: Record<string, number | null> = shippingFees ?? {};
  const isFreeShipping = Boolean(hasFreeShipping);
  const selectedAddressKey = data.shipping_address_id != null ? String(data.shipping_address_id) : null;
  const shippingFeeRaw =
    selectedAddressKey !== null ? shippingFeesMap[selectedAddressKey] ?? null : null;
  const shippingFeeAvailable = isFreeShipping || (shippingFeeRaw !== null && shippingFeeRaw !== undefined);
  const shippingFee = isFreeShipping ? 0 : (shippingFeeAvailable ? Number(shippingFeeRaw) : 0);
  const ratePerKm = typeof shippingRatePerKm === 'number' ? shippingRatePerKm : null;

  useEffect(() => {
    const value = shippingFeeAvailable ? shippingFee : null;
    setData('shipping_fee', value);
  }, [shippingFee, shippingFeeAvailable, setData]);

  const computeTotals = (shippingFeeValue: number): { total: number; discount: number; shipping: number; final: number } => {
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
    const finalTotal = Math.max(0, total - discount + shippingFeeValue);
    return { total, discount, shipping: shippingFeeValue, final: finalTotal };
  };

  const { total, discount, shipping, final } = computeTotals(shippingFee);

  useEffect(() => {
    setData('discount_amount', discount);
    setData('final_total', final);
    setData('subtotal', total);
  }, [discount, final, total]);

  const onPlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== PLACE ORDER DEBUG ===');
    console.log('Form data:', data);
    console.log('Shipping fee:', shippingFee);
    console.log('Final total:', final);
    console.log('Discount:', discount);
    console.log('========================');

    post(placeOrderUrl, {
      preserveScroll: true,
      onError: (errors) => {
        console.error('=== PLACE ORDER ERROR ===');
        console.error('Errors object:', errors);
        console.error('Payment error:', errors.payment);
        console.error('Full errors:', JSON.stringify(errors, null, 2));
        console.error('========================');
        
        if (errors.payment) {
          // Log chi tiết payment error
          console.error('Payment error details:', errors.payment);
          
          // Hiển thị toast với message từ server
          setToastMessage(
            typeof errors.payment === 'string' 
              ? errors.payment 
              : 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
          );
        } else {
          const firstError = Object.values(errors)[0];
          setToastMessage(
            typeof firstError === 'string' 
              ? firstError 
              : 'Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.'
          );
        }
      },
      onSuccess: () => {
        console.log('=== PLACE ORDER SUCCESS ===');
      },
    });
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

  // If server flashed an error (detailed), mask it and show generic toast
  useEffect(() => {
    const flashedError = page.props?.flash?.error || page.props?.flash?.errors;
    if (flashedError) {
      setToastMessage('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.props?.flash]);

  // auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 6000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Giao diện người dùng', href: '/' },
        { title: 'Thanh toán', href: '/checkout' }
      ]}
    >
      <Head title="Thanh toán" />

      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Xác nhận đơn hàng</h1>
              <p className="text-sm text-slate-500 mt-1">Kiểm tra sản phẩm, địa chỉ và thanh toán an toàn.</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Số sản phẩm</div>
              <div className="text-2xl font-extrabold">{(cart?.items ?? []).length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: products list (col 1 of 2) */}
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
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-xl">{it.product?.name || '-'}</div>
                          <div className="text-sm text-slate-500 mt-1">{it.variant?.name || '-'}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-semibold">{formatMoney(it.price)}</div>
                          <div className="text-sm text-slate-500 mt-1">Số lượng: {it.quantity}</div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm text-slate-600 flex items-center justify-between">
                        <div>
                          <span className="font-medium">Thành tiền:</span>
                          <span className="ml-2 font-semibold">{formatMoney(it.subtotal)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/products/${it.product?.id}`} className="text-sm text-slate-500 hover:underline">Xem sản phẩm</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h3 className="font-semibold text-lg mb-3">🎁 Mã khuyến mãi</h3>
                {promotions.length === 0 ? (
                  <div className="text-sm text-slate-500 bg-gray-50 p-3 rounded">
                    Không có khuyến mãi khả dụng cho đơn hàng này
                  </div>
                ) : (
                  <>
                    <select
                      value={data.promotion_id ?? ''}

                      onChange={(e) => setData('promotion_id', e.target.value ? Number(e.target.value) : null)}
                      className="border border-slate-300 p-3 rounded w-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Chọn mã khuyến mãi (tùy chọn) --</option>
                      {promotions.map((promo: Promotion) => {
                        const discountText = promo.type === 'fixed'
                          ? `Giảm ${formatMoney(promo.value)}`
                          : `Giảm ${promo.value}%`;
                        const minOrderText = promo.min_order_amount > 0
                          ? ` — Đơn tối thiểu ${formatMoney(promo.min_order_amount)}`
                          : '';
                        return (
                          <option key={promo.id} value={promo.id}>
                            {promo.code} | {discountText}{minOrderText}
                          </option>
                        );
                      })}
                    </select>

                    {data.promotion_id && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg text-sm">
                        {(() => {
                          const selectedPromo = promotions.find((p: Promotion) => p.id === data.promotion_id);
                          if (!selectedPromo) return null;
                          const canApply = selectedPromo.min_order_amount === 0 || total >= selectedPromo.min_order_amount;

                          return (
                            <>
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-semibold text-green-700 flex items-center gap-2">
                                    <span>✓</span>
                                    <span>{selectedPromo.code}</span>
                                  </div>
                                  <div className="text-slate-600 mt-1">
                                    {selectedPromo.description || 'Mã khuyến mãi đã được áp dụng'}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setData('promotion_id', null)}
                                  className="text-slate-400 hover:text-slate-600 text-xs ml-2"
                                >
                                  ✕
                                </button>
                              </div>

                              {!canApply && (
                                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                                  ⚠ Đơn hàng cần đạt tối thiểu {formatMoney(selectedPromo.min_order_amount)} để áp dụng mã này
                                </div>
                              )}

                              {canApply && discount > 0 && (
                                <div className="mt-3 p-2 bg-white border border-green-200 rounded text-xs">
                                  Bạn tiết kiệm được:&nbsp;
                                  <span className="font-semibold text-green-600">{formatMoney(discount)}</span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right column (col 2 of 2) — nội dung phân bố đều */}
            <aside className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-lg mb-3">Địa chỉ giao hàng</h3>
                  {addresses.length === 0 ? (
                    <div className="text-sm text-red-600">Bạn chưa có địa chỉ giao hàng. Vui lòng thêm địa chỉ.</div>
                  ) : (
                    <>
                      <select
                        value={data.shipping_address_id ?? ''}
                        onChange={(e) => setData('shipping_address_id', e.target.value ? Number(e.target.value) : null)}
                        className="border p-3 rounded w-full text-sm"
                      >
                        {addresses.map((a: any) => (
                          <option key={a.id} value={a.id}>
                            {a.recipient_name} — {a.phone} {a.is_default ? '(Mặc định)' : ''}
                          </option>
                        ))}
                      </select>

                      {selectedAddress && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                          <div className="font-medium">{selectedAddress.recipient_name}</div>
                          <div className="text-slate-600">{selectedAddress.phone}</div>
                          <div className="text-slate-700 mt-1">{selectedAddress.address_line}</div>
                          {selectedAddress.latitude && selectedAddress.longitude && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${selectedAddress.latitude},${selectedAddress.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-sm mt-1 inline-block"
                            >
                              Xem trên Google Maps
                            </a>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {errors.shipping_address_id && <div className="text-red-600 text-sm mt-2">{errors.shipping_address_id}</div>}
                </div>

                {/* Payment method */}
                <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold text-lg mb-3">Phương thức thanh toán</h3>
                  {paymentMethods.length === 0 ? (
                    <div className="text-sm text-red-600">Không có phương thức thanh toán khả dụng.</div>
                  ) : (
                    <select
                      value={data.payment_method_id ?? ''}
                      onChange={(e) => setData('payment_method_id', e.target.value ? Number(e.target.value) : null)}
                      className="border p-3 rounded w-full text-sm"
                    >
                      <option value="">-- Chọn phương thức thanh toán --</option>
                      {paymentMethods.map((pm: PaymentMethod) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.name} {pm.provider && `(${pm.provider.toUpperCase()})`}
                        </option>
                      ))}
                    </select>
                  )}
                  {selectedPayment && (
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <div className="font-medium">{selectedPayment.name}</div>
                      <div className="text-slate-600 text-xs mt-1">
                        {selectedPayment.provider === 'stripe' && 'Thanh toán bằng thẻ'}
                        {selectedPayment.provider === 'paypal' && 'Thanh toán qua PayPal'}
                        {selectedPayment.provider === 'momo' && 'Thanh toán qua ví MoMo'}
                        {selectedPayment.provider === 'vnpay' && 'Thanh toán qua VNPay'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary nằm phía dưới các control (chiếm full width của cột phải) */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-lg">
                <h3 className="font-semibold text-lg">Tóm tắt đơn hàng</h3>
                <div className="mt-3 text-sm text-slate-600">
                  <div className="flex justify-between py-1">
                    <span>Tạm tính</span>
                    <span className="font-medium">{formatMoney(total)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Giảm giá</span>
                      <span className="font-medium text-red-600">- {formatMoney(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">
                      {isFreeShipping ? 'Miễn phí' : (shippingFeeAvailable ? formatMoney(shipping) : 'Không thể tính')}
                    </span>
                  </div>

                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span>Tổng thanh toán</span>
                      <span className="text-blue-600">{formatMoney(final)}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={onPlaceOrder} className="mt-4">
                  <button
                    type="submit"
                    disabled={processing || !data.shipping_address_id || !data.payment_method_id || (!isFreeShipping && !shippingFeeAvailable)}
                    className="w-full py-3 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300"
                  >
                    {processing ? 'Đang xử lý...' : 'Đặt hàng và Thanh toán'}
                  </button>
                </form>

                <div className="mt-3 text-xs text-slate-500">
                  🔒 Thanh toán an toàn. Bạn sẽ được chuyển tới cổng thanh toán.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
