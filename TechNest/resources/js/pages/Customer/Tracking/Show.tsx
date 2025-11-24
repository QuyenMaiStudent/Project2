import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import OrderTracking from '@/components/OrderTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MapPin, User, ArrowLeft, Truck, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    variant_name?: string;
    quantity: number;
    price?: number;
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

const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    const m = iso.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
    if (m) {
        const [, day, month, year, hour, minute] = m;
        const parsed = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
        if (!isNaN(parsed.getTime())) return parsed.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    }
    return iso;
};

const formatCurrency = (amount?: number) => {
    if (amount == null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
};

const statusBadgeClass = (status: string) => {
    switch (status) {
        case 'ready_to_ship':
            return 'bg-yellow-50 text-yellow-800';
        case 'in_delivery':
            return 'bg-blue-50 text-blue-800';
        case 'delivered_awaiting_confirmation':
            return 'bg-purple-50 text-purple-800';
        case 'delivered':
            return 'bg-emerald-50 text-emerald-800';
        default:
            return 'bg-slate-50 text-slate-800';
    }
};

export default function Show({ order }: { order: Order }) {
    const handleConfirmDelivery = () => {
        if (confirm('Bạn xác nhận đã nhận được hàng?')) {
            router.post(`/customer/orders/${order.id}/confirm-received`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Theo dõi đơn hàng', href: '/tracking' },
                { title: `Đơn hàng #${order.id}`, href: `/tracking/${order.id}` },
            ]}
        >
            <Head title={`Theo dõi đơn hàng #${order.id}`} />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/tracking" className="inline-flex items-center text-slate-600 hover:text-slate-800">
                                <ArrowLeft className="h-5 w-5 mr-2" /> Quay lại
                            </Link>
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900">Theo dõi đơn hàng #{order.id}</h1>
                                <p className="text-sm text-slate-500">Đặt lúc: {formatDate(order.placed_at)}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-slate-500">Trạng thái hiện tại</div>
                            <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full ${statusBadgeClass(order.status)} text-sm font-semibold`}>
                                {order.status_label}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status + actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tiến trình & Thao tác</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                                        <div className="flex-1">
                                            <OrderTracking steps={order.tracking} currentStatus={order.status} />
                                        </div>

                                        <div className="mt-4 md:mt-0 w-full md:w-48 flex-shrink-0">
                                            <div className="bg-slate-50 p-3 rounded-lg border">
                                                <div className="text-xs text-slate-500">Mốc thời gian</div>
                                                <div className="mt-2 text-sm text-slate-700 flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-slate-400" />
                                                    <span>{order.placed_at ? formatDate(order.placed_at) : '-'}</span>
                                                </div>

                                                {order.shipped_at && (
                                                    <div className="mt-2 text-sm text-slate-700 flex items-center gap-2">
                                                        <Truck className="h-4 w-4 text-slate-400" />
                                                        <span>{formatDate(order.shipped_at)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {order.can_confirm_delivery && (
                                                <div className="mt-4">
                                                    <div className="rounded-lg bg-green-50 p-3 text-sm text-slate-700 mb-3">
                                                        Đơn đã được giao. Vui lòng xác nhận nếu bạn đã nhận hàng.
                                                    </div>
                                                    <Button onClick={handleConfirmDelivery} className="w-full">
                                                        Xác nhận đã nhận hàng
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Products list */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Sản phẩm ({order.items.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 py-6 items-start">
                                                <div className="flex-shrink-0">
                                                    <img src={item.product_image} alt={item.product_name} className="h-28 w-28 rounded-lg object-cover border" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="truncate">
                                                            <h3 className="font-medium text-lg truncate">{item.product_name}</h3>
                                                            {item.variant_name && <p className="text-sm text-slate-500 truncate mt-1">{item.variant_name}</p>}
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="font-semibold">{formatCurrency(item.price)}</div>
                                                            <div className="text-sm text-slate-500 mt-1">Số lượng: {item.quantity}</div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 text-sm text-slate-500 flex items-center gap-3">
                                                        <Link href={`/products/${item.id}`} className="text-sm text-slate-500 hover:underline">Xem sản phẩm</Link>
                                                        <span className="text-xs bg-slate-50 px-2 py-1 rounded">Hỗ trợ đổi trả</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Aside */}
                        <aside className="space-y-6">
                            {order.shipping_address && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" /> Địa chỉ giao hàng
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3 text-sm">
                                            <div className="font-medium">{order.shipping_address.recipient_name}</div>
                                            <div className="text-slate-600">{order.shipping_address.phone}</div>
                                            <div className="text-slate-700">{order.shipping_address.full_address}</div>
                                            <div className="mt-3">
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shipping_address.full_address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-sm hover:underline"
                                                >
                                                    Xem trên Google Maps
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {order.shipper && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-4 w-4" /> Thông tin shipper
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="font-medium">{order.shipper.name}</div>
                                            <a href={`tel:${order.shipper.phone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                                                <Phone className="h-4 w-4" /> {order.shipper.phone}
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Hỗ trợ & Ghi chú</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-slate-600 space-y-2">
                                        <div>• Kiểm tra hàng trước khi ký nhận.</div>
                                        <div>• Liên hệ support nếu cần hỗ trợ: <a href="mailto:support@technest.com" className="text-blue-600">support@technest.com</a></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}