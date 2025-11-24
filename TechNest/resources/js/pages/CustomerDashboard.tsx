import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapPin } from 'lucide-react';

export default function CustomerDashboard() {
    const { props } = usePage();
    const user = (props as any).user ?? {};
    const addresses = (props as any).addresses ?? [];

    return (
        <AppLayout breadcrumbs={[{ title: 'Giao diện người dùng', href: '/customer/dashboard' }]}>
            <Head title="Customer Dashboard" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Xin chào, {user.name ?? 'Khách'}</h1>
                            <p className="text-sm text-slate-600 mt-1">{user.email ?? ''}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
                                <Link href="/shipping-addresses" className="text-sm text-slate-500 hover:underline">Quản lý</Link>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="mt-4 text-sm text-slate-500">Bạn chưa có địa chỉ giao hàng.</div>
                            ) : (
                                <ul className="mt-4 space-y-3">
                                    {addresses.map((a: any) => (
                                        <li key={a.id} className="p-3 bg-slate-50 rounded flex items-start gap-4">
                                            <div className="flex-1">
                                                <div className="font-medium">{a.recipient_name}</div>
                                                <div className="text-sm text-slate-600">{a.phone}</div>
                                                <div className="mt-1 text-sm text-slate-700">{a.address_line}</div>
                                            </div>
                                            {a.is_default && <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Mặc định</div>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                            <div className="font-medium mb-2">Hỗ trợ</div>
                            <div>Email: <a href="mailto:support@technest.com" className="text-blue-600">support@technest.com</a></div>
                            <div>Hotline: 1900-xxxx</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}