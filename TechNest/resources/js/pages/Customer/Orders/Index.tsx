import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, Eye, Truck } from 'lucide-react';

interface Order {
    id: number;
    status: string;
    status_label: string;
    total_amount: number;
    discount_amount: number;
    placed_at: string;
    items_count: number;
    payment_status: string;
}

export default function OrdersIndex({ orders }: { orders: Order[] }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : '-';

    const getStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; text: string; label: string }> = {
            placed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã đặt' },
            paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã thanh toán' },
            processing: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang xử lý' },
            ready_to_ship: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Sẵn sàng giao' },
            in_delivery: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đang giao' },
            delivered_awaiting_confirmation: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Chờ xác nhận' },
            delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã giao' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy' },
        };

        const c = config[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                {c.label}
            </span>
        );
    };

    const canTrack = (status: string) => {
        return ['ready_to_ship', 'in_delivery', 'delivered_awaiting_confirmation'].includes(status);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Đơn hàng của tôi', href: '/orders' },
            ]}
        >
            <Head title="Đơn hàng của tôi" />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg border border-slate-200 px-6 py-5 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-800 flex items-center">
                                <Package className="mr-3 h-6 w-6 text-slate-600" />
                                Đơn hàng của tôi
                            </h1>
                            <p className="text-sm text-slate-500">Xem lịch sử và trạng thái các đơn hàng của bạn</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/tracking"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0AC1EF] text-white rounded-lg hover:bg-[#09b3db]"
                            >
                                <Truck className="h-4 w-4" />
                                Theo dõi vận chuyển
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50"
                            >
                                Mua sắm
                            </Link>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-xl text-gray-600 mb-2">Bạn chưa có đơn hàng nào</p>
                            <p className="text-sm text-slate-500 mb-4">Bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn.</p>
                            <Link
                                href="/"
                                className="inline-block mt-2 bg-[#0AC1EF] text-white px-6 py-2 rounded-lg hover:bg-[#09b3db]"
                            >
                                Mua sắm ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-medium text-slate-800">Tất cả đơn hàng</h2>
                                <p className="text-sm text-slate-500">{orders.length} đơn</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Đơn hàng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày đặt</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-100">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-slate-900">#{order.id}</div>
                                                    <div className="text-xs text-slate-500">Thanh toán: {order.payment_status}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(order.placed_at)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{order.items_count} sp</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-green-600">{formatCurrency(order.total_amount)}</div>
                                                    {order.discount_amount > 0 && (
                                                        <div className="text-xs text-slate-500">Giảm {formatCurrency(order.discount_amount)}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#0AC1EF] hover:bg-[#09b3db]"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Chi tiết
                                                        </Link>
                                                        {canTrack(order.status) && (
                                                            <Link
                                                                href={`/tracking/${order.id}`}
                                                                className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                                                            >
                                                                <Truck className="h-4 w-4 mr-1" />
                                                                Theo dõi
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}