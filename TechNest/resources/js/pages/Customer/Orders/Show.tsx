import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Package, MapPin, CreditCard, Tag } from 'lucide-react';

export default function OrderShow({ order }: any) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (iso?: string) =>
        iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : '-';

    const translatePaymentStatus = (status?: string) => {
        if (!status) return '-';
        const s = String(status).toLowerCase();
        const map: Record<string, string> = {
            'succeeded': 'Đã thanh toán',
            'succeed': 'Đã thanh toán',
            'pending': 'Đang chờ',
            'failed': 'Thất bại',
            'cancelled': 'Đã hủy',
            'canceled': 'Đã hủy',
        };
        return map[s] || status;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Đơn hàng', href: '/orders' },
                { title: `Đơn hàng #${order.id}`, href: '#' },
            ]}
        >
            <Head title={`Đơn hàng #${order.id}`} />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg border border-slate-200 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/orders" className="inline-flex items-center text-slate-600 hover:text-slate-800">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Link>
                            <h1 className="text-xl font-semibold">Đơn hàng #{order.id}</h1>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-500">Ngày đặt</div>
                            <div className="font-medium">{formatDate(order.placed_at)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Địa chỉ giao hàng
                                </h3>
                                <p className="font-medium">{order.shipping_address.recipient_name}</p>
                                <p className="text-slate-600">{order.shipping_address.phone}</p>
                                <p className="text-slate-600 mt-2">{order.shipping_address.full_address}</p>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Sản phẩm
                                </h3>
                                <div className="space-y-4">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                                            <img
                                                src={item.image || item.variant?.image || item.product.image || '/placeholder.png'}
                                                alt={item.product.name}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium">{item.product.name}</h4>
                                                {item.variant && (
                                                    <p className="text-sm text-slate-500">Phân loại: {item.variant.name}</p>
                                                )}
                                                <p className="text-sm text-slate-500">Số lượng: {item.quantity}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(item.price)}</p>
                                                <p className="text-sm text-slate-500">Tổng: {formatCurrency(item.subtotal)}</p>
                                                {order.status === 'delivered' && (
                                                    <div className="mt-2">
                                                        <Link
                                                            href={`/products/${item.product.id}?openReview=1`}
                                                            className="inline-block px-3 py-1 bg-green-600 text-white rounded text-sm"
                                                        >
                                                            Viết đánh giá
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            {/* Payment Info */}
                            <div className="bg-white border rounded-lg p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2 flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Thông tin thanh toán
                                        </h3>
                                        <div className="text-sm text-slate-600">
                                            <div className="flex justify-between">
                                                <span>Phương thức:</span>
                                                <span className="font-medium">{order.payment.method}</span>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span>Trạng thái:</span>
                                                <span className="font-medium">{translatePaymentStatus(order.payment.status)}</span>
                                            </div>
                                            {order.payment.paid_at && (
                                                <div className="flex justify-between mt-1">
                                                    <span>Đã thanh toán:</span>
                                                    <span className="font-medium">{formatDate(order.payment.paid_at)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="font-semibold text-lg mb-4 flex items-center">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Tổng đơn hàng
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {order.promotion && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="flex items-center">
                                                Khuyến mãi ({order.promotion.code})
                                            </span>
                                            <span>-{formatCurrency(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-semibold pt-2 border-t">
                                        <span>Tổng cộng:</span>
                                        <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    {order.status === 'in_delivery' && (
                                        <Link
                                            href={`/tracking/${order.id}`}
                                            className="inline-flex items-center px-4 py-2 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                        >
                                            Theo dõi
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}