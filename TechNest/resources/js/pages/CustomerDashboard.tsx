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
            <div className="p-10 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold">Xin chào, {user.name ?? 'Khách'}</h1>
                            <p className="text-base md:text-lg text-slate-600 mt-2">{user.email ?? ''}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-white border border-slate-200 rounded-lg p-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl font-semibold">Địa chỉ giao hàng</h2>
                                <Link href="/shipping-addresses" className="text-sm md:text-base text-slate-500 hover:underline">Quản lý</Link>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="mt-6 text-base text-slate-500">Bạn chưa có địa chỉ giao hàng.</div>
                            ) : (
                                <ul className="mt-6 space-y-4">
                                    {addresses.map((a: any) => (
                                        <li key={a.id} className="p-5 bg-slate-50 rounded flex items-start gap-6 min-h-[84px]">
                                            <div className="flex-1">
                                                <div className="font-semibold text-lg text-slate-800">{a.recipient_name}</div>
                                                <div className="text-sm md:text-base text-slate-600 mt-1">{a.phone}</div>
                                                <div className="mt-2 text-sm md:text-base text-slate-700">{a.address_line}</div>
                                            </div>
                                            {a.is_default && <div className="text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded">Mặc định</div>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-lg p-6 text-base text-slate-600">
                            <div className="font-medium mb-2 text-lg">Hỗ trợ</div>
                            <div>Email: <a href="mailto:technestvn@gmail.com" className="text-blue-600">technestvn@gmail.com</a></div>
                            <div className="mt-1">Hotline: 0979701300</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}