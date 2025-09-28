import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    primary_image?: { url: string };
    images?: { id: number; url: string; is_primary: boolean }[];
}

interface Props {
    products: Product[];
}

export default function UploadImages({ products }: Props) {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

    const handleUpload = () => {
        if (!selectedProductId || !selectedImages || selectedImages.length === 0) {
            alert('Vui lòng chọn sản phẩm và ít nhất 1 ảnh!');
            return;
        }
        const formData = new FormData();
        Array.from(selectedImages).forEach((file, idx) => {
            formData.append(`images[${idx}]`, file);
        });
        router.post(`/seller/products/${selectedProductId}/upload-images`, formData, {
            forceFormData: true,
            onFinish: () => setSelectedImages(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Upload Product Images" />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Thêm ảnh cho sản phẩm</h1>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Chọn sản phẩm:</label>
                    <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedProductId ?? ''}
                        onChange={e => setSelectedProductId(Number(e.target.value))}
                    >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Chọn ảnh (có thể chọn nhiều):</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => setSelectedImages(e.target.files)}
                        className="w-full"
                    />
                </div>
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Thêm ảnh
                </button>
            </div>
        </AppLayout>
    );
}
