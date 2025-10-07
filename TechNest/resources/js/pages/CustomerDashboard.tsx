import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ShoppingCart, Home, MapPin } from 'lucide-react';

export default function CustomerDashboard() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang chủ', href: '/' },
                { title: 'Customer Dashboard', href: '/customer/dashboard' }
            ]}
        >
            <Head title="Customer Dashboard" />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-8">Chào mừng bạn đến Customer Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/products"
                        className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors flex items-center space-x-4"
                    >
                        <Home className="h-8 w-8 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800">Sản phẩm</h3>
                            <p className="text-blue-600">Xem sản phẩm và mua sắm</p>
                        </div>
                    </Link>
                    <Link
                        href="/cart"
                        className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors flex items-center space-x-4"
                    >
                        <ShoppingCart className="h-8 w-8 text-green-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-green-800">Giỏ hàng</h3>
                            <p className="text-green-600">Xem và quản lý giỏ hàng của bạn</p>
                        </div>
                    </Link>
                    <Link
                        href="/shipping-addresses"
                        className="bg-orange-50 border border-orange-200 rounded-lg p-6 hover:bg-orange-100 transition-colors flex items-center space-x-4"
                    >
                        <MapPin className="h-8 w-8 text-orange-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-orange-800">Địa chỉ giao hàng</h3>
                            <p className="text-orange-600">Quản lý địa chỉ nhận hàng</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}