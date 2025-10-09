import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, CheckCircle, XCircle, Clock, Users, ShoppingCart, DollarSign } from 'lucide-react';

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
                { title: 'Bảng điều khiển quản trị', href: '/admin/dashboard' }
            ]}
        >
            <Head title="Bảng điều khiển quản trị" />
            <div className="flex">
                {/* Sidebar Menu */}
                <div className="w-64 bg-white shadow-md h-screen">
                    <div className="p-4">
                        <nav className="space-y-2">
                            <Link
                                href="/admin/products/pending"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <span className="text-gray-700">Sản phẩm chờ duyệt</span>
                            </Link>
                            <Link
                                href="/admin/products/approved"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-gray-700">Sản phẩm đã duyệt</span>
                            </Link>
                            <Link
                                href="/admin/products/rejected"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <XCircle className="h-5 w-5 text-red-600" />
                                <span className="text-gray-700">Sản phẩm bị từ chối</span>
                            </Link>
                            <Link
                                href="/admin/categories"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Package className="h-5 w-5 text-indigo-600" />
                                <span className="text-gray-700">Quản lý danh mục</span>
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Users className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Quản lý người dùng</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
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
            </div>
        </AppLayout>
    );
}
