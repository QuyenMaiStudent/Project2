import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
}

interface Spec {
    id: number;
    key: string;
    value: string;
}

interface Props {
    product: Product;
    specs: Spec[];
}

export default function ProductSpecs({ product, specs }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ key: string; value: string }>({ key: '', value: '' });

    const { data, setData, post, reset, errors } = useForm({
        key: '',
        value: '',
    });

    // Thêm mới thông số
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/seller/products/${product.id}/specs`, {
            onSuccess: () => reset(),
        });
    };

    // Bắt đầu sửa
    const startEdit = (spec: Spec) => {
        setEditingId(spec.id);
        setEditData({ key: spec.key, value: spec.value });
    };

    // Lưu sửa
    const handleUpdate = (e: React.FormEvent, spec: Spec) => {
        e.preventDefault();
        router.put(
            `/seller/products/${product.id}/specs/${spec.id}`,
            editData,
            {
                onSuccess: () => setEditingId(null),
            }
        );
    };

    // Xóa
    const handleDelete = (spec: Spec) => {
        if (confirm('Bạn có chắc muốn xóa thông số này?')) {
            router.delete(`/seller/products/${product.id}/specs/${spec.id}`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Seller Dashboard', href: '/seller/dashboard' },
                { title: 'View Products', href: '/seller/products' },
                { title: product.name, href: `/seller/products/${product.id}/specs` },
            ]}
        >
            <Head title={`Thông số sản phẩm: ${product.name}`} />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Thông số kỹ thuật: {product.name}</h1>

                {/* Thêm mới */}
                <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Tên thông số</label>
                        <input
                            type="text"
                            value={data.key}
                            onChange={e => setData('key', e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                        {errors.key && <div className="text-red-500 text-xs">{errors.key}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá trị</label>
                        <textarea
                            value={data.value}
                            onChange={e => setData('value', e.target.value)}
                            className="border rounded px-3 py-2 w-full min-h-[40px]"
                            required
                        />
                        {errors.value && <div className="text-red-500 text-xs">{errors.value}</div>}
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

                {/* Danh sách thông số */}
                <table className="w-full border rounded table-fixed">
                    <colgroup>
                        <col style={{ width: '28%' }} />
                        <col style={{ width: '54%' }} />
                        <col style={{ width: '18%' }} />
                    </colgroup>
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left">Tên thông số</th>
                            <th className="py-2 px-3 text-left">Giá trị</th>
                            <th className="py-2 px-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specs.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-500">
                                    Chưa có thông số nào.
                                </td>
                            </tr>
                        )}
                        {specs.map(spec =>
                            editingId === spec.id ? (
                                <tr key={spec.id} className="bg-yellow-50 align-top">
                                    <td className="py-2 px-3 align-top">
                                        <input
                                            type="text"
                                            value={editData.key}
                                            onChange={e => setEditData({ ...editData, key: e.target.value })}
                                            className="border rounded px-2 py-1 w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-3 align-top">
                                        <textarea
                                            value={editData.value}
                                            onChange={e => setEditData({ ...editData, value: e.target.value })}
                                            className="border rounded px-2 py-1 w-full min-h-[40px]"
                                        />
                                    </td>
                                    <td className="py-2 px-3 text-center align-top whitespace-nowrap">
                                        <button
                                            onClick={e => handleUpdate(e, spec)}
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
                                <tr key={spec.id} className="align-top">
                                    <td className="py-2 px-3 align-top">{spec.key}</td>
                                    <td className="py-2 px-3 align-top">{spec.value}</td>
                                    <td className="py-2 px-3 text-center align-top whitespace-nowrap">
                                        <button
                                            onClick={() => startEdit(spec)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(spec)}
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
