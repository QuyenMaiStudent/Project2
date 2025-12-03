import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type LiveStream, type ZegoConfig } from '@/types/live';
import { Button } from '@/components/ui/button';
import { Plus, Video, Users, Calendar, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller/dashboard',
    },
    {
        title: 'Live Stream',
        href: '/seller/live',
    },
];

interface Props {
    liveStreams: LiveStream[];
    zegoConfig: ZegoConfig;
}

export default function DashboardLive({ liveStreams, zegoConfig }: Props) {
    const { auth, flash, errors: serverErrors } = usePage().props as any;
    const success = flash?.success;
    const errorFlash = flash?.error;

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/seller/live/start', {
            onSuccess: () => {
                setIsModalOpen(false);
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            live: 'bg-red-100 text-red-800 border-red-200',
            ended: 'bg-gray-100 text-gray-800 border-gray-200',
            scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
        };
        
        const labels = {
            live: 'Đang Live',
            ended: 'Đã kết thúc',
            scheduled: 'Đã lên lịch',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Live Stream Dashboard" />

            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                {/* Notification giống Category */}
                {(success || errorFlash) && (
                    <div className={`mb-4 p-5 rounded-lg shadow-sm border ${
                        success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    } text-base`}>
                        <div className="flex items-center">
                            <svg className={`w-5 h-5 mr-2 ${success ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                {success ? (
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                ) : (
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                )}
                            </svg>
                            <span>{success || errorFlash}</span>
                            <button className="ml-auto text-lg leading-none hover:opacity-70" onClick={() => { /* noop */ }}>×</button>
                        </div>
                    </div>
                )}

                {/* Validation errors */}
                {(errors && Object.keys(errors).length > 0) && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                        <ul className="list-disc list-inside">
                            {Object.values(errors).map((err, idx) => (
                                <li key={idx}>{String(err)}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-800">Live Stream Dashboard</h1>
                            <p className="text-gray-600 mt-1">Quản lý các buổi live stream của bạn</p>
                        </div>
                        
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#0AC1EF] hover:bg-[#09b3db] text-white"
                        >
                            <Video className="h-4 w-4 mr-2" />
                            Bắt đầu Live
                        </Button>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <Video className="h-8 w-8 text-red-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Tổng Live Streams</p>
                                    <p className="text-2xl font-semibold text-gray-800">{liveStreams.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-green-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Tổng Viewers</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {liveStreams.reduce((total, stream) => total + stream.viewer_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">Đang Live</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        {liveStreams.filter(stream => stream.status === 'live').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Streams List */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Lịch sử Live Streams</h2>
                        </div>
                        
                        <div className="p-6">
                            {liveStreams.length === 0 ? (
                                <div className="text-center py-8">
                                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có live stream nào</p>
                                    <p className="text-gray-400 text-sm">Bắt đầu live stream đầu tiên của bạn!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {liveStreams.map((stream) => (
                                        <div key={stream.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-medium text-gray-800">{stream.title}</h3>
                                                        {getStatusBadge(stream.status)}
                                                    </div>
                                                    
                                                    {stream.description && (
                                                        <p className="text-gray-600 mb-3">{stream.description}</p>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="h-4 w-4" />
                                                            <span>{stream.viewer_count} viewers</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                {stream.started_at ? formatDate(stream.started_at) : formatDate(stream.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    {stream.status === 'live' && (
                                                        <Link
                                                            href={`/seller/live/${stream.id}/stream`}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                                        >
                                                            Vào Live
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modal để tạo live stream mới */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Bắt đầu Live Stream</h3>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]"
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-[#0AC1EF] text-white rounded-md hover:bg-[#09b3db] disabled:opacity-50"
                                    >
                                        {processing ? 'Đang tạo...' : 'Bắt đầu Live'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}