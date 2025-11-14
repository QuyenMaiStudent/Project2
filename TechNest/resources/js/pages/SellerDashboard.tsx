import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Giao diện người bán',
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
            
            {/* Đã loại bỏ sidebar riêng, chỉ giữ main content */}
            <div className="p-6">
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
        </AppLayout>
    );
}
