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

            {/* CHANGED: tăng padding trang, dùng max-w lớn hơn */}
            <div className="p-8 md:p-10 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-lg border border-slate-200 px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/orders" className="inline-flex items-center text-slate-600 hover:text-slate-800">
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                <span className="text-sm md:text-base">Quay lại</span>
                            </Link>
                            <h1 className="text-2xl md:text-3xl font-semibold">Đơn hàng #{order.id}</h1>
                        </div>
                        <div className="text-right">
                            <div className="text-sm md:text-base text-slate-500">Ngày đặt</div>
                            <div className="font-medium text-base md:text-lg">{formatDate(order.placed_at)}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white border rounded-lg p-6 md:p-8">
                                <h3 className="font-semibold text-lg md:text-xl mb-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Địa chỉ giao hàng
                                </h3>
                                <p className="font-semibold text-base md:text-lg">{order.shipping_address.recipient_name}</p>
                                <p className="text-sm md:text-base text-slate-600 mt-1">{order.shipping_address.phone}</p>
                                <p className="text-sm md:text-base text-slate-700 mt-3">{order.shipping_address.full_address}</p>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white border rounded-lg p-6 md:p-8">
                                <h3 className="font-semibold text-lg md:text-xl mb-4 flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Sản phẩm
                                </h3>
                                <div className="space-y-6">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-6 pb-4 border-b last:border-b-0 md:items-start">
                                            <img
                                                src={item.image || item.variant?.image || item.product.image || '/placeholder.png'}
                                                alt={item.product.name}
                                                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-lg md:text-xl">{item.product.name}</h4>
                                                {item.variant && (
                                                    <p className="text-sm md:text-base text-slate-500">Phân loại: {item.variant.name}</p>
                                                )}
                                                <p className="text-sm md:text-base text-slate-500 mt-2">Số lượng: {item.quantity}</p>
                                            </div>

                                            <div className="text-right md:text-right mt-2 md:mt-0">
                                                <p className="font-semibold text-base md:text-lg">{formatCurrency(item.price)}</p>
                                                <p className="text-sm md:text-base text-slate-500">Tổng: {formatCurrency(item.subtotal)}</p>
                                                {order.status === 'delivered' && (
                                                    <div className="mt-3">
                                                        <Link
                                                            href={`/products/${item.product.id}?openReview=1`}
                                                            className="inline-block px-4 py-2 bg-green-600 text-white rounded text-sm md:text-base"
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
                            <div className="bg-white border rounded-lg p-6 md:p-8">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-lg md:text-xl mb-2 flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Thông tin thanh toán
                                        </h3>
                                        <div className="text-sm md:text-base text-slate-600 space-y-2">
                                            <div className="flex justify-between">
                                                <span>Phương thức:</span>
                                                <span className="font-medium">{order.payment.method}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Trạng thái:</span>
                                                <span className="font-medium">{translatePaymentStatus(order.payment.status)}</span>
                                            </div>
                                            {order.payment.paid_at && (
                                                <div className="flex justify-between">
                                                    <span>Đã thanh toán:</span>
                                                    <span className="font-medium">{formatDate(order.payment.paid_at)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white border rounded-lg p-6 md:p-8">
                                <h3 className="font-semibold text-lg md:text-xl mb-4 flex items-center">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Tổng đơn hàng
                                </h3>
                                <div className="space-y-3 text-sm md:text-base">
                                    {order.promotion && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="flex items-center">Khuyến mãi ({order.promotion.code})</span>
                                            <span>-{formatCurrency(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base md:text-lg font-semibold pt-3 border-t">
                                        <span>Tổng cộng:</span>
                                        <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    {order.status === 'in_delivery' && (
                                        <Link
                                            href={`/tracking/${order.id}`}
                                            className="inline-flex items-center px-4 py-2 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm md:text-base"
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