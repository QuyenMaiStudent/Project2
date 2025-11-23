import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SharedData } from '@/types';
import { ArrowLeft, Mail, Phone, Calendar, Package, CheckCircle, TruckIcon, Clock } from 'lucide-react';

interface Order {
    id: number;
    status: string;
    customer_name: string;
    shipping_address: string;
    total_amount: number;
    placed_at: string;
    shipped_at: string | null;
    delivered_at: string | null;
}

interface Shipper {
    id: number;
    name: string;
    email: string;
    phone: string;
    total_orders: number;
    delivered_orders: number;
    in_delivery_orders: number;
    ready_to_ship_orders: number;
    created_at: string;
    email_verified_at: string | null;
}

interface Props extends SharedData {
    shipper: Shipper;
    recentOrders: Order[];
}

export default function Show({ shipper, recentOrders }: Props) {
    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            'placed': { label: 'Đã đặt', className: 'bg-blue-500' },
            'processing': { label: 'Đang xử lý', className: 'bg-yellow-500' },
            'ready_to_ship': { label: 'Sẵn sàng giao', className: 'bg-purple-500' },
            'in_delivery': { label: 'Đang giao', className: 'bg-orange-500' },
            'delivered': { label: 'Đã giao', className: 'bg-green-500' },
            'delivered_awaiting_confirmation': { label: 'Chờ xác nhận', className: 'bg-teal-500' },
            'cancelled': { label: 'Đã hủy', className: 'bg-red-500' },
        };

        const config = statusMap[status] || { label: status, className: 'bg-gray-500' };
        return <Badge className={`${config.className} hover:${config.className}/90 text-white`}>{config.label}</Badge>;
    };

    const deliveryRate = shipper.total_orders > 0
        ? Math.round((shipper.delivered_orders / shipper.total_orders) * 100)
        : 0;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Quản lý shipper', href: '/admin/shippers' },
                { title: shipper.name, href: `/admin/shippers/${shipper.id}` }
            ]}
        >
            <Head title={`Chi tiết Shipper - ${shipper.name}`} />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen space-y-6">
                {/* Header */}
                <header className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.get('/admin/shippers')}
                            variant="outline"
                            size="icon"
                            className="border-gray-300 hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Chi tiết Shipper</h1>
                            <p className="text-gray-600 mt-1">Thông tin và lịch sử giao hàng của {shipper.name}</p>
                        </div>
                    </div>
                </header>

                {/* Shipper Info & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Info Card */}
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0AC1EF] to-[#0891B2] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {shipper.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Họ và tên</div>
                                <div className="text-lg font-semibold text-gray-900 mt-1">{shipper.name}</div>
                            </div>

                            <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-500">Email</div>
                                    <div className="text-sm text-gray-900 mt-1 break-all">{shipper.email}</div>
                                    {shipper.email_verified_at && (
                                        <Badge variant="outline" className="mt-2 text-xs text-green-600 border-green-600 bg-green-50">
                                            ✓ Đã xác thực
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Số điện thoại</div>
                                    <div className="text-sm text-gray-900 mt-1">{shipper.phone}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm font-medium text-gray-500">Ngày tham gia</div>
                                    <div className="text-sm text-gray-900 mt-1">{shipper.created_at}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tổng đơn hàng</p>
                                    <p className="text-4xl font-bold text-gray-900 mt-2">{shipper.total_orders}</p>
                                </div>
                                <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Package className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Đã giao thành công</p>
                                    <p className="text-4xl font-bold text-green-600 mt-2">{shipper.delivered_orders}</p>
                                </div>
                                <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Đang giao hàng</p>
                                    <p className="text-4xl font-bold text-orange-600 mt-2">{shipper.in_delivery_orders}</p>
                                </div>
                                <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <TruckIcon className="w-8 h-8 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tỷ lệ thành công</p>
                                    <p className={`text-4xl font-bold mt-2 ${
                                        deliveryRate >= 80 ? 'text-green-600' :
                                        deliveryRate >= 50 ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                        {deliveryRate}%
                                    </p>
                                </div>
                                <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Clock className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white p-4">
                        <h2 className="text-xl font-bold">Lịch sử giao hàng gần đây</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mã đơn</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Khách hàng</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Địa chỉ giao</th>
                                    <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày đặt</th>
                                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ngày giao</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                                                <p className="text-gray-500">Shipper này chưa nhận đơn hàng nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 font-mono font-medium text-gray-900">#{order.id}</td>
                                            <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                                            <td className="py-3 px-4 font-medium text-gray-900">{order.customer_name}</td>
                                            <td className="py-3 px-4 max-w-xs truncate text-sm text-gray-600" title={order.shipping_address}>
                                                {order.shipping_address}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                                {order.total_amount.toLocaleString('vi-VN')}₫
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{order.placed_at}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {order.delivered_at || order.shipped_at || <span className="text-gray-400">Chưa giao</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}