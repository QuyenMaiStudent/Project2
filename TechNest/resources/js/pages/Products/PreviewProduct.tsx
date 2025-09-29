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
        if (confirm('Bạn có chắc muốn gửi sản phẩm này lên admin duyệt?')) {
            router.post(`/seller/products/${product.id}/submit`);
        }
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
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded border mb-4 overflow-hidden">
                        {images.length > 0 ? (
                            <img
                                src={images[mainIndex]?.url}
                                alt={images[mainIndex]?.alt_text}
                                className="object-contain w-full h-full transition-all duration-300"
                            />
                        ) : (
                            <span className="text-gray-400">Chưa có ảnh</span>
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
                        {product.status === 'pending' && (
                            <div className="text-yellow-600 font-semibold mb-2">Sản phẩm đang chờ admin duyệt</div>
                        )}
                        {product.status === 'approved' && (
                            <div className="text-green-600 font-semibold mb-2">Sản phẩm đã được duyệt</div>
                        )}
                    </div>
                    {/* Thông số kỹ thuật */}
                    <div>
                        <div className="font-semibold mb-1">Thông số kỹ thuật:</div>
                        <table className="w-full border rounded text-sm">
                            <tbody>
                                {product.specs && product.specs.length > 0 ? (
                                    product.specs.map((spec: any) => (
                                        <tr key={spec.id}>
                                            <td className="py-1 px-3 font-medium w-1/3">{spec.key}</td>
                                            <td className="py-1 px-3">{spec.value}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-gray-400 py-2 text-center">Chưa có thông số</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Biến thể */}
                    <div>
                        <div className="font-semibold mb-1">Các biến thể:</div>
                        <table className="w-full border rounded text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-3 text-left">Tên biến thể</th>
                                    <th className="py-2 px-3 text-left">Giá cộng thêm</th>
                                    <th className="py-2 px-3 text-left">Tồn kho</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.variants && product.variants.length > 0 ? (
                                    product.variants.map((variant: any) => (
                                        <tr key={variant.id}>
                                            <td className="py-2 px-3">{variant.variant_name}</td>
                                            <td className="py-2 px-3">{variant.additional_price}</td>
                                            <td className="py-2 px-3">{variant.stock}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-gray-400 py-2 text-center">Chưa có biến thể</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Nút thao tác */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            disabled={product.status === 'pending' || product.status === 'approved'}
                        >
                            Đăng sản phẩm
                        </button>
                        <Link
                            href="/seller/products"
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
                        >
                            Quay lại
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
