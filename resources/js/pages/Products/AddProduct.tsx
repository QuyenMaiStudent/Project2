import React, { FormEvent, ChangeEvent, useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Image, Tag, Info, CreditCard } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Giao diện người bán', href: '/seller/dashboard' },
    { title: 'Xem sản phẩm', href: '/seller/products' },
    { title: 'Thêm sản phẩm', href: '/seller/products/create' },
];

interface Brand { id: number; name: string; }
interface Warranty { id: number; title: string; }
interface Category { id: number; name: string; }

interface Props {
    brands?: Brand[];
    warranties?: Warranty[];
    categories?: Category[];
}

export default function AddProduct({ brands = [], warranties = [], categories = [] }: Props) {
    const page = usePage().props as any;
    const [clientErrors, setClientErrors] = useState<Record<string,string>>({});
    const safebrands = Array.isArray(brands) ? brands : [];
    const safeWarranties = Array.isArray(warranties) ? warranties : [];
    const safeCategories = Array.isArray(categories) ? categories : [];

    const containsUrlOrPhone = (text?: string) => {
        const t = (text ?? '').trim();
        if (!t) return false;
        if (/(https?:\/\/|www\.)[^\s]+/i.test(t) || /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(t)) return true;
        if (/\b\d{7,}\b/.test(t)) return true;
        return false;
    };

    const validateField = (field: string, value: string) => {
        if (containsUrlOrPhone(value)) {
            setClientErrors(prev => ({ ...prev, [field]: 'Không được chứa đường link hoặc số điện thoại.' }));
            return false;
        } else {
            setClientErrors(prev => { const c = { ...prev }; delete c[field]; return c; });
            return true;
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: '',
        brand_id: '',
        category_id: '',
        warranty_id: '',
        is_active: true,
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
            setClientErrors(prev => { const c = {...prev}; delete c.image; return c;});
        } else {
            setImagePreview(null);
            setClientErrors(prev => ({ ...prev, image: 'Vui lòng chọn ảnh sản phẩm.' }));
        }
    };

    const formatCurrency = (v?: string) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return '—';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const okName = validateField('name', data.name);
        const okDesc = validateField('description', data.description);
        if (!okName || !okDesc) return;

        if (!data.image) {
            setClientErrors(prev => ({ ...prev, image: 'Vui lòng chọn ảnh sản phẩm.' }));
            const el = document.getElementById('image');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        post('/seller/products', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const breadcrumbsForLayout = page.breadcrumbs ?? breadcrumbs;

    return (
        <AppLayout breadcrumbs={breadcrumbsForLayout}>
            <Head title="Thêm sản phẩm" />

            <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main form */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 rounded-lg overflow-hidden shadow">
                            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
                                <div className="p-3 bg-white/10 rounded">
                                    <Image className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold">Thêm sản phẩm mới</h1>
                                    <p className="text-sm opacity-90">Điền thông tin chi tiết để khách hàng dễ tìm thấy sản phẩm.</p>
                                </div>
                                <div className="ml-auto">
                                    <Link href="/seller/products" className="inline-flex items-center gap-2 rounded bg-white/20 px-3 py-2 text-sm">Danh sách</Link>
                                </div>
                            </div>

                            <div className="bg-white p-6">
                                {Object.keys(errors).length > 0 && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                                        <ul className="list-disc list-inside space-y-1">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <li key={field}>
                                                    {typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => { setData('name', e.target.value); validateField('name', e.target.value); }}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                                                placeholder="Nhập tên sản phẩm"
                                                required
                                            />
                                            {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
                                            {clientErrors.name && <p className="text-red-600 text-sm mt-2">{clientErrors.name}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                                            <textarea
                                                rows={5}
                                                value={data.description}
                                                onChange={(e) => { setData('description', e.target.value); validateField('description', e.target.value); }}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
                                                placeholder="Mô tả ngắn, không chứa link hoặc số điện thoại"
                                            />
                                            {errors.description && <p className="text-red-600 text-sm mt-2">{errors.description}</p>}
                                            {clientErrors.description && <p className="text-red-600 text-sm mt-2">{clientErrors.description}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ) *</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1000"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-200'}`}
                                                    required
                                                />
                                                <div className="text-sm text-gray-500 px-3">{formatCurrency(data.price)}</div>
                                            </div>
                                            {errors.price && <p className="text-red-600 text-sm mt-2">{errors.price}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu *</label>
                                            <select
                                                value={data.brand_id}
                                                onChange={(e) => setData('brand_id', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.brand_id ? 'border-red-300' : 'border-gray-200'}`}
                                                required
                                            >
                                                <option value="">-- Chọn thương hiệu --</option>
                                                {safebrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                            {errors.brand_id && <p className="text-red-600 text-sm mt-2">{errors.brand_id}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                                            <select
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category_id ? 'border-red-300' : 'border-gray-200'}`}
                                                required
                                            >
                                                <option value="">-- Chọn danh mục --</option>
                                                {safeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            {errors.category_id && <p className="text-red-600 text-sm mt-2">{errors.category_id}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Chính sách bảo hành</label>
                                            <select
                                                value={data.warranty_id}
                                                onChange={(e) => setData('warranty_id', e.target.value)}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.warranty_id ? 'border-red-300' : 'border-gray-200'}`}
                                            >
                                                <option value="">-- Không có bảo hành --</option>
                                                {safeWarranties.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                                            </select>
                                            {errors.warranty_id && <p className="text-red-600 text-sm mt-2">{errors.warranty_id}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm *</label>
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.image || clientErrors.image ? 'border-red-300' : 'border-gray-200'}`}
                                                required
                                            />
                                            <p className="text-sm text-gray-500 mt-2">Hỗ trợ: JPEG, PNG, JPG, GIF, WebP — tối đa 4MB</p>

                                            {imagePreview ? (
                                                <div className="mt-4 flex items-start gap-4">
                                                    <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border shadow-sm" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{data.name || 'Tên sản phẩm'}</p>
                                                        <p className="text-sm text-gray-500 mt-2">{data.description ? `${data.description.slice(0,120)}${data.description.length>120?'...':''}` : 'Mô tả ngắn sẽ hiển thị ở đây.'}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                                                    <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-50 border text-gray-300">
                                                        <Image className="w-6 h-6" />
                                                    </div>
                                                    <div>Chưa có ảnh — thêm ảnh sản phẩm để xem trước.</div>
                                                </div>
                                            )}

                                            {errors.image && <p className="text-red-600 text-sm mt-2">{Array.isArray(errors.image) ? errors.image[0] : errors.image}</p>}
                                            {clientErrors.image && <p className="text-red-600 text-sm mt-2">{clientErrors.image}</p>}
                                        </div>

                                        <div className="md:col-span-2 flex items-center justify-between mt-4">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="h-4 w-4" />
                                                <span className="text-sm font-medium text-gray-700">Kích hoạt sản phẩm</span>
                                            </label>

                                            <div className="flex gap-3">
                                                <Link href="/seller/dashboard" className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">Hủy</Link>
                                                <button type="submit" disabled={processing || Object.keys(clientErrors).length>0} className="px-6 py-2 bg-gradient-to-r from-[#0AC1EF] to-[#09b3db] text-white rounded-lg shadow">
                                                    {processing ? 'Đang gửi...' : 'Thêm sản phẩm'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded"><Tag className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                    <h4 className="font-semibold">Tóm tắt nhanh</h4>
                                    <p className="text-sm text-gray-600 mt-1">Xem trước thông tin sản phẩm trước khi tạo.</p>
                                </div>
                            </div>

                            <dl className="mt-4 text-sm text-gray-700 space-y-3">
                                <div className="flex justify-between"><dt className="text-gray-500">Tên</dt><dd className="font-medium">{data.name || '—'}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Giá</dt><dd className="font-medium">{formatCurrency(data.price)}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Danh mục</dt><dd>{safeCategories.find(c=>String(c.id)===String(data.category_id))?.name ?? '—'}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Thương hiệu</dt><dd>{safebrands.find(b=>String(b.id)===String(data.brand_id))?.name ?? '—'}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Bảo hành</dt><dd>{safeWarranties.find(w=>String(w.id)===String(data.warranty_id))?.title ?? '—'}</dd></div>
                            </dl>
                        </div>

                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded"><Info className="w-5 h-5 text-green-600" /></div>
                                <div>
                                    <h4 className="font-semibold">Gợi ý</h4>
                                    <p className="text-sm text-gray-600 mt-1">Viết mô tả ngắn gọn, tránh thông tin liên hệ. Ảnh sắc nét giúp tăng tỉ lệ mua hàng.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 rounded"><CreditCard className="w-5 h-5 text-yellow-600" /></div>
                                <div>
                                    <h4 className="font-semibold">Thanh toán & phí</h4>
                                    <p className="text-sm text-gray-600 mt-1">Kiểm tra giá bán, chiết khấu và các lựa chọn vận chuyển sau khi tạo sản phẩm.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
