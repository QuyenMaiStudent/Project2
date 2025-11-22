import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Truck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Order {
    id: number;
    status: string;
    status_label: string;
    placed_at: string;
    items_count: number;
    first_product_image?: string;
    shipper_name?: string;
}

interface Props {
    orders: {
        data: Order[];
        links: any;
        meta: any;
    };
}

export default function Index({ orders }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready_to_ship':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_delivery':
                return 'bg-blue-100 text-blue-800';
            case 'delivered_awaiting_confirmation':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="Theo dõi đơn hàng" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Theo dõi đơn hàng
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Theo dõi tình trạng giao hàng của bạn
                        </p>
                    </div>

                    {orders.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4 text-sm text-gray-600">
                                    Bạn chưa có đơn hàng nào đang giao
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/tracking/${order.id}`}
                                >
                                    <Card className="transition-shadow hover:shadow-md">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                {order.first_product_image && (
                                                    <img
                                                        src={order.first_product_image}
                                                        alt="Product"
                                                        className="h-20 w-20 rounded-lg object-cover"
                                                    />
                                                )}
                                                
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-gray-900">
                                                            Đơn hàng #{order.id}
                                                        </h3>
                                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status_label}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {order.items_count} sản phẩm
                                                    </p>
                                                    
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Đặt lúc: {order.placed_at}
                                                    </p>
                                                    
                                                    {order.shipper_name && (
                                                        <div className="mt-2 flex items-center text-sm text-gray-600">
                                                            <Truck className="mr-1 h-4 w-4" />
                                                            Shipper: {order.shipper_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}