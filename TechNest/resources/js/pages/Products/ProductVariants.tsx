import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

const containsUrlOrPhone = (t?: string) => {
    if (!t) return false;
    const text = t.trim();
    if (text === '') return false;

    // Detect explicit URLs: http(s)://... or www.... or hostname.tld (require a dot + TLD)
    if (/\b(https?:\/\/|www\.)[^\s]+/i.test(text) ||
        /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(text)) {
        return true;
    }

    // Detect a contiguous digit sequence of length >= 7 (phone-like).
    // Use lookarounds to avoid matching digits that are part of alphanumeric tokens.
    if (/(?<!\d)\d{7,}(?!\d)/.test(text)) {
        return true;
    }

    return false;
};

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

    // image states
    const [newVariantImage, setNewVariantImage] = useState<File | null>(null);
    const [editVariantImage, setEditVariantImage] = useState<File | null>(null);

    const { data, setData, post, reset, errors } = useForm({
        variant_name: '',
        additional_price: '',
        stock: '',
    });

    const [clientError, setClientError] = useState<string | null>(null);
    const [editClientError, setEditClientError] = useState<string | null>(null);

    // Thêm mới biến thể
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (containsUrlOrPhone(data.variant_name)) {
            setClientError('Tên biến thể không được chứa đường link hoặc số điện thoại.');
            return;
        }
        setClientError(null);
        // submit as FormData to allow file upload
        const form = new FormData();
        form.append('variant_name', data.variant_name);
        form.append('additional_price', data.additional_price);
        form.append('stock', data.stock);
        if (newVariantImage) form.append('image', newVariantImage);

        router.post(`/seller/products/${product.id}/variants`, form, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setNewVariantImage(null);
            },
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
        setEditVariantImage(null);
        setEditClientError(null);
    };

    // Lưu sửa
    const handleUpdate = (e: React.FormEvent, variant: Variant) => {
        e.preventDefault();
        // client-side safety: if editClientError present or validation fails, block
        if (editClientError) return;
        if (containsUrlOrPhone(editData.variant_name)) {
            setEditClientError('Tên biến thể không được chứa đường link hoặc số điện thoại.');
            return;
        }
        const form = new FormData();
        form.append('variant_name', editData.variant_name);
        form.append('additional_price', editData.additional_price);
        form.append('stock', editData.stock);
        if (editVariantImage) form.append('image', editVariantImage);

        router.post(
            `/seller/products/${product.id}/variants/${variant.id}`,
            form,
            {
                forceFormData: true,
                onSuccess: () => {
                    setEditingId(null);
                    setEditVariantImage(null);
                }
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
                            onChange={e => { setData('variant_name', e.target.value); if (containsUrlOrPhone(e.target.value)) setClientError('Tên biến thể không được chứa đường link hoặc số điện thoại.'); else setClientError(null); }}
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                        {errors.variant_name && <div className="text-red-500 text-xs mt-1">{errors.variant_name}</div>}
                        {clientError && <div className="text-red-500 text-xs mt-1">{clientError}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ảnh biến thể (tuỳ chọn)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setNewVariantImage(e.target.files ? e.target.files[0] : null)}
                            className="border rounded px-3 py-2 w-full"
                        />
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
                            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50`}
                            disabled={Boolean(clientError)}
                        >
                            Thêm
                        </button>
                    </div>
                </form>

                {/* Danh sách biến thể — hiển thị dạng thẻ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {variants.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">Chưa có biến thể nào.</div>
                    )}

                    {variants.map(variant => {
                        const imageUrl = (variant as any).image_url || (variant as any).image?.url || ''; // ensure backend cung cấp
                        return (
                            <div key={variant.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                                {editingId === variant.id ? (
                                    <>
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 mb-1">Tên biến thể</label>
                                            <input
                                                type="text"
                                                value={editData.variant_name}
                                                onChange={e => {
                                                    const v = e.target.value;
                                                    setEditData({ ...editData, variant_name: v });
                                                    if (containsUrlOrPhone(v)) setEditClientError('Tên biến thể không được chứa đường link hoặc số điện thoại.');
                                                    else setEditClientError(null);
                                                }}
                                                className={`border rounded px-2 py-1 w-full ${editClientError ? 'border-red-400' : ''}`}
                                            />
                                            {editClientError && <div className="text-red-500 text-xs mt-1">{editClientError}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 mb-1">Ảnh (đổi)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setEditVariantImage(e.target.files ? e.target.files[0] : null)}
                                                className="border rounded px-3 py-2 w-full"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 mb-1">Giá cộng thêm</label>
                                            <input
                                                type="number"
                                                value={editData.additional_price}
                                                onChange={e => setEditData({ ...editData, additional_price: e.target.value })}
                                                className="border rounded px-2 py-1 w-full"
                                                min={0}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-500 mb-1">Tồn kho</label>
                                            <input
                                                type="number"
                                                value={editData.stock}
                                                onChange={e => setEditData({ ...editData, stock: e.target.value })}
                                                className="border rounded px-2 py-1 w-full"
                                                min={0}
                                            />
                                        </div>
                                        <div className="mt-auto flex gap-2">
                                            <button
                                                onClick={e => handleUpdate(e as any, variant)}
                                                className={`flex-1 bg-green-600 text-white px-3 py-2 rounded ${editClientError ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                disabled={Boolean(editClientError)}
                                            >
                                                Lưu
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-300 text-gray-800 px-3 py-2 rounded">Hủy</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-40 bg-gray-50 rounded overflow-hidden mb-3 flex items-center justify-center">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={variant.variant_name} className="object-contain h-full w-full" />
                                            ) : (
                                                <div className="text-sm text-gray-400">Không có ảnh</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold mb-1">{variant.variant_name}</h3>
                                            <div className="text-sm text-gray-600 mb-2">{formatMoney(variant.additional_price)}</div>
                                            <div className="text-sm text-gray-600">Tồn: {variant.stock}</div>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <button onClick={() => startEdit(variant)} className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded">Sửa</button>
                                            <button onClick={() => handleDelete(variant)} className="flex-1 bg-red-600 text-white px-3 py-2 rounded">Xóa</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
             </div>
         </AppLayout>
     );
 }
