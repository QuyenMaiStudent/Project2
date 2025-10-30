import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

const containsUrlOrPhone = (text?: string) => {
    const t = (text ?? '').trim();
    if (!t) return false;

    // explicit URLs (http(s) or www.) or domain-like (with a dot + tld)
    if (/(https?:\/\/|www\.)[^\s]+/i.test(t) || /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(t)) {
      return true;
    }

    // detect a contiguous digit sequence of length >= 7 (phone-like)
    if (/\b\d{7,}\b/.test(t)) {
      return true;
    }

    return false;
  };

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
    // separate client errors for "add" and "edit" to avoid cross-blocking
    const [addErrors, setAddErrors] = useState<{ key?: string; value?: string }>({});
    const [editErrors, setEditErrors] = useState<{ key?: string; value?: string }>({});

    const { data, setData, post, reset, errors } = useForm({
        key: '',
        value: '',
    });

    const validateAddField = (field: 'key' | 'value', value: string) => {
        if (containsUrlOrPhone(value)) {
            setAddErrors(prev => ({ ...prev, [field]: 'Không được chứa đường link hoặc số điện thoại.' }));
            return false;
        } else {
            setAddErrors(prev => { const c = { ...prev }; delete c[field]; return c; });
            return true;
        }
    };

    const validateEditField = (field: 'key' | 'value', value: string) => {
        if (containsUrlOrPhone(value)) {
            setEditErrors(prev => ({ ...prev, [field]: 'Không được chứa đường link hoặc số điện thoại.' }));
            return false;
        } else {
            setEditErrors(prev => { const c = { ...prev }; delete c[field]; return c; });
            return true;
        }
    };

    // Thêm mới thông số
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const okKey = validateAddField('key', data.key);
        const okValue = validateAddField('value', data.value);
        if (!okKey || !okValue) return;

        post(`/seller/products/${product.id}/specs`, {
            onSuccess: () => {
                reset();
                setAddErrors({});
            },
        });
    };

    // Bắt đầu sửa
    const startEdit = (spec: Spec) => {
        setEditingId(spec.id);
        setEditData({ key: spec.key, value: spec.value });
        // clear add/edit errors for edit context
        setEditErrors({});
        setAddErrors(prev => prev); // keep add errors as-is
    };

    // Lưu sửa
    const handleUpdate = (e: React.FormEvent, spec: Spec) => {
        e.preventDefault();
        const okKey = validateEditField('key', editData.key);
        const okValue = validateEditField('value', editData.value);
        if (!okKey || !okValue) return;

        router.put(
            `/seller/products/${product.id}/specs/${spec.id}`,
            editData,
            {
                onSuccess: () => {
                    setEditingId(null);
                    setEditErrors({});
                },
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
                            onChange={e => { setData('key', e.target.value); validateAddField('key', e.target.value); }}
                            className={`border rounded px-3 py-2 w-full ${addErrors.key ? 'border-red-400' : ''}`}
                            required
                        />
                        {errors.key && <div className="text-red-500 text-xs">{errors.key}</div>}
                        {addErrors.key && <div className="text-red-500 text-xs">{addErrors.key}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá trị</label>
                        <textarea
                            value={data.value}
                            onChange={e => { setData('value', e.target.value); validateAddField('value', e.target.value); }}
                            className={`border rounded px-3 py-2 w-full min-h-[40px] ${addErrors.value ? 'border-red-400' : ''}`}
                            required
                        />
                        {errors.value && <div className="text-red-500 text-xs">{errors.value}</div>}
                        {addErrors.value && <div className="text-red-500 text-xs">{addErrors.value}</div>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={Boolean(addErrors.key || addErrors.value)}
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
                                            onChange={e => { setEditData({ ...editData, key: e.target.value }); validateEditField('key', e.target.value); }}
                                            className={`border rounded px-2 py-1 w-full ${editErrors.key ? 'border-red-400' : ''}`}
                                        />
                                        {editErrors.key && <div className="text-red-500 text-xs">{editErrors.key}</div>}
                                    </td>
                                    <td className="py-2 px-3 align-top">
                                        <textarea
                                            value={editData.value}
                                            onChange={e => { setEditData({ ...editData, value: e.target.value }); validateEditField('value', e.target.value); }}
                                            className={`border rounded px-2 py-1 w-full min-h-[40px] ${editErrors.value ? 'border-red-400' : ''}`}
                                        />
                                        {editErrors.value && <div className="text-red-500 text-xs">{editErrors.value}</div>}
                                    </td>
                                    <td className="py-2 px-3 text-center align-top whitespace-nowrap">
                                        <button
                                            onClick={e => handleUpdate(e, spec)}
                                            className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
                                            disabled={Boolean(editErrors.key || editErrors.value)}
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => { setEditingId(null); setEditErrors({}); }}
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
