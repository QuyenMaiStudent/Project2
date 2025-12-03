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
    const { auth, flash, errors } = usePage().props as any;
    const success = flash?.success;
    const errorFlash = flash?.error;
    const videoRef = useRef<HTMLDivElement>(null);
    const { createLiveStream, isInitialized, error } = useZego(zegoConfig);
    const { post } = useForm();
    const [localError, setLocalError] = useState<string | null>(null);
    const [zegoInstance, setZegoInstance] = useState<any>(null);

    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [ending, setEnding] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Giao diện người bán',
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
        setShowEndConfirm(true);
    };

    const confirmEndStream = () => {
        setEnding(true);
        if (zegoInstance) {
            try {
                zegoInstance.destroy();
            } catch (err) {
                console.error("Error destroying Zego instance", err);
            }
        }
        post(`/seller/live/${liveStream.id}/end`, {
            onFinish: () => {
                setEnding(false);
                setShowEndConfirm(false);
            },
        });
    };

    const cancelEndStream = () => {
        setShowEndConfirm(false);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Live: ${liveStream.title}`} />

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
                            <button className="ml-auto text-lg leading-none hover:opacity-70" onClick={() => {/* noop - flash cleared server side */}}>×</button>
                        </div>
                    </div>
                )}

                {/* Validation / Zego errors */}
                {(error || localError) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        <p className="font-medium">Lỗi: {error || localError}</p>
                        <p className="text-sm mt-2">
                            Hãy kiểm tra cấu hình và quyền truy cập camera/microphone.
                        </p>
                    </div>
                )}
12
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-800">{liveStream.title}</h1>
                                {liveStream.description && (
                                    <p className="text-gray-600 mt-2">{liveStream.description}</p>
                                )}
                                <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{liveStream.viewer_count} người xem</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Bắt đầu: {liveStream.started_at ? formatDate(liveStream.started_at) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200">🔴 LIVE</span>
                                <Button 
                                    onClick={handleEndStream}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Kết thúc Live
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Video card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
                        <div className="bg-black">
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
                    </div>

                    {/* Stream info card */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Thông tin Stream</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">ID phòng:</span>
                                <span className="ml-2 font-mono text-gray-600">{liveStream.room_id}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Trạng thái:</span>
                                <span className="ml-2 text-red-600 font-medium">{liveStream.status}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Chia sẻ Link:</span>
                                <span className="ml-2 text-blue-600 break-all">
                                    {window.location.origin}/live/{liveStream.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showEndConfirm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    <div className='absolute inset-0 bg-black opacity-40' onClick={cancelEndStream}></div>
                    <div className='relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10'>
                        <h3 className='text-lg font-semibold mb-2'>Kết thúc Live</h3>
                        <p className='text-sm text-gray-600 mb-4'>Bạn có chắc muốn kết thúc buổi live này? Hành động này sẽ dừng phát trực tiếp và thông báo cho người xem.</p>
                        <div className='flex justify-end gap-3'>
                            <Button onClick={cancelEndStream} disabled={ending} className='bg-gray-100 text-gray-700'>Hủy</Button>
                            <Button onClick={confirmEndStream} variant='destructive' disabled={ending} className='bg-red-600 hover:bg-red-700 text-white'>
                                {ending ? 'Đang xử lý...' : 'Kết thúc Live'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}