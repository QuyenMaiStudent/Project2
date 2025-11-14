import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, ShoppingBag } from 'lucide-react';

interface PaymentResultProps {
    provider: string;
    status: 'succeeded' | 'canceled' | 'failed';
    message: string;
    order?: {
        id: number;
        total_amount: number;
        discount_amount: number;
        status: string;
        placed_at: string;
        items_count: number;
    };
}

export default function PaymentResult({ provider, status, message, order }: PaymentResultProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'succeeded':
                return {
                    icon: CheckCircle,
                    color: 'green',
                    title: 'Thanh toán thành công!',
                    description: 'Đơn hàng của bạn đã được xác nhận và đang được xử lý.',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-600',
                };
            case 'canceled':
                return {
                    icon: XCircle,
                    color: 'orange',
                    title: 'Thanh toán đã bị hủy',
                    description: 'Bạn đã hủy giao dịch thanh toán.',
                    bgColor: 'bg-orange-50',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-800',
                    iconColor: 'text-orange-600',
                };
            case 'failed':
            default:
                return {
                    icon: AlertCircle,
                    color: 'red',
                    title: 'Thanh toán thất bại',
                    description: 'Đã có lỗi xảy ra trong quá trình thanh toán.',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-600',
                };
        }
    };

    const config = getStatusConfig();
    const StatusIcon = config.icon;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const getProviderName = (provider: string) => {
        const providers: Record<string, string> = {
            stripe: 'Stripe',
            momo: 'MoMo',
            vnpay: 'VNPay',
            paypal: 'PayPal',
        };
        return providers[provider] || provider;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Kết quả thanh toán', href: '#' },
            ]}
        >
            <Head title="Kết quả thanh toán" />
            
            <div className="max-w-3xl mx-auto p-6">
                {/* Status Card */}
                <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-8 mb-6`}>
                    <div className="flex flex-col items-center text-center">
                        <StatusIcon className={`h-16 w-16 ${config.iconColor} mb-4`} />
                        <h1 className={`text-2xl font-bold ${config.textColor} mb-2`}>
                            {config.title}
                        </h1>
                        <p className={`${config.textColor} mb-4`}>
                            {config.description}
                        </p>
                        <p className="text-sm text-gray-600">
                            Phương thức: <span className="font-semibold">{getProviderName(provider)}</span>
                        </p>
                        {message && (
                            <p className="text-sm text-gray-500 mt-2">
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Order Details */}
                {order && status === 'succeeded' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            Thông tin đơn hàng
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mã đơn hàng:</span>
                                <span className="font-semibold">#{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Số lượng sản phẩm:</span>
                                <span className="font-semibold">{order.items_count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Thời gian đặt hàng:</span>
                                <span className="font-semibold">{order.placed_at}</span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Giảm giá:</span>
                                    <span className="font-semibold">
                                        -{formatCurrency(order.discount_amount)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between pt-3 border-t">
                                <span className="text-lg font-semibold">Tổng cộng:</span>
                                <span className="text-lg font-bold text-green-600">
                                    {formatCurrency(order.total_amount)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {status === 'succeeded' && order ? (
                        <>
                            <Link
                                href={`/customer/orders/${order.id}`}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                            >
                                Xem chi tiết đơn hàng
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/customer/dashboard"
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                            >
                                Về dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/checkout"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                            >
                                Thử lại
                            </Link>
                            <Link
                                href="/cart"
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                            >
                                Quay lại giỏ hàng
                            </Link>
                        </>
                    )}
                </div>

                {/* Support Info */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Cần hỗ trợ? Liên hệ với chúng tôi qua email: support@technest.com</p>
                    <p className="mt-1">hoặc hotline: 1900-xxxx</p>
                </div>
            </div>
        </AppLayout>
    );
}