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

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Đơn hàng', href: '/orders' },
                { title: `Đơn hàng #${order.id}`, href: '#' },
            ]}
        >
            <Head title={`Đơn hàng #${order.id}`} />

            <div className="max-w-5xl mx-auto p-6">
                <Link
                    href="/orders"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại danh sách
                </Link>

                <h1 className="text-3xl font-bold mb-6">Đơn hàng #{order.id}</h1>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2" />
                            Địa chỉ giao hàng
                        </h3>
                        <p className="font-medium">{order.shipping_address.recipient_name}</p>
                        <p className="text-gray-600">{order.shipping_address.phone}</p>
                        <p className="text-gray-600 mt-2">{order.shipping_address.full_address}</p>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Thông tin thanh toán
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phương thức:</span>
                                <span className="font-medium">{order.payment.method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Trạng thái:</span>
                                <span className="font-medium capitalize">{order.payment.status}</span>
                            </div>
                            {order.payment.paid_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Đã thanh toán:</span>
                                    <span className="font-medium">{order.payment.paid_at}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Sản phẩm
                    </h3>
                    <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                                <img
                                    src={item.variant?.image || item.product.image || '/placeholder.png'}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{item.product.name}</h4>
                                    {item.variant && (
                                        <p className="text-sm text-gray-600">Phân loại: {item.variant.name}</p>
                                    )}
                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{formatCurrency(item.price)}</p>
                                    <p className="text-sm text-gray-600">
                                        Tổng: {formatCurrency(item.subtotal)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Tổng đơn hàng</h3>
                    <div className="space-y-2">
                        {order.promotion && (
                            <div className="flex justify-between text-green-600">
                                <span className="flex items-center">
                                    <Tag className="h-4 w-4 mr-2" />
                                    Khuyến mãi ({order.promotion.code}):
                                </span>
                                <span>-{formatCurrency(order.discount_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold pt-2 border-t">
                            <span>Tổng cộng:</span>
                            <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}