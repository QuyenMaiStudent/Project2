import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useRef } from 'react';
import {
  PlusCircle,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  AlertTriangle,
  ShoppingCart,
  UploadCloud,
} from 'lucide-react';

const containsUrlOrPhone = (t?: string) => {
    if (!t) return false;
    const text = t.trim();
    if (text === '') return false;

    if (/\b(https?:\/\/|www\.)[^\s]+/i.test(text) ||
        /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(text)) {
        return true;
    }

    if (/(?<!\d)\d{7,}(?!\d)/.test(text)) {
        return true;
    }

    return false;
};

const formatMoney = (v: any) => {
    if (v === null || v === undefined || v === '') return '';
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    if (Math.abs(n - Math.round(n)) < 1e-9) {
        return Math.round(n).toLocaleString('vi-VN') + ' đ';
    }
    return n.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' đ';
};

interface Product { id: number; name: string; }
interface Variant { id: number; variant_name: string; additional_price: number; stock: number; image_url?: string; }

interface Props { product: Product; variants: Variant[]; }

export default function ProductVariants({ product, variants }: Props) {
    const page = usePage().props as any;
    const flash = page.flash ?? {};
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<{ variant_name: string; additional_price: string; stock: string }>({
        variant_name: '',
        additional_price: '',
        stock: '',
    });

    const [newVariantImage, setNewVariantImage] = useState<File | null>(null);
    const [editVariantImage, setEditVariantImage] = useState<File | null>(null);

    const { data, setData, post, reset, errors } = useForm({
        variant_name: '',
        additional_price: '',
        stock: '',
    });

    const [clientError, setClientError] = useState<string | null>(null);
    const [editClientError, setEditClientError] = useState<string | null>(null);

    // UI states for deletion modal + toast-notice
    const [deletingVariant, setDeletingVariant] = useState<Variant | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const editFileInputRef = useRef<HTMLInputElement | null>(null);

    const showNotice = (type: 'success' | 'error' | 'info', message: string) => {
        setNotice({ type, message });
        setTimeout(() => setNotice(null), 4500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (containsUrlOrPhone(data.variant_name)) {
            setClientError('Tên biến thể không được chứa đường link hoặc số điện thoại.');
            return;
        }
        setClientError(null);
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
                if (fileInputRef.current) fileInputRef.current.value = '';
                showNotice('success', 'Đã thêm biến thể.');
            },
            onError: () => {
                showNotice('error', 'Thêm biến thể thất bại.');
            }
        });
    };

    const startEdit = (variant: Variant) => {
        setEditingId(variant.id);
        setEditData({
            variant_name: variant.variant_name,
            additional_price: variant.additional_price.toString(),
            stock: variant.stock.toString(),
        });
        setEditVariantImage(null);
        setEditClientError(null);
        if (editFileInputRef.current) editFileInputRef.current.value = '';
    };

    const handleUpdate = (e: React.FormEvent, variant: Variant) => {
        e.preventDefault();
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
                    showNotice('success', 'Đã cập nhật biến thể.');
                },
                onError: () => showNotice('error', 'Cập nhật thất bại.')
            }
        );
    };

    // open deletion modal
    const confirmDelete = (variant: Variant) => {
        setDeletingVariant(variant);
    };

    // perform deletion with UI feedback and warning that cart items will be removed
    const doDelete = () => {
        if (!deletingVariant) return;
        setDeleting(true);
        router.delete(`/seller/products/${product.id}/variants/${deletingVariant.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                showNotice('success', 'Đã xóa biến thể. Các mục tương ứng trong giỏ hàng khách hàng sẽ bị xóa.');
            },
            onError: () => {
                showNotice('error', 'Xóa biến thể thất bại.');
            },
            onFinish: () => {
                setDeleting(false);
                setDeletingVariant(null);
            }
        });
    };

    const cancelDelete = () => {
        setDeletingVariant(null);
    };

    const handleDelete = (variant: Variant) => {
        // replace old confirm() with modal
        confirmDelete(variant);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang sản phẩm', href: '/seller/dashboard' },
                { title: 'Xem sản phẩm', href: '/seller/products' },
                { title: product.name, href: `/seller/products/${product.id}/variants` },
            ]}
        >
            <Head title={`Biến thể sản phẩm: ${product.name}`} />
            <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen rounded-md">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Biến thể: <span className="text-indigo-600">{product.name}</span></h1>
                    <div className="text-sm text-gray-600">{variants.length} biến thể</div>
                </div>

                {notice && (
                    <div className={`mb-4 rounded p-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border border-green-100 text-green-800' : notice.type === 'error' ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-blue-50 border border-blue-100 text-blue-800'}`}>
                        {notice.message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white border rounded-lg p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-50 rounded"><PlusCircle className="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <h3 className="font-semibold">Thêm biến thể</h3>
                                <p className="text-sm text-gray-500">Tên, ảnh, giá phụ và tồn kho.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
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
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewVariantImage(e.target.files ? e.target.files[0] : null)}
                                    className="border rounded px-3 py-2 w-full text-sm"
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

                            <div className="flex gap-2 items-center">
                                <button
                                    type="submit"
                                    className={`flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50`}
                                    disabled={Boolean(clientError)}
                                >
                                    <UploadCloud className="w-4 h-4" /> Thêm
                                </button>
                                <Link href={`/seller/products/${product.id}/variants/upload`} className="inline-flex items-center gap-2 px-3 py-2 border rounded text-sm">
                                    <ImageIcon className="w-4 h-4" /> Ảnh hàng loạt
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {variants.length === 0 && (
                                <div className="col-span-full text-center py-8 text-gray-500 bg-white border rounded-lg">Chưa có biến thể nào.</div>
                            )}

                            {variants.map(variant => {
                                const imageUrl = (variant as any).image_url || '';
                                return (
                                    <div key={variant.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                                        {editingId === variant.id ? (
                                            <>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-14 h-14 bg-gray-50 rounded overflow-hidden flex items-center justify-center border">
                                                        {imageUrl ? <img src={imageUrl} alt={variant.variant_name} className="object-cover w-full h-full" /> : <ImageIcon className="text-gray-300" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">Sửa biến thể</div>
                                                        <div className="text-xs text-gray-500">ID: {variant.id}</div>
                                                    </div>
                                                </div>

                                                <div className="grid gap-2 sm:grid-cols-3 mb-3">
                                                    <input type="text" value={editData.variant_name} onChange={e => {
                                                        const v = e.target.value;
                                                        setEditData({ ...editData, variant_name: v });
                                                        if (containsUrlOrPhone(v)) setEditClientError('Tên biến thể không được chứa đường link hoặc số điện thoại.'); else setEditClientError(null);
                                                    }} className={`col-span-2 border rounded px-2 py-2 ${editClientError ? 'border-red-400' : ''}`} />
                                                    <input type="number" value={editData.additional_price} onChange={e => setEditData({ ...editData, additional_price: e.target.value })} className="border rounded px-2 py-2" min={0} />
                                                    <input type="number" value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })} className="border rounded px-2 py-2" min={0} />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="block text-xs text-gray-500 mb-1">Thay đổi ảnh (tuỳ chọn)</label>
                                                    <input ref={editFileInputRef} type="file" accept="image/*" onChange={e => setEditVariantImage(e.target.files ? e.target.files[0] : null)} className="w-full text-sm" />
                                                    {editVariantImage && <p className="text-xs text-blue-600 mt-1">Đã chọn: {editVariantImage.name}</p>}
                                                </div>

                                                <div className="mt-auto flex gap-2">
                                                    <button onClick={e => handleUpdate(e as any, variant)} className={`flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded ${editClientError ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={Boolean(editClientError)}>
                                                        <Check className="w-4 h-4" /> Lưu
                                                    </button>
                                                    <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-200 px-3 py-2 rounded">Hủy</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-40 bg-gray-50 rounded overflow-hidden mb-3 flex items-center justify-center">
                                                    {imageUrl ? <img src={imageUrl} alt={variant.variant_name} className="object-cover h-full w-full" /> : <div className="text-center text-gray-400"><div className="text-2xl mb-1">📷</div><div className="text-xs">Chưa có ảnh</div></div>}
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-sm font-semibold mb-1">{variant.variant_name}</h3>
                                                    <div className="text-sm text-gray-600 mb-1">{formatMoney(variant.additional_price)}</div>
                                                    <div className="text-sm text-gray-600">Tồn: {variant.stock}</div>
                                                </div>

                                                <div className="mt-3 flex gap-2">
                                                    <button onClick={() => handleDelete(variant)} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded">
                                                        <Trash2 className="w-4 h-4" /> Xóa
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Delete confirmation modal */}
                {deletingVariant && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
                        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
                            <div className="p-5">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">Xác nhận xóa biến thể</h3>
                                        <p className="text-sm text-gray-700 mt-2">
                                            Bạn sắp xóa biến thể "<span className="font-medium">{deletingVariant.variant_name}</span>".
                                            Hành động này sẽ xóa tất cả mục tương ứng của biến thể này trong giỏ hàng của khách hàng.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end gap-3">
                                    <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-100 inline-flex items-center gap-2"><X className="w-4 h-4" /> Hủy</button>
                                    <button onClick={doDelete} disabled={deleting} className="px-4 py-2 rounded bg-red-600 text-white inline-flex items-center gap-2">
                                        {deleting ? 'Đang xóa...' : <><Trash2 className="w-4 h-4" /> Xóa và loại khỏi giỏ hàng</>}
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
