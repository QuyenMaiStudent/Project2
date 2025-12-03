import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { type LiveStream } from '@/types/live';
import { Users, Clock, Play } from 'lucide-react';

interface Props {
    liveStreams: LiveStream[];
}

export default function LiveList({ liveStreams }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <PublicLayout>
            <Head title="Live Streams" />

            {/* Bỏ min-h-screen ở đây — layout đã xử lý min-h-screen */}
            <div className="max-w-7xl mx-auto p-6">
                {/* title với accent màu chính */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-1 rounded bg-[#0AC1EF]"></div>
                        <h1 className="text-3xl font-bold text-gray-800">Live Streams</h1>
                    </div>
                    <p className="text-gray-600">Xem các buổi live stream đang diễn ra</p>
                </div>

                {liveStreams.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto mb-4 w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br from-[#0AC1EF] to-[#25d3f6] shadow-lg">
                            <Play className="h-14 w-14 text-white" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">Không có live stream nào</h3>
                        <p className="text-gray-600">Hiện tại không có buổi live stream nào đang diễn ra.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveStreams.map((stream) => (
                            <div
                                key={stream.id}
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition-all border border-gray-100"
                            >
                                {/* Thumbnail placeholder */}
                                <div className="relative aspect-video bg-gray-900">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="rounded-full p-1 bg-gradient-to-br from-[#0AC1EF] to-[#25d3f6]">
                                            <Play className="h-14 w-14 text-white opacity-95" />
                                        </div>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                                            🔴 LIVE
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                        <span className="px-2 py-1 bg-[#0AC1EF] text-white text-xs rounded">
                                            {stream.viewer_count} người xem
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {stream.title}
                                    </h3>
                                    
                                    {stream.description && (
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {stream.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-700">
                                            {stream.seller_name}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            <span className="text-sm text-gray-500">
                                                {stream.started_at ? formatDate(stream.started_at) : formatDate(stream.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/live/${stream.id}`}
                                        className="block w-full bg-[#0AC1EF] text-white text-center py-2 rounded-md hover:bg-[#089fcf] transition-colors"
                                    >
                                        Xem Live
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}