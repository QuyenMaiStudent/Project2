import { Head, router } from '@inertiajs/react';
import ShipperLayout from '@/layouts/shipper-layout';

interface OrderItem {
    id: number;
    product_name: string | null;
    variant_name: string | null;
    quantity: number;
    price: number;
}

interface ShippingAddress {
    recipient_name: string;
    phone: string;
    full_address: string;
}

interface Order {
    id: number;
    status: string;
    placed_at: string | null;
    shipping_address: ShippingAddress | null;
    items: OrderItem[];
    can_accept: boolean;
    can_mark_delivered: boolean;
}

interface Props {
    order: Order;
}

export default function Show({ order }: Props) {
    return (
        <ShipperLayout>
            <Head title={`Đơn #${order.id}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Đơn #{order.id}</h1>
                        <p className="text-sm text-gray-600">Trạng thái: {order.status}</p>
                    </div>
                    <div className="flex gap-2">
                        {order.can_accept && (
                            <button
                                type="button"
                                onClick={() => router.post(`/shipper/orders/${order.id}/accept`)}
                                className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                            >
                                Nhận đơn
                            </button>
                        )}
                        {order.can_mark_delivered && (
                            <button
                                type="button"
                                onClick={() => router.post(`/shipper/orders/${order.id}/mark-delivered`)}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                            >
                                Đã giao
                            </button>
                        )}
                    </div>
                </div>

                {order.shipping_address && (
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-700">Thông tin giao hàng</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {order.shipping_address.recipient_name} • {order.shipping_address.phone}
                        </p>
                        <p className="text-sm text-gray-600">{order.shipping_address.full_address}</p>
                    </div>
                )}

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Sản phẩm</th>
                                <th className="px-4 py-3 text-center font-medium text-gray-600">Số lượng</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">Đơn giá</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        <div className="font-medium">{item.product_name ?? 'Sản phẩm'}</div>
                                        {item.variant_name && (
                                            <div className="text-xs text-gray-500">{item.variant_name}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-gray-700">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(item.price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ShipperLayout>
    );
}