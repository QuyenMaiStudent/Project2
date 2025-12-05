import { useState } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Eye, Plus, MessageCircle } from 'lucide-react';

interface SupportTicket {
    id: number;
    subject: string;
    status: 'open' | 'closed';
    priority: string;
    replies_count: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    tickets: {
        data: SupportTicket[];
        links: PaginationLink[];
    };
}

const priorityColor = (priority: string) => {
    return priority === 'high' ? 'text-red-600' : priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
};

export default function CustomerSupportIndex({ tickets }: Props) {
    const { flash } = usePage().props as any;
    const success = flash?.success;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang chủ', href: '/customer/dashboard' },
                { title: 'Hỗ trợ', href: '/customer/support' },
            ]}
        >
            <Head title="Ticket hỗ trợ của tôi" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-4">
                    <header className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF] flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" /> Quản lý ticket của bạn
                            </p>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-1">Ticket hỗ trợ của tôi</h1>
                        </div>
                        <Link href="/customer/support/create">
                            <Button className="bg-[#0AC1EF] hover:bg-[#09b3db]">
                                <Plus className="w-4 h-4 mr-2" /> Tạo ticket mới
                            </Button>
                        </Link>
                    </header>

                    {success && (
                        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-sm flex items-center justify-between">
                            <span>{success}</span>
                            <button onClick={() => {}} className="text-lg leading-none hover:opacity-70">×</button>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Chủ đề</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Ưu tiên</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Trả lời</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tickets.data.length > 0 ? (
                                    tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 text-sm text-gray-900 font-semibold">{ticket.subject}</td>
                                            <td className={`px-6 py-3 text-sm font-semibold ${priorityColor(ticket.priority)}`}>
                                                {ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                            </td>
                                            <td className="px-6 py-3 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {ticket.status === 'open' ? 'Mở' : 'Đã đóng'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-700">
                                                <MessageCircle className="w-4 h-4 inline mr-1" />
                                                {ticket.replies_count}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-500">
                                                {new Date(ticket.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <Link href={`/customer/support/${ticket.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="w-4 h-4 mr-1" /> Xem
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Chưa có ticket nào.</h3>
                                                <p className="text-base md:text-lg text-gray-500 mb-4">Bạn chưa tạo ticket hỗ trợ nào.</p>
                                                <Link href="/customer/support/create">
                                                    <Button className="bg-[#0AC1EF] hover:bg-[#09b3db]">
                                                        <Plus className="w-4 h-4 mr-2" /> Tạo ticket mới
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {tickets.links && tickets.links.length > 1 && (
                            <div className="flex justify-center gap-2 p-4 bg-gray-50">
                                {tickets.links.map((link, idx) =>
                                    link.url ? (
                                        <Link key={idx} href={link.url}>
                                            <Button variant={link.active ? 'default' : 'outline'} size="sm">
                                                {link.label.replace(/&laquo;|&raquo;/g, '')}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <span key={idx} className="px-3 py-2 text-gray-400 text-sm">
                                            {link.label.replace(/&laquo;|&raquo;/g, '')}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}