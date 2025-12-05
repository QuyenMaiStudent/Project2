import { usePage, Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Eye, Clock } from 'lucide-react';

interface SupportTicket {
    id: number;
    subject: string;
    status: 'open' | 'closed';
    priority: 'low' | 'medium' | 'high';
    user: { id: number; name: string; email: string };
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

export default function SupportIndex({ tickets }: Props) {
    const { flash } = usePage().props as any;
    const success = flash?.success;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Hỗ trợ khách hàng', href: '/admin/support' },
            ]}
        >
            <Head title="Quản lý hỗ trợ" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-4">
                    <header className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF] flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4" /> Cập nhật gần đây
                            </p>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-1">Quản lý hỗ trợ khách hàng</h1>
                        </div>
                        {success && (
                            <span className="px-3 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                                {success}
                            </span>
                        )}
                    </header>

                    <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Chủ đề</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Ưu tiên</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Trả lời</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Ngày tạo</th>
                                    <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tickets.data.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 text-sm text-gray-900 font-semibold">{ticket.subject}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700">{ticket.user.name}</td>
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
                                        <td className="px-6 py-3 text-sm text-gray-700">{ticket.replies_count}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">
                                            {new Date(ticket.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <Link href={`/admin/support/${ticket.id}`}>
                                                <Button size="sm" variant="outline" className="mr-2">
                                                    <Eye className="w-4 h-4 mr-1" /> Xem
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
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