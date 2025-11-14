import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminDashboard(props: any) {
    const {
        totalUsers = 0,
        totalSellers = 0,
        totalProducts = 0,
        totalOrders = 0,
        totalRevenue = 0,
    } = props;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' }
            ]}
        >
            <Head title="Bảng điều khiển quản trị" />
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Tổng người dùng</p>
                            <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <Package className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Tổng người bán</p>
                            <p className="text-2xl font-semibold text-gray-800">{totalSellers}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <Package className="h-8 w-8 text-gray-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                            <p className="text-2xl font-semibold text-gray-800">{totalProducts}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                            <p className="text-2xl font-semibold text-gray-800">{totalOrders}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-600">Tổng doanh thu</p>
                            <p className="text-2xl font-semibold text-gray-800">{totalRevenue.toLocaleString()}₫</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
