import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

// format money: drop trailing .00 and add " đ"
const formatMoney = (v: any) => {
    if (v === null || v === undefined || v === '') return '';
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    if (Math.abs(n - Math.round(n)) < 1e-9) {
        return Math.round(n).toLocaleString('vi-VN') + ' đ';
    }
    return n.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' đ';
};

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
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Biến thể sản phẩm: {product.name}</h1>

                {/* Thêm mới - mỗi ô 1 hàng, ô nhập to hơn */}
                <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên biến thể</label>
                        <input
                            type="text"
                            value={data.variant_name}
                            onChange={e => setData('variant_name', e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                        {errors.variant_name && <div className="text-red-500 text-xs mt-1">{errors.variant_name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá cộng thêm</label>
                        <input
                            type="number"
                            value={data.additional_price}
                            onChange={e => setData('additional_price', e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                            min={0}
                            required
                        />
                        {errors.additional_price && <div className="text-red-500 text-xs mt-1">{errors.additional_price}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tồn kho</label>
                        <input
                            type="number"
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                            min={0}
                            required
                        />
                        {errors.stock && <div className="text-red-500 text-xs mt-1">{errors.stock}</div>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Thêm
                        </button>
                    </div>
                </form>

                {/* Danh sách biến thể - bảng mở rộng */}
                <div className="bg-white rounded border">
                  <table className="w-full">
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
                        {variants.map(variant => (
                            editingId === variant.id ? (
                                <tr key={variant.id} className="bg-yellow-50 align-top">
                                    <td className="py-2 px-3">
                                        <label className="block text-xs text-gray-500 mb-1">Tên biến thể</label>
                                        <input
                                            type="text"
                                            value={editData.variant_name}
                                            onChange={e => setEditData({ ...editData, variant_name: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <label className="block text-xs text-gray-500 mb-1">Giá cộng thêm</label>
                                        <input
                                            type="number"
                                            value={editData.additional_price}
                                            onChange={e => setEditData({ ...editData, additional_price: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                            min={0}
                                        />
                                    </td>
                                    <td className="py-2 px-3">
                                        <label className="block text-xs text-gray-500 mb-1">Tồn kho</label>
                                        <input
                                            type="number"
                                            value={editData.stock}
                                            onChange={e => setEditData({ ...editData, stock: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                            min={0}
                                        />
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        <div className="inline-flex items-center space-x-2">
                                            <button
                                                onClick={e => handleUpdate(e, variant)}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Lưu
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={variant.id}>
                                    <td className="py-2 px-3">{variant.variant_name}</td>
                                    <td className="py-2 px-3">{formatMoney(variant.additional_price)}</td>
                                    <td className="py-2 px-3">{variant.stock}</td>
                                    <td className="py-2 px-3 text-center">
                                        <div className="inline-flex items-center space-x-2 justify-center">
                                            <button
                                                onClick={() => startEdit(variant)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(variant)}
                                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ))}
                     </tbody>
                  </table>
                </div>
             </div>
         </AppLayout>
     );
 }
