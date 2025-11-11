import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useRef, useState } from 'react';

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

    const handleSubmit = () => {
        // Kiểm tra điều kiện trước khi submit
        const hasSpecs = product.specs && product.specs.length > 0;
        const hasVariants = product.variants && product.variants.length > 0;
        const hasImages = product.images && product.images.length > 0;

        if (!hasSpecs || !hasVariants || !hasImages) {
            alert('Sản phẩm phải có ít nhất 1 ảnh, 1 thông số kỹ thuật và 1 biến thể trước khi đăng!');
            return;
        }

        if (confirm('Bạn có chắc muốn đăng sản phẩm này? Sau khi đăng, khách hàng sẽ có thể xem và mua sản phẩm này.')) {
            router.post(`/seller/products/${product.id}/submit`);
        }
    };

    // Thêm state loading cho ảnh
    const [imageLoading, setImageLoading] = useState(true);

    // Hàm để hiển thị trạng thái sản phẩm
    const getStatusDisplay = () => {
        switch (product.status) {
            case 'draft':
                return <div className="text-gray-600 font-semibold mb-2">📝 Bản nháp - Chưa đăng</div>;
            case 'pending':
                return <div className="text-yellow-600 font-semibold mb-2">⏳ Đang chờ duyệt</div>;
            case 'approved':
                return <div className="text-green-600 font-semibold mb-2">✅ Đã đăng - Khách hàng có thể xem</div>;
            case 'rejected':
                return <div className="text-red-600 font-semibold mb-2">❌ Bị từ chối</div>;
            default:
                return <div className="text-gray-600 font-semibold mb-2">❓ Trạng thái không xác định</div>;
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
                { title: 'Seller Dashboard', href: '/seller/dashboard' },
                { title: 'View Products', href: '/seller/products' },
                { title: product.name, href: `/seller/products/${product.id}/preview` },
            ]}
        >
            <Head title={`Xem trước: ${product.name}`} />
            <div className="max-w-5xl mx-auto p-8 flex flex-col md:flex-row gap-8 bg-white rounded shadow">
                {/* Khung ảnh bên trái */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded border mb-4 overflow-hidden relative">
                        {images.length > 0 ? (
                            <>
                                {imageLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                                <img
                                    src={images[mainIndex]?.url}
                                    alt={images[mainIndex]?.alt_text}
                                    className="object-contain w-full h-full transition-all duration-300"
                                    onLoad={() => setImageLoading(false)}
                                    onError={(e) => {
                                        setImageLoading(false);
                                        e.currentTarget.src = '/images/no-image.png';
                                    }}
                                />
                            </>
                        ) : (
                            <div className="text-center text-gray-400">
                                <div className="text-4xl mb-2">📷</div>
                                <span>Chưa có ảnh sản phẩm</span>
                            </div>
                        )}
                    </div>
                    {/* Ảnh phụ */}
                    <div className="flex gap-2 mt-2">
                        {images.map((img: any, idx: number) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={img.alt_text}
                                className={`w-16 h-16 object-cover rounded border cursor-pointer transition-all duration-200 ${mainIndex === idx ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => handleThumbClick(idx)}
                            />
                        ))}
                    </div>
                </div>
                {/* Thông tin bên phải */}
                <div className="md:w-1/2 flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <div className="mb-2 text-gray-600">{product.brand?.name}</div>
                        {getStatusDisplay()}
                        <div className="text-2xl font-bold text-blue-600 mb-4">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                    </div>

                    {/* Mô tả sản phẩm */}
                    {product.description && (
                        <div>
                            <div className="font-semibold mb-2">Mô tả:</div>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {/* Thông số kỹ thuật */}
                    <div>
                        <div className="font-semibold mb-2 flex items-center gap-2">
                            📋 Thông số kỹ thuật:
                            {(!product.specs || product.specs.length === 0) && (
                                <span className="text-red-500 text-sm">⚠️ Thiếu</span>
                            )}
                        </div>
                        <div className="border rounded">
                            {product.specs && product.specs.length > 0 ? (
                                <table className="w-full text-sm">
                                    <tbody>
                                        {product.specs.map((spec: any) => (
                                            <tr key={spec.id} className="border-b last:border-b-0">
                                                <td className="py-2 px-3 font-medium bg-gray-50 w-1/3">{spec.key}</td>
                                                <td className="py-2 px-3">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-gray-400 py-4 text-center">
                                    Chưa có thông số kỹ thuật. 
                                    <Link href={`/seller/products/${product.id}/specs`} className="text-blue-600 hover:underline ml-1">
                                        Thêm ngay →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Biến thể */}
                    <div>
                        <div className="font-semibold mb-2 flex items-center gap-2">
                            🏷️ Các biến thể:
                            {(!product.variants || product.variants.length === 0) && (
                                <span className="text-red-500 text-sm">⚠️ Thiếu</span>
                            )}
                        </div>
                        <div className="border rounded">
                            {product.variants && product.variants.length > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="py-2 px-3 text-left">Tên biến thể</th>
                                            <th className="py-2 px-3 text-left">Giá cộng thêm</th>
                                            <th className="py-2 px-3 text-left">Tồn kho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.variants.map((variant: any) => (
                                            <tr key={variant.id} className="border-b last:border-b-0">
                                                <td className="py-2 px-3">{variant.variant_name}</td>
                                                <td className="py-2 px-3">
                                                    {variant.additional_price > 0 ? `+${new Intl.NumberFormat('vi-VN').format(variant.additional_price)}₫` : '0₫'}
                                                </td>
                                                <td className="py-2 px-3">{variant.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-gray-400 py-4 text-center">
                                    Chưa có biến thể nào. 
                                    <Link href={`/seller/products/${product.id}/variants`} className="text-blue-600 hover:underline ml-1">
                                        Thêm ngay →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút thao tác */}
                    <div className="flex flex-col gap-3 mt-6">
                        {/* Hiển thị thông báo nếu thiếu điều kiện */}
                        {!canSubmit() && product.status === 'draft' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800 text-sm">
                                ⚠️ Để đăng sản phẩm, bạn cần có đầy đủ: ảnh sản phẩm, thông số kỹ thuật và biến thể.
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleSubmit}
                                className={`px-6 py-3 rounded font-semibold transition-colors ${
                                    canSubmit() 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                disabled={!canSubmit()}
                            >
                                {product.status === 'approved' ? '✅ Đã đăng' : '🚀 Đăng sản phẩm'}
                            </button>

                            <Link
                                href="/seller/products"
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded hover:bg-gray-300 font-semibold"
                            >
                                ← Quay lại
                            </Link>
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-2 text-sm">
                            <Link
                                href={`/seller/products/${product.id}/specs`}
                                className="text-blue-600 hover:underline"
                            >
                                📋 Quản lý thông số
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link
                                href={`/seller/products/${product.id}/variants`}
                                className="text-blue-600 hover:underline"
                            >
                                🏷️ Quản lý biến thể
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link
                                href={`/seller/products/${product.id}/edit`}
                                className="text-blue-600 hover:underline"
                            >
                                ✏️ Sửa sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
