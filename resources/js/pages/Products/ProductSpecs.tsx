import React, { useState } from 'react';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PlusCircle, Pencil, Trash2, X, Check, Info } from 'lucide-react';

const containsUrlOrPhone = (text?: string) => {
    const t = (text ?? '').trim();
    if (!t) return false;
    if (/(https?:\/\/|www\.)[^\s]+/i.test(t) || /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(t)) return true;
    if (/\b\d{7,}\b/.test(t)) return true;
    return false;
};

interface Product { id: number; name: string; }
interface Spec { id: number; key: string; value: string; }
interface Props { product: Product; specs: Spec[]; }

export default function ProductSpecs({ product, specs }: Props) {
    const page = usePage().props as any;
    const flash = page.flash ?? {};

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ key: string; value: string }>({ key: '', value: '' });
    const [addErrors, setAddErrors] = useState<{ key?: string; value?: string }>({});
    const [editErrors, setEditErrors] = useState<{ key?: string; value?: string }>({});
    const [deletingSpec, setDeletingSpec] = useState<Spec | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { data, setData, post, reset, errors } = useForm({ key: '', value: '' });

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

    const startEdit = (spec: Spec) => {
        setEditingId(spec.id);
        setEditData({ key: spec.key, value: spec.value });
        setEditErrors({});
    };

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

    // open delete UI dialog (instead of window.confirm)
    const confirmDelete = (spec: Spec) => {
        setDeletingSpec(spec);
    };

    const doDelete = () => {
        if (!deletingSpec) return;
        setDeleting(true);
        router.delete(
            `/seller/products/${product.id}/specs/${deletingSpec.id}`,
            {
                preserveScroll: true,
                onFinish: () => {
                    setDeleting(false);
                    setDeletingSpec(null);
                },
            }
        );
    };

    const cancelDelete = () => {
        setDeletingSpec(null);
    };

    const handleDelete = (spec: Spec) => {
        // kept for backward compatibility; use confirmDelete instead in UI
        confirmDelete(spec);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người bán', href: '/seller/dashboard' },
                { title: 'Xem sản phẩm', href: '/seller/products' },
                { title: product.name, href: `/seller/products/${product.id}/specs` },
            ]}
        >
            <Head title={`Thông số sản phẩm: ${product.name}`} />
            <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Thông số: <span className="text-indigo-600">{product.name}</span></h1>
                        <p className="text-sm text-gray-500 mt-1">Quản lý thuộc tính / thông số kỹ thuật cho sản phẩm.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/seller/products" className="text-sm px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Quay lại</Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-4 p-4 rounded bg-green-50 border border-green-100 text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left - Add form + list */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-50 rounded"><PlusCircle className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                    <h3 className="font-semibold">Thêm thông số</h3>
                                    <p className="text-sm text-gray-500">Thêm tên và giá trị cho thuộc tính sản phẩm.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3 items-end">
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        value={data.key}
                                        onChange={e => { setData('key', e.target.value); validateAddField('key', e.target.value); }}
                                        className={`mt-2 w-full px-3 py-2 border rounded ${addErrors.key || errors.key ? 'border-red-400' : 'border-gray-200'}`}
                                        placeholder="Ví dụ: Màu sắc"
                                        required
                                    />
                                    {(errors.key || addErrors.key) && <p className="text-red-600 text-xs mt-1">{errors.key ?? addErrors.key}</p>}
                                </div>

                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Giá trị</label>
                                    <input
                                        type="text"
                                        value={data.value}
                                        onChange={e => { setData('value', e.target.value); validateAddField('value', e.target.value); }}
                                        className={`mt-2 w-full px-3 py-2 border rounded ${addErrors.value || errors.value ? 'border-red-400' : 'border-gray-200'}`}
                                        placeholder="Ví dụ: Đỏ, Xanh, 64GB"
                                        required
                                    />
                                    {(errors.value || addErrors.value) && <p className="text-red-600 text-xs mt-1">{errors.value ?? addErrors.value}</p>}
                                </div>

                                <div className="sm:col-span-1">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0AC1EF] to-[#09b3db] text-white rounded shadow"
                                        disabled={Boolean(addErrors.key || addErrors.value)}
                                    >
                                        <PlusCircle className="w-4 h-4" /> Thêm
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white border rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold">Danh sách thông số</h4>
                                <div className="text-sm text-gray-500">{specs.length} mục</div>
                            </div>

                            <div className="divide-y">
                                {specs.length === 0 ? (
                                    <div className="py-6 text-center text-gray-500">Chưa có thông số nào.</div>
                                ) : specs.map(spec => (
                                    <div key={spec.id} className="py-3 flex items-start gap-4">
                                        {editingId === spec.id ? (
                                            <form onSubmit={e => handleUpdate(e, spec)} className="flex-1 grid gap-2 sm:grid-cols-3 items-end">
                                                <div>
                                                    <label className="text-xs text-gray-600">Tên</label>
                                                    <input
                                                        type="text"
                                                        value={editData.key}
                                                        onChange={e => { setEditData({ ...editData, key: e.target.value }); validateEditField('key', e.target.value); }}
                                                        className={`mt-1 w-full px-3 py-2 border rounded ${editErrors.key ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    {editErrors.key && <p className="text-red-600 text-xs mt-1">{editErrors.key}</p>}
                                                </div>

                                                <div>
                                                    <label className="text-xs text-gray-600">Giá trị</label>
                                                    <input
                                                        type="text"
                                                        value={editData.value}
                                                        onChange={e => { setEditData({ ...editData, value: e.target.value }); validateEditField('value', e.target.value); }}
                                                        className={`mt-1 w-full px-3 py-2 border rounded ${editErrors.value ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    {editErrors.value && <p className="text-red-600 text-xs mt-1">{editErrors.value}</p>}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button type="submit" className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded">
                                                        <Check className="w-4 h-4" /> Lưu
                                                    </button>
                                                    <button type="button" onClick={() => { setEditingId(null); setEditErrors({}); }} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
                                                        <X className="w-4 h-4" /> Hủy
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium">{spec.key}</div>
                                                            <div className="text-sm text-gray-600 truncate mt-1">{spec.value}</div>
                                                        </div>
                                                        <div className="hidden sm:block text-sm text-gray-500">{/* placeholder for future meta */}</div>
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0 flex gap-2">
                                                    <button onClick={() => startEdit(spec)} className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                                        <Pencil className="w-4 h-4" /> Sửa
                                                    </button>
                                                    <button onClick={() => confirmDelete(spec)} className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                                        <Trash2 className="w-4 h-4" /> Xóa
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Help / Tips */}
                    <aside className="space-y-6">
                        <div className="bg-white border rounded-lg shadow-sm p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 rounded"><Info className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                    <h5 className="font-semibold">Gợi ý</h5>
                                    <p className="text-sm text-gray-600 mt-1">Viết tên và giá trị ngắn gọn, tránh thông tin liên hệ hoặc link. Thông số rõ ràng giúp khách hàng hiểu nhanh sản phẩm.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg shadow-sm p-4">
                            <h6 className="font-semibold mb-2">Mẹo đặt tên</h6>
                            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                                <li>Sử dụng định dạng chuẩn: Kích thước, Màu sắc, Bộ nhớ.</li>
                                <li>Không lặp lại nội dung trong mô tả thông số.</li>
                                <li>Giữ giá trị ngắn — tối đa 3 thông tin phân cách bằng dấu phẩy.</li>
                            </ul>
                        </div>
                    </aside>
                </div>

                {/* Delete confirmation modal (UI) */}
                {deletingSpec && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
                        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
                                <p className="text-sm text-gray-600 mt-2">Bạn có chắc muốn xóa thông số "<span className="font-medium">{deletingSpec.key}</span>"?</p>
                                <div className="mt-4 flex justify-end gap-3">
                                    <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-100">Hủy</button>
                                    <button onClick={doDelete} disabled={deleting} className="px-4 py-2 rounded bg-red-600 text-white">
                                        {deleting ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
