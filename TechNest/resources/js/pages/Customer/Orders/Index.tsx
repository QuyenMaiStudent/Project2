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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${c.bg} ${c.text}`}>
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

            <div className="max-w-6xl mx-auto p-6">
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
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">Đơn hàng #{order.id}</h3>
                                        <p className="text-sm text-gray-500">{order.placed_at}</p>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Số lượng:</span>
                                        <span className="ml-2 font-medium">{order.items_count} sản phẩm</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Thanh toán:</span>
                                        <span className="ml-2 font-medium capitalize">{order.payment_status}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div>
                                        <span className="text-lg font-bold text-green-600">
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                        {order.discount_amount > 0 && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                (Giảm {formatCurrency(order.discount_amount)})
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}