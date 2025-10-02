import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

export default function ShowProduct({ product, allCategories }: any) {
    const [selectedCategories, setSelectedCategories] = useState(product.categories.map((cat: any) => cat.id));

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin Dashboard', href: '/admin/dashboard' },
                { title: 'Sản phẩm chờ duyệt', href: '/admin/products/pending' },
                { title: product.name, href: `/admin/products/${product.id}` },
            ]}
        >
            <Head title={`Chi tiết: ${product.name}`} />
            <div className="max-w-5xl mx-auto p-8 flex flex-col md:flex-row gap-8 bg-white rounded shadow">
                {/* Khung ảnh bên trái */}
                <div className="md:w-1/2 flex flex-col items-center">
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded border mb-4 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[0]?.url}
                                alt={product.images[0]?.alt_text}
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-400">Chưa có ảnh</span>
                        )}
                    </div>
                    {/* Ảnh phụ */}
                    <div className="flex gap-2 mt-2">
                        {product.images && product.images.map((img: any, idx: number) => (
                            <img
                                key={img.id}
                                src={img.url}
                                alt={img.alt_text}
                                className="w-16 h-16 object-cover rounded border"
                            />
                        ))}
                    </div>
                </div>
                {/* Thông tin bên phải */}
                <div className="md:w-1/2 flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <div className="mb-2 text-gray-600">{product.brand?.name}</div>
                        <div className="mb-2 text-gray-600">Người bán: {product.seller?.name}</div>
                        <div className="mb-2 text-gray-600">Bảo hành: {product.warranty_policy?.name || 'Không có'}</div>
                        <div className="mb-2 text-gray-800 font-semibold">
                            Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                        <div className="mb-2 text-gray-600">Tồn kho: {product.stock}</div>
                        <div className="mb-2 text-gray-600">Trạng thái: {product.status}</div>
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
                    {/* Phân loại danh mục */}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            router.post(`/admin/products/${product.id}/categories`, { categories: selectedCategories });
                        }}
                        className="mb-6"
                    >
                        <label className="block font-semibold mb-2">Phân loại danh mục:</label>
                        <select
                            multiple
                            value={selectedCategories}
                            onChange={e => {
                                const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                                setSelectedCategories(options);
                            }}
                            className="border rounded px-3 py-2 w-full"
                        >
                            {allCategories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Lưu danh mục</button>
                    </form>
                    {/* Nút thao tác */}
                    <div className="flex gap-4 mt-4">
                        <Link
                            href="/admin/products/pending"
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
