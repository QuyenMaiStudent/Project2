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
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-100',
                    titleColor: 'text-emerald-700',
                    iconColor: 'text-emerald-600',
                    title: 'Thanh toán thành công!',
                    desc: 'Đơn hàng của bạn đã được xác nhận và đang được xử lý.',
                };
            case 'canceled':
                return {
                    icon: XCircle,
                    bg: 'bg-amber-50',
                    border: 'border-amber-100',
                    titleColor: 'text-amber-700',
                    iconColor: 'text-amber-600',
                    title: 'Thanh toán đã bị hủy',
                    desc: 'Giao dịch thanh toán đã bị hủy.',
                };
            case 'failed':
            default:
                return {
                    icon: AlertCircle,
                    bg: 'bg-rose-50',
                    border: 'border-rose-100',
                    titleColor: 'text-rose-700',
                    iconColor: 'text-rose-600',
                    title: 'Thanh toán thất bại',
                    desc: 'Đã có lỗi xảy ra trong quá trình thanh toán.',
                };
        }
    };

    const cfg = getStatusConfig();
    const StatusIcon = cfg.icon;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    const providerName = (p: string) => {
        const map: Record<string, string> = { stripe: 'Stripe', momo: 'MoMo', vnpay: 'VNPay', paypal: 'PayPal' };
        return map[p] || p;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/' },
                { title: 'Kết quả thanh toán', href: '#' },
            ]}
        >
            <Head title="Kết quả thanh toán" />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header card (match checkout style) */}
                    <div className="bg-white rounded-lg p-5 border border-slate-200 flex items-center justify-between shadow-sm">
                        <div>
                            <h1 className="text-2xl font-semibold">Kết quả thanh toán</h1>
                            <p className="text-sm text-slate-500 mt-1">Thông tin về giao dịch và đơn hàng của bạn.</p>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-slate-500">Phương thức</div>
                            <div className="text-lg font-extrabold">{providerName(provider)}</div>
                        </div>
                    </div>

                    {/* Status card */}
                    <div className={`rounded-lg ${cfg.bg} border ${cfg.border} p-6 shadow-sm flex gap-6 items-center`}>
                        <div className="p-3 rounded-lg bg-white/60 flex items-center justify-center">
                            <StatusIcon className={`h-12 w-12 ${cfg.iconColor}`} />
                        </div>

                        <div className="flex-1">
                            <h2 className={`text-2xl font-semibold ${cfg.titleColor}`}>{cfg.title}</h2>
                            <p className="text-sm text-slate-600 mt-2">{cfg.desc}</p>

                            {message && (
                                <div className="mt-3 text-sm text-slate-500">
                                    <strong className="font-medium">Chi tiết:</strong> {message}
                                </div>
                            )}

                            <div className="mt-4 flex items-center gap-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center rounded bg-[#0AC1EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#09b3db]"
                                >
                                    Quay về trang chủ
                                </Link>

                                {status === 'succeeded' && order && (
                                    <Link
                                        href={`/customer/orders/${order.id}`}
                                        className="inline-flex items-center rounded border px-4 py-2 text-sm font-medium bg-white hover:bg-slate-50"
                                    >
                                        Xem chi tiết đơn hàng
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Right summary box */}
                        <div className="w-44 bg-white border border-slate-100 rounded-lg p-4 text-sm">
                            <div className="text-slate-500">Trạng thái giao dịch</div>
                            <div className={`mt-2 font-semibold ${cfg.titleColor}`}>{status === 'succeeded' ? 'Thành công' : status === 'canceled' ? 'Đã huỷ' : 'Thất bại'}</div>

                            {order && (
                                <>
                                    <div className="mt-3 text-slate-500">Mã đơn</div>
                                    <div className="font-medium mt-1">#{order.id}</div>

                                    <div className="mt-3 text-slate-500">Tổng</div>
                                    <div className="font-semibold mt-1 text-green-600">{formatCurrency(order.total_amount)}</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order details card (if available) */}
                    {order && (
                        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                Thông tin đơn hàng
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-700">
                                <div>
                                    <div className="text-slate-500">Số sản phẩm</div>
                                    <div className="font-medium mt-1">{order.items_count}</div>
                                </div>

                                <div>
                                    <div className="text-slate-500">Thời gian</div>
                                    <div className="font-medium mt-1">{order.placed_at}</div>
                                </div>

                                <div>
                                    <div className="text-slate-500">Trạng thái đơn</div>
                                    <div className="font-medium mt-1 capitalize">{order.status}</div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-sm text-slate-500">Chi tiết thêm sẽ được gửi tới email và trang quản lý đơn hàng.</div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/customer/orders/${order.id}`}
                                        className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Xem đơn hàng
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>

                                    <Link
                                        href="/customer/dashboard"
                                        className="inline-flex items-center px-4 py-2 rounded border bg-white hover:bg-slate-50 text-sm"
                                    >
                                        Về dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Support */}
                    <div className="text-center text-sm text-slate-500">
                        <p>Nếu cần hỗ trợ, vui lòng liên hệ: <a className="text-blue-600" href="mailto:support@technest.com">support@technest.com</a> hoặc hotline: 1900-xxxx</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}