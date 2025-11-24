import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Truck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Order {
    id: number;
    status: string;
    status_label: string;
    placed_at: string;
    items_count: number;
    first_product_image?: string;
    shipper_name?: string;
}

interface Props {
    orders: {
        data: Order[];
        links?: { url: string | null; label: string; active?: boolean }[];
        meta?: { current_page?: number; last_page?: number };
    };
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'ready_to_ship':
            return 'bg-yellow-100 text-yellow-800';
        case 'in_delivery':
            return 'bg-blue-100 text-blue-800';
        case 'delivered_awaiting_confirmation':
            return 'bg-purple-100 text-purple-800';
        case 'delivered':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const formatDate = (iso?: string) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (!isNaN(d.getTime())) {
        return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    }
    const m = iso.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
    if (m) {
        const [, day, month, year, hour, minute] = m;
        const parsed = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
        if (!isNaN(parsed.getTime())) return parsed.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
    }
    return iso;
};

export default function Index({ orders }: Props) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Theo dõi đơn hàng', href: '/tracking' },
            ]}
        >
            <Head title="Theo dõi đơn hàng" />

            {/* match Show page background + spacing */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header card similar to Show */}
                    <div className="mb-6 bg-white rounded-lg p-6 shadow-sm border-l-4 border-[#0AC1EF] flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Theo dõi đơn hàng</h1>
                            <p className="mt-1 text-sm text-slate-600">Kiểm tra trạng thái giao hàng và thông tin đơn hàng nhanh chóng.</p>
                        </div>
                    </div>

                    {orders.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4 text-sm text-gray-600">Bạn chưa có đơn hàng nào đang giao</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Link key={order.id} href={`/tracking/${order.id}`} className="block">
                                    <Card className="transition-shadow hover:shadow-lg">
                                        <CardContent className="p-4 md:p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    {order.first_product_image ? (
                                                        <img
                                                            src={order.first_product_image}
                                                            alt={`Order ${order.id}`}
                                                            className="h-24 w-24 rounded-lg object-cover border"
                                                        />
                                                    ) : (
                                                        <div className="h-24 w-24 rounded-lg bg-slate-50 flex items-center justify-center border">
                                                            <Package className="h-6 w-6 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="truncate">
                                                            <h3 className="text-lg font-medium text-slate-900 truncate">Đơn hàng #{order.id}</h3>
                                                            <p className="mt-1 text-sm text-slate-500 truncate">{order.items_count} sản phẩm</p>
                                                        </div>

                                                        <div className="text-right">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                                {order.status_label}
                                                            </span>
                                                            <div className="mt-1 text-xs text-slate-400">{formatDate(order.placed_at)}</div>
                                                        </div>
                                                    </div>

                                                    {order.shipper_name && (
                                                        <div className="mt-3 flex items-center text-sm text-slate-600 gap-2">
                                                            <Truck className="h-4 w-4 text-slate-400" />
                                                            <span className="truncate">Shipper: {order.shipper_name}</span>
                                                        </div>
                                                    )}

                                                    {/* quick actions / info row */}
                                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-2 py-1 bg-slate-50 rounded text-xs">Xem chi tiết</span>
                                                            <span className="px-2 py-1 bg-slate-50 rounded text-xs">Liên hệ hỗ trợ</span>
                                                        </div>
                                                        <div className="text-xs text-slate-400">Nhấn để xem chi tiết đơn</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}

                            {/* pagination */}
                            {orders.links && (
                                <nav className="flex items-center justify-center gap-2 mt-4" aria-label="Pagination">
                                    {orders.links.map((link: any, idx: number) =>
                                        link.url ? (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                className={`px-3 py-1 rounded-md text-sm ${link.active ? 'bg-[#0AC1EF] text-white' : 'bg-white border text-slate-700'}`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Link>
                                        ) : (
                                            <span key={idx} className="px-3 py-1 rounded-md bg-slate-50 text-slate-400 text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    )}
                                </nav>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}