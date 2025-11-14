import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import PublicLayout from '@/layouts/public-layout';
import { type LiveStream, type ZegoConfig } from '@/types/live';
import {useZego} from '@/hooks/useZego';
import { usePage } from '@inertiajs/react';
import { Users, Clock, User } from 'lucide-react';
import axios from 'axios';

interface Props {
    liveStream: LiveStream;
    zegoConfig: ZegoConfig;
}

export default function LiveViewer({ liveStream, zegoConfig }: Props) {
    const { auth } = usePage().props as any;
    const videoRef = useRef<HTMLDivElement>(null);
    const { createLiveStream, isInitialized, error } = useZego(zegoConfig);
    const [zegoInstance, setZegoInstance] = useState<any>(null);
    const [localError, setLocalError] = useState<string | null>(null);

    //UI notifications state for ended stream
    const [streamEnded, setStreamEnded] = useState(false);
    const [redirectTimerId, setRedirectTimerId] = useState<number | null>(null);

    useEffect(() => {
        console.log('LiveViewer useEffect:', {
            isInitialized,
            hasAuth: !!auth?.user,
            roomId: liveStream.room_id,
            error
        });

        if (error) {
            setLocalError(`Zego error: ${error}`);
            return;
        }

        if (isInitialized && videoRef.current && !zegoInstance) {
            try {
                // Tạo user info (guest nếu không đăng nhập)
                const userInfo = auth?.user ? {
                    userID: auth.user.id.toString(),
                    userName: auth.user.name,
                } : {
                    userID: `guest_${Date.now()}`,
                    userName: 'Guest User',
                };

                console.log('Creating live stream viewer with user:', userInfo);

                const instance = createLiveStream(
                    videoRef.current,
                    liveStream.room_id,
                    userInfo,
                    false // isHost = false for viewer
                );
                setZegoInstance(instance);
                setLocalError(null);
            } catch (err) {
                console.error('Error joining live stream:', err);
                setLocalError(err instanceof Error ? err.message : 'Failed to join live stream');
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
            // Clear any redirect timers
            if (redirectTimerId) {
                clearTimeout(redirectTimerId);
            }
        };
    }, [isInitialized, liveStream.room_id, auth?.user, error]);

    useEffect(() => {
        let mounted = true;
        const checkStatus = async () => {
            try {
                const res = await axios.get(`/api/live/${liveStream.id}/status`);
                if (!mounted) return;
                if (res.data?.status && res.data.status !== 'live') {
                    if (zegoInstance && typeof zegoInstance.destroy === 'function') {
                        try { zegoInstance.destroy(); } catch (e) { /* ignore */  }
                    }
                    setStreamEnded(true);

                    const id = window.setTimeout(() => {
                        window.location.href = '/live';
                    }, 3500);
                    setRedirectTimerId(id as unknown as number);
                }
            } catch (err) {
                console.warn('Failed to check live status', err);
            }
        };

        checkStatus();
        const id = setInterval(checkStatus, 5000);
        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, [liveStream.id, zegoInstance]);

    const handleDismissNotification = () => {
        setStreamEnded(false);
        if (redirectTimerId) {
            clearTimeout(redirectTimerId);
            setRedirectTimerId(null);
        }
    };

    const handleGoNow = () => {
        if (redirectTimerId) {
            clearTimeout(redirectTimerId);
        }
        window.location.href = '/live';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <PublicLayout>
            {streamEnded && (
                <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4'>
                    <div className='bg-yellow-50 border border-yellow-200 text-yellow-900 px-4 py-3 rounded-lg shadow-md flex items-center justify-between'>
                        <div>
                            <strong className='block'>Buổi live đã kết thúc</strong>
                            <span className='text-sm'>Bạn sẽ được chuyển về trang Live Streams trong vài giây.</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button onClick={handleDismissNotification} className='px-3 py-1 text-sm bg-white rounded border'>Đóng</button>
                            <button onClick={handleGoNow} className='px-3 py-1 text-sm bg-red-600 text-white rounded'>Quay về</button>
                        </div>   
                    </div>

                </div>
            )}
            <Head title={`Live: ${liveStream.title}`} />
            
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between">
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
                                    <User className="h-4 w-4" />
                                    <span>Người bán: {liveStream.seller_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{liveStream.viewer_count} người xem</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        {liveStream.started_at ? formatDate(liveStream.started_at) : formatDate(liveStream.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error display */}
                {(error || localError) && (
                    <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        <p>Lỗi: {error || localError}</p>
                        <p className="text-sm mt-1">
                            Debug info: AppID = {zegoConfig.appID} (type: {typeof zegoConfig.appID})
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
                                    <p>Đang tham gia live stream...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!auth?.user && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                        <p>Bạn cần <a href="/login" className="underline font-medium">đăng nhập</a> để tham gia chat trong live stream.</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}