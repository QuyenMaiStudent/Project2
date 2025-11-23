// @ts-nocheck
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PaginationData, SharedData } from '@/types';
import { useState } from 'react';
import { Eye, Search, TruckIcon, Package, CheckCircle } from 'lucide-react';

interface Shipper {
    id: number;
    name: string;
    email: string;
    phone: string;
    total_orders: number;
    delivered_orders: number;
    in_delivery_orders: number;
    created_at: string;
}

interface Props extends SharedData {
    shippers: PaginationData<Shipper>;
    filters: {
        search?: string;
    };
}

export default function Index({ shippers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/admin/shippers', { search }, { preserveState: true });
    };

    const getDeliveryRate = (delivered: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((delivered / total) * 100);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Quản lý shipper', href: '/admin/shippers' }
            ]}
        >
            <Head title="Quản lý Shipper" />
            
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                {/* Header */}
                <header className="mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0AC1EF] to-[#0891B2] flex items-center justify-center shadow-lg">
                            <TruckIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Quản lý Shipper</h1>
                            <p className="text-gray-600 mt-1">Xem thông tin và hiệu suất giao hàng của các shipper</p>
                        </div>
                    </div>
                </header>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tổng Shipper</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{shippers.total}</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                <TruckIcon className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Đơn đang giao</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">
                                    {shippers.data.reduce((sum, s) => sum + s.in_delivery_orders, 0)}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Package className="w-7 h-7 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Đơn đã giao</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {shippers.data.reduce((sum, s) => sum + s.delivered_orders, 0)}
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 mb-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 border-gray-300 focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                        />
                        <Button 
                            onClick={handleSearch}
                            className="bg-[#0AC1EF] hover:bg-[#09b3db] text-white transition-colors"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Tìm kiếm
                        </Button>
                        {search && (
                            <Button 
                                onClick={() => {
                                    setSearch('');
                                    router.get('/admin/shippers');
                                }} 
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-100"
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Thông tin Shipper</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Liên hệ</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Hiệu suất</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Ngày tham gia</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {shippers.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {search ? 'Không tìm thấy shipper nào' : 'Chưa có shipper nào trong hệ thống'}
                                            </h3>
                                            {!search && (
                                                <p className="text-gray-500">Shipper sẽ tự đăng ký tài khoản để tham gia giao hàng.</p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                shippers.data.map((shipper) => {
                                    const rate = getDeliveryRate(shipper.delivered_orders, shipper.total_orders);
                                    return (
                                        <tr key={shipper.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 font-mono text-gray-600 font-medium">#{shipper.id}</td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{shipper.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                            {shipper.total_orders} đơn hàng
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-700 flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        {shipper.email}
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        {shipper.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex gap-2">
                                                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            {shipper.delivered_orders}
                                                        </Badge>
                                                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                                                            <Package className="w-3 h-3 mr-1" />
                                                            {shipper.in_delivery_orders}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-xs font-semibold px-2 py-1 rounded">
                                                        <span className={`${
                                                            rate >= 80 ? 'text-green-600 bg-green-50' : 
                                                            rate >= 50 ? 'text-orange-600 bg-orange-50' : 
                                                            'text-red-600 bg-red-50'
                                                        } px-2 py-1 rounded`}>
                                                            Tỷ lệ: {rate}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{shipper.created_at}</td>
                                            <td className="py-3 px-4 text-center">
                                                <Button
                                                    onClick={() => router.get(`/admin/shippers/${shipper.id}`)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[#0AC1EF] text-[#0AC1EF] hover:bg-[#0AC1EF] hover:text-white transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Xem chi tiết
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {shippers.links && shippers.links.length > 1 && (
                        <div className="mt-4 flex justify-center gap-1 p-4 bg-gray-50">
                            {shippers.links.map((link, idx) =>
                                link.url ? (
                                    <button
                                        key={idx}
                                        className={`px-3 py-1 rounded transition-all duration-200 ${
                                            link.active 
                                                ? 'bg-[#0AC1EF] text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        onClick={() => router.visit(link.url!)}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}