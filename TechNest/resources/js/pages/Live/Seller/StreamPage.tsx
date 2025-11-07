import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type LiveStream, type ZegoConfig } from '@/types/live';
import { useZego } from '@/hooks/useZego';
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Users, Clock, X } from 'lucide-react';

interface Props {
    liveStream: LiveStream;
    zegoConfig: ZegoConfig;
}

export default function StreamPage({ liveStream, zegoConfig }: Props) {
    const { auth } = usePage().props as any;
    const videoRef = useRef<HTMLDivElement>(null);
    const { createLiveStream, isInitialized, error } = useZego(zegoConfig);
    const { post } = useForm();
    const [localError, setLocalError] = useState<string | null>(null);
    const [zegoInstance, setZegoInstance] = useState<any>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Seller Dashboard',
            href: '/seller/dashboard',
        },
        {
            title: 'Live Stream',
            href: '/seller/live',
        },
        {
            title: liveStream.title,
            href: `/seller/live/${liveStream.id}/stream`,
        },
    ];

    useEffect(() => {
        console.log('StreamPage useEffect:', { 
            isInitialized, 
            roomId: liveStream.room_id, 
            user: auth.user,
            error 
        });
        
        if (error) {
            setLocalError(`Zego initialization error: ${error}`);
            return;
        }
        
        if (isInitialized && videoRef.current && auth.user && !zegoInstance) {
            try {
                console.log('Creating live stream for seller...');
                setLocalError(null);
                
                const instance = createLiveStream(
                    videoRef.current,
                    liveStream.room_id,
                    {
                        userID: auth.user.id.toString(),
                        userName: auth.user.name,
                    },
                    true // isHost = true for seller
                );
                
                setZegoInstance(instance);
                console.log('Live stream created successfully');
            } catch (err) {
                console.error('Error creating live stream:', err);
                setLocalError(err instanceof Error ? err.message : 'Failed to create live stream');
            }
        }

        // Cleanup function
        return () => {
            if (zegoInstance) {
                try {
                    zegoInstance.destroy();
                } catch (err) {
                    console.error('Error destroying Zego instance:', err);
                }
            }
        };
    }, [isInitialized, liveStream.room_id, auth.user, error]);

    const handleEndStream = () => {
        if (confirm('Bạn có chắc chắn muốn kết thúc live stream?')) {
            // Cleanup Zego instance before ending stream
            if (zegoInstance) {
                try {
                    zegoInstance.destroy();
                } catch (err) {
                    console.error('Error destroying Zego instance:', err);
                }
            }
            post(`/seller/live/${liveStream.id}/end`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Live: ${liveStream.title}`} />
            
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-semibold text-gray-800">{liveStream.title}</h1>
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200">
                                    🔴 LIVE
                                </span>
                            </div>
                            
                            {liveStream.description && (
                                <p className="text-gray-600 mb-3">{liveStream.description}</p>
                            )}
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{liveStream.viewer_count} viewers</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Bắt đầu: {liveStream.started_at ? formatDate(liveStream.started_at) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={handleEndStream}
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Kết thúc Live
                        </Button>
                    </div>
                </div>

                {/* Error display */}
                {(error || localError) && (
                    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p>Lỗi: {error || localError}</p>
                        <p className="text-sm mt-2">
                            Hãy kiểm tra:
                            <br />- Zego App ID và Server Secret đã được cấu hình đúng
                            <br />- Kết nối internet ổn định
                            <br />- Camera và microphone đã được cho phép truy cập
                        </p>
                    </div>
                )}

                {/* Loading state */}
                {!isInitialized && !error && !localError && (
                    <div className="bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
                        <p>Đang khởi tạo Zego SDK...</p>
                    </div>
                )}

                {/* Video container */}
                <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                    <div 
                        ref={videoRef}
                        className="w-full aspect-video"
                        style={{ minHeight: '400px' }}
                    >
                        {!isInitialized && !error && !localError && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                    <p>Đang khởi tạo live stream...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stream info */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Thông tin Stream</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Room ID:</span>
                            <span className="ml-2 font-mono text-gray-600">{liveStream.room_id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="ml-2 text-red-600 font-medium">{liveStream.status}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Share Link:</span>
                            <span className="ml-2 text-blue-600 break-all">
                                {window.location.origin}/live/{liveStream.id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}