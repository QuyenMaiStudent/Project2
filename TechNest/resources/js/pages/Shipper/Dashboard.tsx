import ShipperLayout from '@/layouts/shipper-layout';
import { Head, Link } from '@inertiajs/react';

interface Metrics {
    ready_to_ship: number;
    my_in_delivery: number;
    awaiting_confirmation: number;
    delivered_today: number;
}

interface RecentOrder {
    id: number;
    status: string;
    updated_at: string | null;
}

interface Props {
    metrics: Metrics;
    recent_orders: RecentOrder[];
    shipper: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    };
}

const badgeColor = (status: string) => {
    switch (status) {
        case 'ready_to_ship':
            return 'bg-amber-100 text-amber-700';
        case 'in_delivery':
            return 'bg-indigo-100 text-indigo-700';
        case 'delivered_awaiting_confirmation':
            return 'bg-purple-100 text-purple-700';
        case 'delivered':
            return 'bg-emerald-100 text-emerald-700';
        default:
            return 'bg-gray-100 text-gray-600';
    }
};

export default function Dashboard({ metrics, recent_orders, shipper }: Props) {
    return (
        <ShipperLayout>
            <Head title="Dashboard Shipper" />
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Chào {shipper.name}</h1>
                    <p className="text-sm text-gray-600">
                        Email: {shipper.email} {shipper.phone && <>• ĐT: {shipper.phone}</>}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard label="Đơn chờ nhận" value={metrics.ready_to_ship} href="/shipper/orders" />
                    <MetricCard label="Đang giao" value={metrics.my_in_delivery} href="/shipper/orders" />
                    <MetricCard label="Chờ KH xác nhận" value={metrics.awaiting_confirmation} href="/shipper/orders" />
                    <MetricCard label="Giao xong hôm nay" value={metrics.delivered_today} href="/shipper/orders" />
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <h2 className="text-sm font-semibold text-gray-700">Đơn gần đây</h2>
                        <Link
                            href="/shipper/orders"
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Xem tất cả
                        </Link>
                    </div>
                    <ul className="divide-y divide-gray-100 text-sm">
                        {recent_orders.length === 0 && (
                            <li className="px-4 py-6 text-center text-gray-500">Chưa có đơn nào.</li>
                        )}
                        {recent_orders.map((o) => (
                            <li key={o.id} className="flex items-center justify-between px-4 py-3">
                                <div className="font-medium text-gray-900">#{o.id}</div>
                                <div className="flex items-center gap-3">
                                    <span className={`rounded px-2 py-1 text-xs font-semibold ${badgeColor(o.status)}`}>
                                        {o.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{o.updated_at}</span>
                                    <Link
                                        href={`/shipper/orders/${o.id}`}
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Chi tiết
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </ShipperLayout>
    );
}

function MetricCard({ label, value, href }: { label: string; value: number; href: string }) {
    return (
        <Link
            href={href}
            className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
        >
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900 group-hover:text-indigo-600">{value}</div>
        </Link>
    );
}