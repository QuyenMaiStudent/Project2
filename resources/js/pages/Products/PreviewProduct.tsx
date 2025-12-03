import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useRef, useState } from 'react';
import { Star, Share2, Heart, ShoppingCart, Info } from 'lucide-react';

export default function PreviewProduct({ product }: any) {
    const images = product.images || [];
    const [mainIndex, setMainIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Tự động chuyển ảnh chính mỗi 3s
    useEffect(() => {
        if (images.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setMainIndex(idx => (idx + 1) % images.length);
        }, 3000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [images.length]);

    // Khi click ảnh phụ
    const handleThumbClick = (idx: number) => {
        setMainIndex(idx);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setMainIndex(i => (i + 1) % images.length);
            }, 3000);
        }
    };

    // UI notification + confirmation modal (thay alert/confirm)
    const [notice, setNotice] = useState<{ type: 'error' | 'info' | 'success'; message: string } | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSubmit = () => {
        // Kiểm tra điều kiện trước khi submit
        const hasSpecs = product.specs && product.specs.length > 0;
        const hasVariants = product.variants && product.variants.length > 0;
        const hasImages = product.images && product.images.length > 0;

        if (!hasSpecs || !hasVariants || !hasImages) {
            setNotice({
                type: 'error',
                message: 'Sản phẩm phải có ít nhất 1 ảnh, 1 thông số kỹ thuật và 1 biến thể trước khi đăng!'
            });
            return;
        }

        // Mở modal xác nhận
        setConfirmOpen(true);
    };

    const confirmSubmit = () => {
        setConfirmOpen(false);
        // gọi API submit, hiển thị trạng thái qua notice
        router.post(
            `/seller/products/${product.id}/submit`,
            {}, // empty payload
            {
                onStart: () => {
                    setNotice({ type: 'info', message: 'Đang gửi yêu cầu...' });
                },
                onError: () => {
                    setNotice({ type: 'error', message: 'Có lỗi khi gửi yêu cầu. Vui lòng thử lại.' });
                },
                onSuccess: () => {
                    setNotice({ type: 'success', message: 'Sản phẩm đã được gửi/đăng thành công.' });
                }
            }
        );
    };

    // Thêm state loading cho ảnh
    const [imageLoading, setImageLoading] = useState(true);

    // Hàm để hiển thị trạng thái sản phẩm
    const getStatusDisplay = () => {
        switch (product.status) {
            case 'draft':
                return <div className="inline-flex items-center gap-2 text-sm text-gray-700"><span className="px-2 py-1 rounded bg-gray-100">Bản nháp</span></div>;
            case 'pending':
                return <div className="inline-flex items-center gap-2 text-sm text-yellow-700"><span className="px-2 py-1 rounded bg-yellow-50">Đang chờ duyệt</span></div>;
            case 'approved':
                return <div className="inline-flex items-center gap-2 text-sm text-green-700"><span className="px-2 py-1 rounded bg-green-50">Đã đăng</span></div>;
            case 'rejected':
                return <div className="inline-flex items-center gap-2 text-sm text-red-700"><span className="px-2 py-1 rounded bg-red-50">Bị từ chối</span></div>;
            default:
                return <div className="inline-flex items-center gap-2 text-sm text-gray-600"><span className="px-2 py-1 rounded bg-gray-50">Không xác định</span></div>;
        }
    };

    // Kiểm tra có thể đăng sản phẩm không
    const canSubmit = () => {
        const hasSpecs = product.specs && product.specs.length > 0;
        const hasVariants = product.variants && product.variants.length > 0;
        const hasImages = product.images && product.images.length > 0;
        const isDraft = product.status === 'draft';
        
        return hasSpecs && hasVariants && hasImages && isDraft;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người bán', href: '/seller/dashboard' },
                { title: 'Xem sản phẩm', href: '/seller/products' },
                { title: product.name, href: `/seller/products/${product.id}/preview` },
            ]}
        >
            <Head title={`Xem trước: ${product.name}`} />
            <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen rounded-lg">
                <div className="bg-white rounded-xl shadow-md overflow-hidden grid md:grid-cols-3 gap-6 p-6">
                    {/* Left: images */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-full aspect-[4/4] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative border">
                            {images.length > 0 ? (
                                <>
                                    {imageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    )}
                                    <img
                                        src={images[mainIndex]?.url}
                                        alt={images[mainIndex]?.alt_text}
                                        className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                                        onLoad={() => setImageLoading(false)}
                                        onError={(e) => {
                                            setImageLoading(false);
                                            e.currentTarget.src = '/images/no-image.png';
                                        }}
                                    />
                                    {/* quick badges */}
                                    <div className="absolute top-3 left-3 space-y-2">
                                        {product.is_hot && <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">Hot</span>}
                                        {product.is_new && <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Mới</span>}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400 p-6">
                                    <div className="text-4xl mb-2">📷</div>
                                    <span>Chưa có ảnh</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="mt-4 w-full overflow-x-auto">
                            <div className="flex gap-3 px-1">
                                {images.length > 0 ? images.map((img: any, idx: number) => (
                                    <button
                                        key={img.id}
                                        onClick={() => handleThumbClick(idx)}
                                        className={`flex-none w-20 h-20 rounded-lg overflow-hidden border transition-shadow ${mainIndex === idx ? 'ring-2 ring-blue-500 shadow' : 'ring-0'}`}
                                    >
                                        <img src={img.url} alt={img.alt_text} className="w-full h-full object-cover" />
                                    </button>
                                )) : (
                                    <div className="text-sm text-gray-400">Không có ảnh phụ</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Center: main info */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        {/* header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="text-sm text-gray-600">{product.brand?.name}</div>
                                    {getStatusDisplay()}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-blue-600">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </div>
                                {product.compare_at_price && (
                                    <div className="text-sm text-gray-500 line-through mt-1">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.compare_at_price)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* short description + chips */}
                        {product.description && (
                            <div className="text-gray-700 leading-relaxed">
                                {product.description}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {(product.tags || []).slice(0, 6).map((t: string) => (
                                <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">{t}</span>
                            ))}
                        </div>

                        {/* specs prettier */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4 bg-gradient-to-b from-white to-gray-50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="font-semibold">Thông số kỹ thuật</div>
                                    <Link href={`/seller/products/${product.id}/specs`} className="text-xs text-blue-600">Quản lý</Link>
                                </div>

                                {product.specs && product.specs.length > 0 ? (
                                    <div className="overflow-hidden rounded">
                                        <table className="w-full text-sm table-fixed">
                                            <colgroup>
                                                <col style={{ width: '150px' }} />
                                                <col />
                                            </colgroup>
                                            <tbody>
                                                {product.specs.map((spec: any) => (
                                                    <tr key={spec.id} className="odd:bg-white even:bg-gray-50">
                                                        <th className="text-left align-top py-2 pr-4 text-sm text-gray-600 font-normal">{spec.key}</th>
                                                        <td className="text-left py-2 text-sm font-medium text-gray-800 break-words">{spec.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400">Chưa có thông số — <Link href={`/seller/products/${product.id}/specs`} className="text-blue-600">Thêm ngay</Link></div>
                                )}
                            </div>

                            <div className="rounded-lg border p-4 bg-white">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="font-semibold">Biến thể</div>
                                    <Link href={`/seller/products/${product.id}/variants`} className="text-xs text-blue-600">Quản lý</Link>
                                </div>

                                {product.variants && product.variants.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {product.variants.map((v: any) => (
                                            <div key={v.id} className="flex items-center justify-between p-2 rounded border hover:shadow-sm">
                                                <div>
                                                    <div className="text-sm font-medium">{v.variant_name}</div>
                                                    <div className="text-xs text-gray-500">{v.sku || ''}</div>
                                                </div>
                                                <div className="text-sm text-gray-700 text-right">
                                                    <div>{v.additional_price > 0 ? `+${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.additional_price)}` : '0₫'}</div>
                                                    <div className="text-xs text-gray-400">Kho: {v.stock}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-400">Chưa có biến thể — <Link href={`/seller/products/${product.id}/variants`} className="text-blue-600">Thêm ngay</Link></div>
                                )}
                            </div>
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={handleSubmit}
                                disabled={!canSubmit()}
                                className={`px-5 py-3 rounded-lg font-semibold transition-colors ${canSubmit() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                            >
                                {product.status === 'approved' ? 'Đã đăng' : 'Đăng sản phẩm'}
                            </button>

                            <Link href={`/seller/products/${product.id}/edit`} className="px-4 py-3 rounded-lg border bg-white inline-flex items-center gap-2 hover:shadow">
                                <ShoppingCart className="w-4 h-4 text-gray-600" /> Sửa
                            </Link>

                            <Link href="/seller/products" className="px-4 py-3 rounded-lg border bg-white inline-flex items-center gap-2 hover:shadow">
                                ← Quay lại
                            </Link>
                        </div>

                        {/* notice */}
                        {notice && (
                            <div className={`mt-3 rounded p-3 text-sm ${notice.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : notice.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
                                <div className="flex justify-between items-start">
                                    <div>{notice.message}</div>
                                    <button onClick={() => setNotice(null)} className="ml-4 text-gray-500 hover:text-gray-700">✕</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Confirmation Modal */}
                {confirmOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold">Xác nhận đăng sản phẩm</h3>
                                <p className="text-sm text-gray-700 mt-2">Bạn có chắc muốn đăng sản phẩm này? Sau khi đăng, khách hàng sẽ có thể xem và mua sản phẩm này.</p>
                                <div className="mt-4 flex justify-end gap-3">
                                    <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded bg-gray-100">Hủy</button>
                                    <button onClick={confirmSubmit} className="px-4 py-2 rounded bg-blue-600 text-white">Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
