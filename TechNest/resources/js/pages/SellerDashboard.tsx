import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Package, Plus, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller/dashboard',
    },
];

interface Props {
    stats: {
        totalProducts: number;
        activeProducts: number;
        totalStock: number;
    };
}

export default function SellerDashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seller Dashboard" />
            
            {/* Sidebar Menu */}
            <div className="flex">
                <div className="w-64 bg-white shadow-md h-screen">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Seller Menu</h2>
                        <nav className="space-y-2">
                            <Link
                                href="/seller/products/create"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Plus className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Add Product</span>
                            </Link>
                            
                            <Link
                                href="/seller/products"
                                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Eye className="h-5 w-5 text-green-600" />
                                <span className="text-gray-700">View Products</span>
                            </Link>

                            <Link 
                                href='/seller/products/upload-images'
                                className='flex items-center space-x-3 p-3 rounded-b-lg hover:bg-gray-100 transition-colors'
                                >

                                <Package className='h-5 w-5 text-purple-600' />
                                <span className='text-gray-700'>Thêm ảnh cho sản phẩm</span>

                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <Package className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Products</p>
                                    <p className="text-2xl font-semibold text-gray-800">{stats.totalProducts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <Package className="h-8 w-8 text-green-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Active Products</p>
                                    <p className="text-2xl font-semibold text-gray-800">{stats.activeProducts}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center">
                                <Package className="h-8 w-8 text-orange-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Stock</p>
                                    <p className="text-2xl font-semibold text-gray-800">{stats.totalStock}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
