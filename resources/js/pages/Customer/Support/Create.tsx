import { useForm, Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SupportCreate() {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        message: '',
        priority: 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customer/support');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang chủ', href: '/customer/dashboard' },
                { title: 'Hỗ trợ', href: '/customer/support' },
                { title: 'Tạo ticket mới', href: '/customer/support/create' },
            ]}
        >
            <Head title="Tạo ticket hỗ trợ mới" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/customer/support">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg border p-8 space-y-6">
                        <header className="border-b pb-4">
                            <h1 className="text-3xl font-extrabold text-gray-800">Tạo ticket hỗ trợ mới</h1>
                            <p className="text-gray-500 text-sm mt-2">Mô tả chi tiết vấn đề để chúng tôi hỗ trợ bạn tốt hơn</p>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-semibold mb-2 text-gray-700">Chủ đề *</label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder="Nhập chủ đề của ticket..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                />
                                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold mb-2 text-gray-700">Ưu tiên *</label>
                                <select
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                >
                                    <option value="low">Thấp</option>
                                    <option value="medium">Trung bình</option>
                                    <option value="high">Cao</option>
                                </select>
                                {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold mb-2 text-gray-700">Mô tả chi tiết *</label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AC1EF] resize-none"
                                />
                                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={processing} className="flex-1 bg-[#0AC1EF] hover:bg-[#09b3db]">
                                    {processing ? 'Đang gửi...' : 'Tạo ticket'}
                                </Button>
                                <Link href="/customer/support" className="flex-1">
                                    <Button variant="outline" className="w-full">Hủy</Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}