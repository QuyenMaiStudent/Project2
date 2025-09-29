import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
}

interface Variant {
    id: number;
    variant_name: string;
    additional_price: number;
    stock: number;
}

interface Props {
    product: Product;
    variants: Variant[];
}

export default function ProductVariants({ product, variants }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ variant_name: string; additional_price: string; stock: string }>({
        variant_name: '',
        additional_price: '',
        stock: '',
    });

    const { data, setData, post, reset, errors } = useForm({
        variant_name: '',
        additional_price: '',
        stock: '',
    });

    // Thêm mới biến thể
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/seller/products/${product.id}/variants`, {
            onSuccess: () => reset(),
        });
    };

    // Bắt đầu sửa
    const startEdit = (variant: Variant) => {
        setEditingId(variant.id);
        setEditData({
            variant_name: variant.variant_name,
            additional_price: variant.additional_price.toString(),
            stock: variant.stock.toString(),
        });
    };

    // Lưu sửa
    const handleUpdate = (e: React.FormEvent, variant: Variant) => {
        e.preventDefault();
        router.put(
            `/seller/products/${product.id}/variants/${variant.id}`,
            editData,
            {
                onSuccess: () => setEditingId(null),
            }
        );
    };

    // Xóa
    const handleDelete = (variant: Variant) => {
        if (confirm('Bạn có chắc muốn xóa biến thể này?')) {
            router.delete(`/seller/products/${product.id}/variants/${variant.id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Seller Dashboard', href: '/seller/dashboard' },
                { title: 'View Products', href: '/seller/products' },
                { title: product.name, href: `/seller/products/${product.id}/variants` },
            ]}
        >
            <Head title={`Biến thể sản phẩm: ${product.name}`} />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Biến thể sản phẩm: {product.name}</h1>

                {/* Thêm mới */}
                <form onSubmit={handleSubmit} className="mb-8 flex gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên biến thể</label>
                        <input
                            type="text"
                            value={data.variant_name}
                            onChange={e => setData('variant_name', e.target.value)}
                            className="border rounded px-3 py-2 w-40"
                            required
                        />
                        {errors.variant_name && <div className="text-red-500 text-xs">{errors.variant_name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá cộng thêm</label>
                        <input
                            type="number"
                            value={data.additional_price}
                            onChange={e => setData('additional_price', e.target.value)}
                            className="border rounded px-3 py-2 w-32"
                            min={0}
                            required
                        />
                        {errors.additional_price && <div className="text-red-500 text-xs">{errors.additional_price}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tồn kho</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="border rounded px-3 py-2 w-24"
                            min={0}
                            required
                        />
                        {errors.stock && <div className="text-red-500 text-xs">{errors.stock}</div>}
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Thêm
                    </button>
                </form>

                {/* Danh sách biến thể */}
                <table className="w-full border rounded">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Tên biến thể</th>
                            <th className="py-2 px-3 text-left">Giá cộng thêm</th>
                            <th className="py-2 px-3 text-left">Tồn kho</th>
                            <th className="py-2 px-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    Chưa có biến thể nào.
                                </td>
                            </tr>
                        )}
                        {variants.map(variant =>
                            editingId === variant.id ? (
                                <tr key={variant.id} className="bg-yellow-50">
                                    <td className="py-2 px-3">
                                        <input
                                            type="text"
                                            value={editData.variant_name}
                                            onChange={e => setEditData({ ...editData, variant_name: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <input
                                            type="number"
                                            value={editData.additional_price}
                                            onChange={e => setEditData({ ...editData, additional_price: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                            min={0}
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <input
                                            type="number"
                                            value={editData.stock}
                                            onChange={e => setEditData({ ...editData, stock: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                            min={0}
                                        />
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        <button
                                            onClick={e => handleUpdate(e, variant)}
                                            className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                        >
                                            Hủy
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={variant.id}>
                                    <td className="py-2 px-3">{variant.variant_name}</td>
                                    <td className="py-2 px-3">{variant.additional_price}</td>
                                    <td className="py-2 px-3">{variant.stock}</td>
                                    <td className="py-2 px-3 text-center">
                                        <button
                                            onClick={() => startEdit(variant)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(variant)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
