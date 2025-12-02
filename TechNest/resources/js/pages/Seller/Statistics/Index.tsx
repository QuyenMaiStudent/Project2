import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import Filters from './Filters';
import IncomeChart from './IncomeChart';
import { usePage } from '@inertiajs/react';

export default function StatisticsIndex() {
    const { props } = usePage();
    const initialData = (props as any).initialData ?? {};
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    async function fetchData(filters: any) {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const res = await fetch('/seller/statistics?' + params.toString(), {
            headers: { 'Accept': 'application/json' },
        });
        const json = await res.json();
        setData(json);
        setLoading(false);
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Bảng điều khiển', href: '/seller/dashboard' },
                { title: 'Thống kê', href: '/seller/statistics' }
            ]}
        >
            <Head title="Thống kê - Seller" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <header className="mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Thống kê cửa hàng</h1>
                    <p className="text-gray-600 mt-2">Doanh thu, đơn hàng và khách hàng mới theo tháng</p>
                </header>

                <Filters initialFilters={data.filters} onApply={fetchData} loading={loading} />

                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500">Tổng doanh thu</div>
                        <div className="mt-2 text-2xl font-bold text-gray-800">{(data.summary?.totalRevenue ?? 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500">Số đơn</div>
                        <div className="mt-2 text-2xl font-bold text-gray-800">{data.summary?.ordersCount ?? 0}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500">Giá trị trung bình/đơn</div>
                        <div className="mt-2 text-2xl font-bold text-gray-800">{data.summary?.averageOrderValue ?? 0}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-sm text-gray-500">Khách hàng mới</div>
                        <div className="mt-2 text-2xl font-bold text-gray-800">{data.summary?.newUsers ?? 0}</div>
                    </div>
                </section>

                <section className="mb-6 bg-white p-4 rounded-lg shadow border">
                    <h2 className="text-xl font-semibold mb-3">Thu nhập</h2>
                    <IncomeChart revenue={data.revenue} />
                </section>

                {/* Hoạt động đã bị loại bỏ - chỉ hiển thị biểu đồ doanh thu */}
            </div>
        </AppLayout>
    );
}