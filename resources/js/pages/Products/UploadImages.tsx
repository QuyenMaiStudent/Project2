import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller/dashboard',
    },
    {
        title: 'Upload Images',
        href: '/seller/products/upload-images',
    },
];

interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    primary_image?: ProductImage;
    images?: ProductImage[];
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLinks[];
    };
}

export default function UploadImages({ products }: Props) {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

    // Đảm bảo products.data luôn là mảng
    const productList = Array.isArray(products.data) ? products.data : [];

    const handleUpload = (productId: number) => {
        if (!selectedImages || selectedImages.length === 0) {
            alert('Vui lòng chọn ít nhất 1 ảnh!');
            return;
        }
        const formData = new FormData();
        Array.from(selectedImages).forEach((file, idx) => {
            formData.append(`images[${idx}]`, file);
        });
        router.post(`/seller/products/${productId}/upload-images`, formData, {
            forceFormData: true,
            onFinish: () => setSelectedImages(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Product Images" />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Thêm ảnh cho sản phẩm</h1>
                <div className="space-y-8">
                    {productList.length > 0 ? productList.map(product => (
                        <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="font-semibold text-lg flex-1">
                                    #{product.id} - {product.name}
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={e => {
                                        setSelectedProductId(product.id);
                                        setSelectedImages(e.target.files);
                                    }}
                                    className="w-56"
                                />
                                <button
                                    onClick={() => handleUpload(product.id)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    disabled={selectedProductId !== product.id || !selectedImages || selectedImages.length === 0}
                                >
                                    Thêm ảnh
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.images && product.images.length > 0 ? (
                                    product.images.map(img => (
                                        <div key={img.id} className="relative">
                                            <img
                                                src={img.url}
                                                alt=""
                                                className={`w-24 h-24 object-cover rounded border ${img.is_primary ? 'ring-2 ring-blue-500' : ''}`}
                                            />
                                            {img.is_primary && (
                                                <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                                    Đại diện
                                                </span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400 text-sm">Chưa có ảnh</span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="text-gray-500">Không có sản phẩm nào.</div>
                    )}
                </div>
                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                    {products.links && <Pagination links={products.links} />}
                </div>
            </div>
        </AppLayout>
    );
}

// Component phân trang
function Pagination({ links }: { links: PaginationLinks[] }) {
    return (
        <nav className="flex gap-1">
            {links.map((link, idx) =>
                link.url ? (
                    <Link
                        key={idx}
                        href={link.url}
                        className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-100`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={idx}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </nav>
    );
}
