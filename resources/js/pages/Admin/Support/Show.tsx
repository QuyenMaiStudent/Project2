import { useState } from 'react';
import { usePage, useForm, Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';

interface Reply {
    id: number;
    message: string;
    user: { id: number; name: string };
    created_at: string;
}

interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: 'open' | 'closed';
    priority: string;
    user: { id: number; name: string; email: string };
    replies: Reply[];
    created_at: string;
}

interface Props {
    ticket: Ticket;
}

export default function SupportShow({ ticket }: Props) {
    const { flash } = usePage().props as any;
    const [currentStatus, setCurrentStatus] = useState<'open' | 'closed'>(ticket.status);

    const { data, setData, post, processing, errors } = useForm({ message: '' });
    const statusForm = useForm<{ status: 'open' | 'closed' }>({ status: ticket.status });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/support/${ticket.id}/reply`, {
            onSuccess: () => setData('message', ''),
        });
    };

    const handleStatusChange = (newStatus: string) => {
        const status = newStatus as 'open' | 'closed';
        setCurrentStatus(status);
        statusForm.post(`/admin/support/${ticket.id}/status`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Hỗ trợ khách hàng', href: '/admin/support' },
                { title: ticket.subject, href: `/admin/support/${ticket.id}` },
            ]}
        >
            <Head title={`Ticket: ${ticket.subject}`} />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/support">
                            <Button variant="outline" className="shadow-sm">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                            </Button>
                        </Link>
                        {flash?.success && (
                            <span className="px-3 py-2 bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-medium">
                                {flash.success}
                            </span>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg border p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Từ: <strong>{ticket.user.name}</strong> ({ticket.user.email})</p>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">{ticket.subject}</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Tạo: {new Date(ticket.created_at).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    Ưu tiên: {ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                </span>
                                <select
                                    value={currentStatus}
                                    onChange={(e) => {
                                        setCurrentStatus(e.target.value as 'open' | 'closed');
                                        statusForm.setData('status', e.target.value as 'open' | 'closed');
                                        handleStatusChange(e.target.value);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="open">Mở</option>
                                    <option value="closed">Đã đóng</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <p className="text-gray-800 whitespace-pre-wrap">{ticket.message}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Trả lời ({ticket.replies.length})</h2>
                        <div className="space-y-4 mb-6">
                            {ticket.replies.length > 0 ? (
                                ticket.replies.map((reply) => (
                                    <div key={reply.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">{reply.user.name}</p>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {new Date(reply.created_at).toLocaleString('vi-VN')}
                                        </p>
                                        <p className="text-gray-800 whitespace-pre-wrap">{reply.message}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">Chưa có trả lời nào</p>
                            )}
                        </div>

                        {currentStatus === 'open' ? (
                            <form onSubmit={handleSubmit} className="border-t pt-6 space-y-3">
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Nhập câu trả lời..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1 resize-none"
                                    rows={4}
                                />
                                {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
                                <Button type="submit" disabled={processing} className="w-full">
                                    <Send className="w-4 h-4 mr-2" /> Gửi trả lời
                                </Button>
                            </form>
                        ) : (
                            <div className="border-t pt-6 text-center text-gray-500">
                                <p>Ticket này đã được đóng, không thể trả lời thêm.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}