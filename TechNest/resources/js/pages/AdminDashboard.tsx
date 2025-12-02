import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Users, Package as PackageIcon, ShoppingCart, DollarSign, CheckSquare, Clock, Link as LinkIcon } from 'lucide-react';

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
            <div className="p-6 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Bảng điều khiển quản trị</h1>
                            <p className="text-base md:text-lg text-slate-600 mt-2">Tổng quan nhanh — người quản trị theo dõi số liệu chính và hoạt động hệ thống</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded shadow-sm text-base md:text-lg">
                                Làm mới
                            </button>
                            <Link href="/admin/settings" className="inline-flex items-center gap-2 bg-[#0AC1EF] text-white px-4 py-2 rounded shadow text-base md:text-lg">
                                Cài đặt
                            </Link>
                        </div>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-semibold">U</div>
                            <div>
                                <div className="text-sm text-gray-500">Người dùng</div>
                                <div className="text-3xl font-bold text-gray-900">{totalUsers}</div>
                                <div className="text-sm text-gray-400 mt-1">Tổng người dùng đăng ký</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xl font-semibold">S</div>
                            <div>
                                <div className="text-sm text-gray-500">Người bán</div>
                                <div className="text-3xl font-bold text-gray-900">{totalSellers}</div>
                                <div className="text-sm text-gray-400 mt-1">Tài khoản bán hàng</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center text-amber-600 text-xl font-semibold">P</div>
                            <div>
                                <div className="text-sm text-gray-500">Sản phẩm</div>
                                <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
                                <div className="text-sm text-gray-400 mt-1">Sản phẩm đang kinh doanh</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl font-semibold">O</div>
                            <div>
                                <div className="text-sm text-gray-500">Đơn hàng</div>
                                <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
                                <div className="text-sm text-gray-400 mt-1">Đơn hàng mới</div>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Doanh thu & Hoạt động gần đây</h2>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div className="flex-1">
                                    <div className="text-sm text-gray-500">Tổng doanh thu</div>
                                    <div className="text-3xl font-bold text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</div>
                                </div>
                                <div className="w-full md:w-1/3 bg-gray-50 rounded p-3 text-center">
                                    <div className="text-sm text-gray-500">Gói</div>
                                    <div className="text-2xl font-semibold text-gray-900">{totalPackages}</div>
                                    <div className="text-sm text-gray-400 mt-1">Hoạt động: {activePackages}</div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <h3 className="text-lg font-medium text-gray-800">Gói mới nhất</h3>
                                <div className="divide-y divide-gray-100">
                                    {recentPackages.length === 0 ? (
                                        <div className="py-4 text-center text-gray-500">Chưa có gói nào</div>
                                    ) : recentPackages.map((p: any, idx: number) => (
                                        <div key={idx} className="py-3 flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-base font-semibold">{p.code?.charAt(0)?.toUpperCase() ?? 'G'}</div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-base">{p.title ?? 'Gói'}</div>
                                                <div className="text-sm text-gray-500 mt-1">{p.description ?? ''}</div>
                                            </div>
                                            <div className="text-sm text-gray-600">{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-semibold text-gray-900">Tác vụ nhanh</h3>
                                <div className="mt-3 flex flex-col gap-3">
                                    <Link href="/admin/users" className="px-3 py-2 rounded bg-blue-600 text-white text-base text-center">Quản lý người dùng</Link>
                                    <Link href="/admin/products" className="px-3 py-2 rounded border text-base text-center">Quản lý sản phẩm</Link>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-5 md:p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-semibold text-gray-900">Thông tin admin</h3>
                                <div className="mt-2 text-base text-gray-700">
                                    <div className="font-medium">{admin?.name ?? '—'}</div>
                                    <div className="text-sm text-gray-500">{roleNames.join(', ')}</div>
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
