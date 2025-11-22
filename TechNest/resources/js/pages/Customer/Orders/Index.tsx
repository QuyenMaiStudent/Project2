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

            <div className="max-w-7xl mx-auto p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold flex items-center">
                        <Package className="mr-3 h-8 w-8" />
                        Đơn hàng của tôi
                    </h1>
                    <Link
                        href="/tracking"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Truck className="h-4 w-4" />
                        Theo dõi vận chuyển
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <p className="text-xl text-gray-500">Bạn chưa có đơn hàng nào</p>
                        <Link
                            href="/"
                            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Đơn hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày đặt
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Số lượng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tổng tiền
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    #{order.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.placed_at}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.items_count} sản phẩm
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-green-600">
                                                    {formatCurrency(order.total_amount)}
                                                </div>
                                                {order.discount_amount > 0 && (
                                                    <div className="text-xs text-gray-500">
                                                        Giảm {formatCurrency(order.discount_amount)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Chi tiết
                                                    </Link>
                                                    {canTrack(order.status) && (
                                                        <Link
                                                            href={`/tracking/${order.id}`}
                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
        </AppLayout>
    );
}