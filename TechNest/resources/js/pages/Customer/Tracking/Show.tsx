import React from 'react';
import { Head, router } from '@inertiajs/react';
import OrderTracking from '@/components/OrderTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, User } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    variant_name?: string;
    quantity: number;
}

interface ShippingAddress {
    recipient_name: string;
    phone: string;
    full_address: string;
}

interface Shipper {
    name: string;
    phone: string;
}

interface TrackingStep {
    status: string;
    label: string;
    completed: boolean;
    timestamp?: string;
}

interface Order {
    id: number;
    status: string;
    status_label: string;
    placed_at: string;
    shipped_at?: string;
    delivered_at?: string;
    items: OrderItem[];
    shipping_address: ShippingAddress | null;
    shipper: Shipper | null;
    tracking: TrackingStep[];
    can_confirm_delivery: boolean;
}

export default function Show({ order }: { order: Order }) {
    const handleConfirmDelivery = () => {
        if (confirm('Bạn xác nhận đã nhận được hàng?')) {
            router.post(`/customer/orders/${order.id}/confirm-received`);
        }
    };

    return (
        <AppLayout>
            <Head title={`Theo dõi đơn hàng #${order.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Theo dõi đơn hàng #{order.id}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Đặt lúc: {order.placed_at}
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Tracking Timeline */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trạng thái đơn hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <OrderTracking 
                                        steps={order.tracking} 
                                        currentStatus={order.status}
                                    />
                                    
                                    {order.can_confirm_delivery && (
                                        <div className="mt-6 rounded-lg bg-blue-50 p-4">
                                            <p className="mb-3 text-sm text-gray-700">
                                                Đơn hàng đã được giao đến. Vui lòng kiểm tra và xác nhận đã nhận hàng.
                                            </p>
                                            <Button 
                                                onClick={handleConfirmDelivery}
                                                className="w-full"
                                            >
                                                Xác nhận đã nhận hàng
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Sản phẩm ({order.items.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 py-4">
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="h-20 w-20 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-medium">{item.product_name}</h3>
                                                    {item.variant_name && (
                                                        <p className="text-sm text-gray-600">
                                                            {item.variant_name}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Số lượng: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Info */}
                        <div>
                            {/* Shipping Address */}
                            {order.shipping_address && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Địa chỉ giao hàng
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <User className="mt-0.5 h-4 w-4 text-gray-400" />
                                                <p className="font-medium">
                                                    {order.shipping_address.recipient_name}
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-600">
                                                    {order.shipping_address.phone}
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                                <p className="text-sm text-gray-600">
                                                    {order.shipping_address.full_address}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Shipper Info */}
                            {order.shipper && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Thông tin shipper
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <p className="font-medium">{order.shipper.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <a 
                                                    href={`tel:${order.shipper.phone}`}
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {order.shipper.phone}
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}