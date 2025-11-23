import { Head } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Users, Package as PackageIcon, ShoppingCart, DollarSign, CheckSquare, Clock } from 'lucide-react';

export default function AdminDashboard(props: any) {
    const {
        totalUsers = 0,
        totalSellers = 0,
        totalProducts = 0,
        totalOrders = 0,
        totalRevenue = 0,
        totalPackages = 0,
        activePackages = 0,
        recentPackages = [],
        admin = null,
    } = props;

    const roleNames = ([] as any[])
        .concat(admin?.role?.name ? [admin.role.name] : [], (admin?.roles ?? []).map((r: any) => r.name))
        .filter((v, i, a) => v && a.indexOf(v) === i);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' }
            ]}
        >
            <Head title="Bảng điều khiển quản trị" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-800">Chào, {admin?.name ?? 'Administrator'}</h1>
                            <p className="text-sm text-slate-500">Tổng quan hệ thống và thông tin quản trị viên</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100">
                                <p className="text-xs text-slate-500">Email</p>
                                <p className="text-sm font-medium text-slate-800">{admin?.email ?? '-'}</p>
                            </div>
                            <div className="rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100">
                                <p className="text-xs text-slate-500">Vai trò</p>
                                <p className="text-sm font-medium text-slate-800">{roleNames.join(', ') || '-'}</p>
                            </div>
                            <div className="rounded-lg bg-white px-4 py-3 shadow-sm border border-slate-100">
                                <p className="text-xs text-slate-500">Trạng thái</p>
                                <p className={`text-sm font-medium ${admin?.is_active ? 'text-green-600' : 'text-rose-600'}`}>
                                    {admin?.is_active ? 'Hoạt động' : 'Vô hiệu'}
                                </p>
                            </div>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="p-3 rounded-md bg-blue-50">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Tổng người dùng</p>
                                <p className="text-xl font-semibold text-slate-800">{totalUsers}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="p-3 rounded-md bg-purple-50">
                                <PackageIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Tổng người bán</p>
                                <p className="text-xl font-semibold text-slate-800">{totalSellers}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="p-3 rounded-md bg-green-50">
                                <ShoppingCart className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Tổng đơn hàng</p>
                                <p className="text-xl font-semibold text-slate-800">{totalOrders}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="p-3 rounded-md bg-yellow-50">
                                <DollarSign className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Tổng doanh thu</p>
                                <p className="text-xl font-semibold text-slate-800">{Number(totalRevenue).toLocaleString()}₫</p>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-slate-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-800">Gói dịch vụ mới nhất</h2>
                                <div className="text-sm text-slate-500 flex items-center gap-3">
                                    <CheckSquare className="h-4 w-4 text-green-600" /> <span>{activePackages} đang mở</span>
                                    <Clock className="h-4 w-4 text-slate-400" /> <span>{totalPackages} tổng</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {recentPackages.length === 0 ? (
                                    <p className="text-sm text-slate-500">Chưa có gói nào.</p>
                                ) : (
                                    recentPackages.map((pkg: any) => (
                                        <div key={pkg.id} className="flex items-center justify-between p-3 rounded border border-slate-100">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{pkg.name}</p>
                                                <p className="text-xs text-slate-500">{pkg.duration_days} ngày · {Number(pkg.price).toLocaleString()}₫</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {pkg.is_active ? 'Đang mở' : 'Đang tắt'}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg border border-slate-100 p-5">
                            <h3 className="text-sm text-slate-500 mb-3">Thông tin quản trị viên</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">Tên</p>
                                    <p className="text-sm font-medium text-slate-800">{admin?.name ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="text-sm font-medium text-slate-800">{admin?.email ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Vai trò</p>
                                    <p className="text-sm font-medium text-slate-800">{roleNames.join(', ') || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Tạo lúc</p>
                                    <p className="text-sm font-medium text-slate-800">{admin?.created_at ? new Date(admin.created_at).toLocaleString() : '-'}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
