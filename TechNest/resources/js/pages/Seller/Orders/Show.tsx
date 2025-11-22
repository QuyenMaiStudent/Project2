import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface OrderItem {
    id: number;
    product_name?: string | null;
    product_image?: string | null;
    variant_name?: string | null;
    quantity: number;
    price: number;
    subtotal: number;
}

interface ShippingAddress {
    recipient_name: string;
    phone: string;
    full_address: string;
}

interface Promotion {
    code: string;
    type: string;
    value: number;
}

interface OrderDetail {
    id: number;
    status: string;
    payment_status: string;
    placed_at: string | null;
    subtotal: number;
    items: OrderItem[];
    shipping_address: ShippingAddress | null;
    promotion: Promotion | null;
    can_fulfill: boolean;
}

interface Props {
    order: OrderDetail;
}

const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function Show({ order }: Props) {
    return (
        <AppLayout>
            <Head title={`Đơn hàng #${order.id}`} />

            <div className="mx-auto max-w-4xl space-y-6 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Đơn hàng #{order.id}</h1>
                        <p className="text-sm text-gray-600">
                            Ngày đặt: {order.placed_at ?? 'Không xác định'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/seller/orders"
                            className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
                        >
                            Quay lại danh sách
                        </Link>
                        {order.can_fulfill && (
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                            >
                                Lên đơn
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-900">Sản phẩm</h2>
                        <div className="mt-4 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {item.product_image ? (
                                        <img
                                            src={item.product_image}
                                            alt={item.product_name ?? ''}
                                            className="h-16 w-16 rounded border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded border bg-gray-50 text-xs text-gray-400">
                                            No image
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {item.product_name ?? 'Sản phẩm đã xoá'}
                                            </p>
                                            {item.variant_name && (
                                                <p className="text-sm text-gray-500">
                                                    Phân loại: {item.variant_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>Số lượng: {item.quantity}</span>
                                            <span>Đơn giá: {formatMoney(item.price)}</span>
                                            <span className="font-semibold text-gray-900">
                                                Tổng: {formatMoney(item.subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Thông tin đơn</h2>
                            <dl className="mt-3 space-y-2 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <dt>Trạng thái đơn</dt>
                                    <dd className="capitalize">{order.status}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Thanh toán</dt>
                                    <dd className="capitalize">{order.payment_status}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Doanh thu của bạn</dt>
                                    <dd className="font-semibold text-gray-900">
                                        {formatMoney(order.subtotal)}
                                    </dd>
                                </div>
                                {order.promotion && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <dt>Khuyến mãi</dt>
                                        <dd>{order.promotion.code}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                            {order.shipping_address ? (
                                <div className="mt-3 space-y-1 text-sm text-gray-700">
                                    <p className="font-medium">{order.shipping_address.recipient_name}</p>
                                    <p>SĐT: {order.shipping_address.phone}</p>
                                    <p>{order.shipping_address.full_address}</p>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-gray-500">Không có thông tin địa chỉ.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}