import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import React from 'react';

interface OrderSummary {
    id: number;
    status: string;
    payment_status: string;
    placed_at: string | null;
    items_count: number;
    subtotal: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: OrderSummary[];
    links?: PaginationLink[];
}

interface Props {
    orders: PaginatedOrders;
}

const formatMoney = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function Index({ orders }: Props) {
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

    const translateStatus = (s: string) => statusMap[s] ?? s;
    const translatePayment = (s: string) => paymentStatusMap[s] ?? s;

    const fallbackBreadcrumbs = [
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Đơn hàng', href: '/seller/orders' },
    ];

    return (
        <AppLayout breadcrumbs={fallbackBreadcrumbs}>
            <Head title="Đơn hàng của tôi" />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-6">
                    <header className="mb-4 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Đơn hàng có sản phẩm của bạn</h1>
                                <p className="text-sm text-gray-600">Theo dõi và xử lý các đơn hàng chứa sản phẩm cửa hàng.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/seller/orders"
                                    className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Làm mới
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Flash */}
                    {flash?.success && (
                        <div className="rounded-md bg-green-50 border border-green-100 p-3 text-sm text-green-800">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-md bg-rose-50 border border-rose-100 p-3 text-sm text-rose-800">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider">Mã đơn</th>
                                    <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider">Ngày đặt</th>
                                    <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider">Sản phẩm</th>
                                    <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider">Doanh thu của bạn</th>
                                    <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider">Trạng thái</th>
                                    <th className="py-3 px-4 text-left font-semibold uppercase tracking-wider">Thanh toán</th>
                                    <th className="py-3 px-4 text-center font-semibold uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h18v4H3zM5 11h14v10H5z" />
                                                </svg>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có đơn hàng nào.</h3>
                                                <p className="text-gray-500">Khi có đơn chứa sản phẩm của bạn, sẽ hiển thị tại đây.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-gray-900">#{order.id}</td>
                                            <td className="py-3 px-4 text-gray-700">{order.placed_at ?? '—'}</td>
                                            <td className="py-3 px-4 text-gray-700">{order.items_count}</td>
                                            <td className="py-3 px-4 text-gray-900">{formatMoney(order.subtotal)}</td>
                                            <td className="py-3 px-4 text-gray-700">{translateStatus(order.status)}</td>
                                            <td className="py-3 px-4 text-gray-700">{translatePayment(order.payment_status)}</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/seller/orders/${order.id}`}
                                                        className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Xem
                                                    </Link>
                                                    {['paid', 'ready_to_ship'].includes(order.status) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => router.post(`/seller/orders/${order.id}/request-shipment`)}
                                                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
                                                        >
                                                            Lên đơn
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.links && orders.links.length > 1 && (
                        <div className="mt-4 flex justify-center gap-1 p-4 bg-white rounded-lg shadow-sm">
                            {orders.links.map((l, idx) =>
                                l.url ? (
                                    <Link
                                        key={idx}
                                        href={l.url}
                                        className={`px-3 py-1 rounded transition-all duration-200 ${
                                            l.active ? 'bg-[#0AC1EF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: l.label }}
                                    />
                                ) : (
                                    <span key={idx} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: l.label }} />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}