import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, PlusCircle, ShoppingCart, AlertTriangle, Image, Edit } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Giao diện người bán',
        href: '/seller/dashboard',
    },
];

interface ProductItem {
    id: number;
    name: string;
    price?: number;
    stock?: number;
    is_active?: boolean;
    created_at?: string;
    // primary_image relation optional
    primary_image?: { url?: string } | null;
}

interface Props {
    stats: {
        totalProducts: number;
        activeProducts: number;
        totalStock: number;
    };
    lowStockCount?: number;
    draftCount?: number;
    recentProducts?: ProductItem[];
    userName?: string;
}

export default function SellerDashboard({ stats, lowStockCount = 0, draftCount = 0, recentProducts = [], userName = '' }: Props) {
    const page = usePage();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bảng điều khiển người bán" />

            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Xin chào, {userName || page.user?.name || 'Seller'}</h1>
                        <p className="text-sm text-gray-500 mt-1">Tổng quan bán hàng và quản lý sản phẩm nhanh</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/seller/products/create" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded shadow">
                            <PlusCircle className="w-4 h-4" /> Thêm sản phẩm
                        </Link>
                        <Link href="/seller/orders" className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white text-gray-700">
                            <ShoppingCart className="w-4 h-4" /> Đơn hàng
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
                        <div className="p-3 rounded bg-blue-50">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sản phẩm</p>
                            <p className="text-2xl font-semibold">{stats.totalProducts}</p>
                            <p className="text-xs text-gray-400 mt-1">Đang kích hoạt: <span className="font-medium">{stats.activeProducts}</span></p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
                        <div className="p-3 rounded bg-green-50">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tổng tồn kho</p>
                            <p className="text-2xl font-semibold">{stats.totalStock}</p>
                            <p className="text-xs text-gray-400 mt-1">Sản phẩm sắp hết: <span className="font-medium text-amber-600">{lowStockCount}</span></p>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
                        <div className="p-3 rounded bg-yellow-50">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bản nháp / Chưa đăng</p>
                            <p className="text-2xl font-semibold">{draftCount}</p>
                            <p className="text-xs text-gray-400 mt-1">Kiểm tra để hoàn thiện và đăng</p>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent products */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Sản phẩm mới nhất</h2>
                                <Link href="/seller/products" className="text-sm text-blue-600">Xem tất cả</Link>
                            </div>

                            {recentProducts.length === 0 ? (
                                <div className="text-sm text-gray-500">Chưa có sản phẩm nào — bắt đầu thêm sản phẩm để bán.</div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recentProducts.map(p => (
                                        <div key={p.id} className="flex items-center gap-4 p-3 rounded border hover:shadow">
                                            <div className="w-20 h-20 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                                                {p.primary_image?.url ? (
                                                    <img src={p.primary_image.url} alt={p.name} className="object-cover w-full h-full" />
                                                ) : (
                                                    <Image className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="font-medium text-sm truncate">{p.name}</div>
                                                        <div className="text-xs text-gray-500 mt-1">{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-sm">{typeof p.price === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price) : '—'}</div>
                                                        <div className="text-xs text-gray-400">Kho: {p.stock ?? '—'}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <Link href={`/seller/products/${p.id}/edit`} className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded border bg-white">
                                                        <Edit className="w-3 h-3" /> Sửa
                                                    </Link>
                                                    <Link href={`/seller/products/${p.id}/preview`} className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded border bg-white">
                                                        Xem trước
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column: quick actions & alerts */}
                    <aside className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold">Cảnh báo tồn kho</h4>
                                    <p className="text-sm text-gray-500 mt-1">Sản phẩm có tồn kho thấp</p>
                                </div>
                                <div className="text-2xl font-semibold text-amber-600">{lowStockCount}</div>
                            </div>

                            <div className="mt-4">
                                <Link href="/seller/products?filter=low_stock" className="w-full inline-flex justify-center px-3 py-2 rounded bg-amber-50 text-amber-700 text-sm">Xem sản phẩm sắp hết</Link>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <h4 className="font-semibold">Thao tác nhanh</h4>
                            <div className="mt-3 flex flex-col gap-2">
                                <Link href="/seller/products/create" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white text-sm"><PlusCircle className="w-4 h-4" /> Thêm sản phẩm</Link>
                                <Link href="/seller/products" className="inline-flex items-center gap-2 px-3 py-2 rounded border bg-white text-sm">Quản lý sản phẩm</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
