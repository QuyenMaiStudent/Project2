import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import React from 'react';

interface OrderItem {
    id: number;
    product_name?: string | null;
    product_image?: string | null;
    variant_name?: string | null;
    quantity: number;
    price: number;
    subtotal: number;
}

interface ShippingAddress {
    recipient_name: string;
    phone: string;
    full_address: string;
}

interface Promotion {
    code: string;
    type: string;
    value: number;
}

interface OrderDetail {
    id: number;
    status: string;
    payment_status: string;
    placed_at: string | null;
    subtotal: number;
    items: OrderItem[];
    shipping_address: ShippingAddress | null;
    promotion: Promotion | null;
    can_fulfill: boolean;
}

interface Props {
    order: OrderDetail;
}

const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function Show({ order }: Props) {
    const { flash } = usePage().props as any;

    const statusMap: Record<string, string> = {
        pending: 'Chờ xử lý',
        processing: 'Đang xử lý',
        paid: 'Đã thanh toán',
        ready_to_ship: 'Sẵn sàng giao',
        shipped: 'Đang giao',
        completed: 'Hoàn thành',
        cancelled: 'Đã huỷ',
        refunded: 'Đã hoàn tiền',
        placed: 'Đã đặt',
        delivered: 'Đã giao',
    };

    const paymentStatusMap: Record<string, string> = {
        pending: 'Chưa thanh toán',
        paid: 'Đã thanh toán',
        refunded: 'Đã hoàn tiền',
        failed: 'Thất bại',
        succeeded: 'Thành công',
    };

    const translateStatus = (s?: string | null) => (s ? statusMap[s] ?? s : '—');
    const translatePayment = (s?: string | null) => (s ? paymentStatusMap[s] ?? s : '—');

    const fallbackBreadcrumbs = [
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Đơn hàng', href: '/seller/orders' },
        { title: `#${order.id}`, href: `/seller/orders/${order.id}` },
    ];

    return (
        <AppLayout breadcrumbs={fallbackBreadcrumbs}>
            <Head title={`Đơn hàng #${order.id}`} />

            <div className="p-8 md:p-10 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Flash */}
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 border border-green-100 p-4 text-base md:text-lg text-green-800">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-md bg-rose-50 border border-rose-100 p-4 text-base md:text-lg text-rose-800">
                            {flash.error}
                        </div>
                    )}

                    <header className="mb-6 bg-white p-6 md:p-8 rounded-lg shadow-lg border-l-4 border-[#0AC1EF] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">Đơn hàng #{order.id}</h1>
                            <p className="text-base md:text-lg text-gray-600 mt-2">Ngày đặt: <span className="font-medium">{order.placed_at ?? '—'}</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/seller/orders"
                                className="inline-flex items-center rounded-md border border-gray-200 px-4 md:px-5 py-2 md:py-3 text-base md:text-lg font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Quay lại
                            </Link>
                            {order.can_fulfill && (
                                <button
                                    type="button"
                                    onClick={() => router.post(`/seller/orders/${order.id}/request-shipment`)}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-5 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-medium text-white hover:bg-indigo-500"
                                >
                                    Lên đơn
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Sản phẩm</h2>
                            <div className="mt-6 space-y-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-6 items-start">
                                        {item.product_image ? (
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name ?? ''}
                                                className="h-24 w-24 md:h-28 md:w-28 rounded border object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded border bg-gray-50 text-sm md:text-base text-gray-400">
                                                No image
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <p className="font-semibold text-lg md:text-xl text-gray-900">
                                                    {item.product_name ?? 'Sản phẩm đã xoá'}
                                                </p>
                                                {item.variant_name && (
                                                    <p className="text-base md:text-lg text-gray-600 mt-1">Phân loại: {item.variant_name}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-base md:text-lg text-gray-700 mt-3">
                                                <span>Số lượng: <span className="font-medium">{item.quantity}</span></span>
                                                <span>Đơn giá: <span className="font-medium">{formatMoney(item.price)}</span></span>
                                                <span className="font-semibold text-gray-900">Tổng: {formatMoney(item.subtotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Thông tin đơn</h2>
                                <dl className="mt-4 space-y-3 text-base md:text-lg text-gray-700">
                                    <div className="flex justify-between">
                                        <dt className="font-medium">Trạng thái đơn</dt>
                                        <dd className="ml-4">{translateStatus(order.status)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">Thanh toán</dt>
                                        <dd className="ml-4">{translatePayment(order.payment_status)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium">Doanh thu của bạn</dt>
                                        <dd className="ml-4 font-semibold text-gray-900">{formatMoney(order.subtotal)}</dd>
                                    </div>
                                    {order.promotion && (
                                        <div className="flex justify-between text-base text-gray-600">
                                            <dt className="font-medium">Khuyến mãi</dt>
                                            <dd className="ml-4">{order.promotion.code}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 shadow-sm">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                                {order.shipping_address ? (
                                    <div className="mt-4 space-y-2 text-base md:text-lg text-gray-700">
                                        <p className="font-semibold text-lg md:text-xl">{order.shipping_address.recipient_name}</p>
                                        <p className="text-base">SĐT: <span className="font-medium">{order.shipping_address.phone}</span></p>
                                        <p className="text-base">{order.shipping_address.full_address}</p>
                                    </div>
                                ) : (
                                    <p className="mt-4 text-base md:text-lg text-gray-500">Không có thông tin địa chỉ.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}