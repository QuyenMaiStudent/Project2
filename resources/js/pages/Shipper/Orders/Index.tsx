import { Head, Link, router } from '@inertiajs/react';
import ShipperLayout from '@/layouts/shipper-layout';

const PRIMARY = '#0AC1EF';
const SECONDARY_LIGHT = 'rgba(10,193,239,0.04)';

interface OrderSummary {
    id: number;
    status: string;
    placed_at: string | null;
    shipping_address: string | null;
    is_assigned_to_me: boolean;
    can_accept: boolean;
    can_mark_delivered: boolean;
    thumbnail?: string | null;
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

export default function Index({ orders }: Props) {
    return (
        <ShipperLayout>
            <Head title="Đơn giao hàng" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Đơn đang chờ giao</h1>
                    <p className="text-sm text-gray-600">Nhận đơn và cập nhật trạng thái giao hàng.</p>
                </div>

                {/* vùng bọc với nền nhạt để tách bảng khỏi background */}
                <div className="rounded-lg p-4" style={{ backgroundColor: SECONDARY_LIGHT }}>
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Mã đơn</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Ngày đặt</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Địa chỉ giao</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                            Chưa có đơn nào.
                                        </td>
                                    </tr>
                                )}

                                {orders.data.map((order, idx) => (
                                    <tr key={order.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : SECONDARY_LIGHT }}>
                                        <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                                            {order.thumbnail ? (
                                                <img
                                                    src={order.thumbnail}
                                                    className="h-10 w-10 rounded object-cover"
                                                    alt={`#${order.id}`}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded bg-gray-100" />
                                            )}
                                            <span>#{order.id}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{order.placed_at ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-700">{order.shipping_address ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/shipper/orders/${order.id}`}
                                                    className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition"
                                                    style={{ color: PRIMARY, borderColor: 'rgba(10,193,239,0.2)' }}
                                                >
                                                    Chi tiết
                                                </Link>
                                                {order.can_accept && (
                                                    <button
                                                        type="button"
                                                        onClick={() => router.post(`/shipper/orders/${order.id}/accept`)}
                                                        className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition"
                                                        style={{ backgroundColor: PRIMARY }}
                                                    >
                                                        Nhận đơn
                                                    </button>
                                                )}
                                                {order.can_mark_delivered && (
                                                    <button
                                                        type="button"
                                                        onClick={() => router.post(`/shipper/orders/${order.id}/mark-delivered`)}
                                                        className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-white transition"
                                                        style={{ backgroundColor: PRIMARY }}
                                                    >
                                                        Đã giao
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ShipperLayout>
    );
}