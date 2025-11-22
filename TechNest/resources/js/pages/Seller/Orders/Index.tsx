import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

interface OrderSummary {
    id: number;
    status: string;
    payment_status: string;
    placed_at: string | null;
    items_count: number;
    subtotal: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: OrderSummary[];
    links?: PaginationLink[];
}

interface Props {
    orders: PaginatedOrders;
}

const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function Index({ orders }: Props) {
    return (
        <AppLayout>
            <Head title="Đơn hàng của tôi" />

            <div className="mx-auto max-w-5xl space-y-6 py-6">
                <div>
                    <h1 className="text-2xl font-semibold">Đơn hàng có sản phẩm của bạn</h1>
                    <p className="text-sm text-gray-600">
                        Theo dõi những đơn hàng chứa sản phẩm của cửa hàng để xử lý kịp thời.
                    </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Mã đơn</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Ngày đặt</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Số sản phẩm</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Doanh thu của bạn</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Trạng thái</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Thanh toán</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-600">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                        Chưa có đơn hàng nào.
                                    </td>
                                </tr>
                            )}

                            {orders.data.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 py-3 font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-4 py-3 text-gray-700">{order.placed_at ?? '—'}</td>
                                    <td className="px-4 py-3 text-gray-700">{order.items_count}</td>
                                    <td className="px-4 py-3 text-gray-900">{formatMoney(order.subtotal)}</td>
                                    <td className="px-4 py-3 text-gray-700 capitalize">{order.status}</td>
                                    <td className="px-4 py-3 text-gray-700 capitalize">{order.payment_status}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/seller/orders/${order.id}`}
                                                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
                                            >
                                                Xem chi tiết
                                            </Link>
                                            {['paid', 'ready_to_ship'].includes(order.status) && (
                                                <button
                                                    type="button"
                                                    onClick={() => router.post(`/seller/orders/${order.id}/request-shipment`)}
                                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                                                >
                                                    Lên đơn
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.links && orders.links.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {orders.links.map((link) => (
                            <Link
                                key={`${link.label}-${link.url ?? 'null'}`}
                                href={link.url ?? '#'}
                                preserveScroll
                                className={`rounded border px-3 py-1 text-sm ${
                                    link.active
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900'
                                } ${link.url === null ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}