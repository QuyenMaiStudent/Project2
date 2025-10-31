import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, Eye } from 'lucide-react';

interface Order {
    id: number;
    status: string;
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
            shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đang giao' },
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

    const getPaymentStatusBadge = (paymentStatus: string) => {
        const config: Record<string, { bg: string; text: string; label: string }> = {
            paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã thanh toán' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ thanh toán' },
            failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Thất bại' },
            refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Đã hoàn tiền' },
        };

        const c = config[paymentStatus] || { bg: 'bg-gray-100', text: 'text-gray-800', label: paymentStatus };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
                {c.label}
            </span>
        );
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang chủ', href: '/' },
                { title: 'Đơn hàng của tôi', href: '/orders' },
            ]}
        >
            <Head title="Đơn hàng của tôi" />

            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 flex items-center">
                    <Package className="mr-3 h-8 w-8" />
                    Đơn hàng của tôi
                </h1>

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
                                            Thanh toán
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getPaymentStatusBadge(order.payment_status)}
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
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Chi tiết
                                                </Link>
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