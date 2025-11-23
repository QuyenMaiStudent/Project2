// @ts-nocheck
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Image,
  Info,
  Tag,
  CreditCard,
  Save,
  X as XIcon,
  DollarSign,
  Layers,
  Star,
  Clock
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Giao diện người bán',
        href: '/seller/dashboard',
    },
    {
        title: 'Xem sản phẩm',
        href: '/seller/products',
    },
    {
        title: 'Chỉnh sửa sản phẩm',
        href: '#',
    },
];

interface Brand {
    id: number;
    name: string;
}

interface Warranty {
    id: number;
    title: string;
}

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    // stock removed
    brand_id: number;
    warranty_id: number | null;
    category_id: number | null;
    is_active: boolean;
    primary_image?: {
        url: string;
        alt_text: string;
    };
}

interface Props {
    product: Product;
    brands: Brand[];
    warranties: Warranty[];
    categories: Category[];
    has_cart_items: boolean; // Thêm flag
}

// Extend Inertia errors type
interface ExtendedErrors {
    name?: string;
    description?: string;
    price?: string;
    brand_id?: string;
    warranty_id?: string;
    category_id?: string;
    is_active?: string;
    image?: string;
    confirmed?: string;
    confirm?: string; // Thêm custom error key
}

export default function EditProduct({ product, brands = [], warranties = [], categories = [], has_cart_items }: Props) {
    const page = usePage().props as any;
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.primary_image?.url || null
    );
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const safeBrands = Array.isArray(brands) ? brands : [];
    const safeWarranties = Array.isArray(warranties) ? warranties : [];
    const safeCategories = Array.isArray(categories) ? categories : [];

    const containsUrlOrPhone = (text?: string) => {
        const t = (text ?? '').trim();
        if (!t) return false;
        if (/(https?:\/\/|www\.)[^\s]+/i.test(t) || /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(t)) {
            return true;
        }
        if (/(?<!\d)\d{7,}(?!\d)/.test(t)) {
            return true;
        }
        return false;
    };

    const validateField = (field: string, value: string) => {
        if (containsUrlOrPhone(value)) {
            setClientErrors(prev => ({
                ...prev,
                [field]: 'Trường này không được chứa đường link hoặc số điện thoại.'
            }));
            return false;
        } else {
            setClientErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
            return true;
        }
    };

    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        description: string;
        price: string;
        brand_id: string;
        warranty_id: string;
        category_id: string;
        is_active: boolean;
        image: File | null;
        confirmed: boolean;
    }>({
        name: String(product.name || ''),
        description: String(product.description || ''),
        price: String(product.price || ''),
        brand_id: String(product.brand_id || ''),
        warranty_id: product.warranty_id ? String(product.warranty_id) : '',
        category_id: product.category_id ? String(product.category_id) : '',
        is_active: Boolean(product.is_active),
        image: null,
        confirmed: false,
    });

    const extendedErrors = errors as ExtendedErrors;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(product.primary_image?.url || null);
        }
    };

    const formatCurrency = (v: string | number) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return '—';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const okName = validateField('name', data.name);
        const okDesc = validateField('description', data.description || '');

        if (!okName || !okDesc) return;

        if (!data.name?.trim()) {
            setClientErrors(prev => ({ ...prev, name: 'Tên sản phẩm không được để trống.' }));
            return;
        }

        const price = parseFloat(data.price);
        const brandId = parseInt(data.brand_id);
        const categoryId = data.category_id ? parseInt(data.category_id) : null;
        const warrantyId = data.warranty_id ? parseInt(data.warranty_id) : null;

        if (isNaN(price) || price <= 0) {
            setClientErrors(prev => ({ ...prev, price: 'Giá sản phẩm phải là số và lớn hơn 0.' }));
            return;
        }

        if (isNaN(brandId) || !data.brand_id) {
            setClientErrors(prev => ({ ...prev, brand_id: 'Vui lòng chọn thương hiệu.' }));
            return;
        }

        if (!categoryId || isNaN(categoryId)) {
            setClientErrors(prev => ({ ...prev, category_id: 'Vui lòng chọn danh mục.' }));
            return;
        }

        if (has_cart_items && !data.confirmed) {
            setShowConfirmModal(true);
            return;
        }

        const submitData = {
            name: data.name.trim(),
            description: data.description || '',
            price: price,
            brand_id: brandId,
            category_id: categoryId,
            warranty_id: warrantyId,
            is_active: data.is_active ? 1 : 0,
            confirmed: data.confirmed ? 1 : 0,
            image: data.image,
        };

        put(`/seller/products/${product.id}`, submitData, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleConfirmSubmit = () => {
        setData('confirmed', true);
        setShowConfirmModal(false);
        const fakeEvent = { preventDefault: () => {} } as FormEvent;
        handleSubmit(fakeEvent);
    };

    const handleCancelConfirm = () => {
        setShowConfirmModal(false);
        setData('confirmed', false);
    };

    const checkForChanges = () => {
        return (
            data.name !== String(product.name || '') ||
            data.description !== String(product.description || '') ||
            data.price !== String(product.price || '') ||
            data.brand_id !== String(product.brand_id || '') ||
            data.warranty_id !== (product.warranty_id ? String(product.warranty_id) : '') ||
            data.category_id !== (product.category_id ? String(product.category_id) : '') ||
            data.is_active !== Boolean(product.is_active) ||
            data.image !== null
        );
    };

    useEffect(() => {
        // keep minimal logging for debug
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Chỉnh sửa - ${product.name}`} />

            <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="rounded-lg overflow-hidden shadow grid lg:grid-cols-3 bg-white">
                    <main className="lg:col-span-2 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-3">
                                  <span className="inline-flex items-center justify-center w-9 h-9 rounded bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow">
                                    <Star className="w-4 h-4" />
                                  </span>
                                  Chỉnh sửa sản phẩm
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin sản phẩm của bạn — giao diện đã được nâng cấp để thuận tiện hơn.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/seller/products" className="px-3 py-2 rounded bg-gray-100 text-sm hover:bg-gray-200">Danh sách</Link>
                            </div>
                        </div>

                        {(Object.keys(errors).length > 0 || Object.keys(clientErrors).length > 0) && (
                          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                            <ul className="list-disc list-inside space-y-1">
                              {Object.entries({ ...errors, ...clientErrors }).map(([field, error]) => (
                                <li key={field} className="text-sm">
                                  {typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Product basics card */}
                          <section className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded"><Tag className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                  <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                                  <p className="text-xs text-gray-500 mt-1">Tên, mô tả và giá — phần hiển thị chính cho khách hàng.</p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">Cập nhật nhanh</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tên sản phẩm *</label>
                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 rounded border">
                                    <Star className="w-4 h-4 text-indigo-500" />
                                  </div>
                                  <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => { setData('name', e.target.value); validateField('name', e.target.value); }}
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.name || clientErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                                    placeholder="Nhập tên sản phẩm"
                                    required
                                  />
                                </div>
                                {(errors.name || clientErrors.name) && <p className="text-red-600 text-sm mt-2">{errors.name || clientErrors.name}</p>}
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Mô tả</label>
                                <div className="flex items-start gap-2">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 rounded border pt-1">
                                    <Info className="w-4 h-4 text-green-500" />
                                  </div>
                                  <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => { setData('description', e.target.value); validateField('description', e.target.value); }}
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.description || clientErrors.description ? 'border-red-300' : 'border-gray-200'}`}
                                    placeholder="Mô tả ngắn, ví dụ: đặc điểm nổi bật, thông số cơ bản..."
                                  />
                                </div>
                                {(errors.description || clientErrors.description) && <p className="text-red-600 text-sm mt-2">{errors.description || clientErrors.description}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Giá (VND) *</label>
                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 rounded border">
                                    <DollarSign className="w-4 h-4 text-yellow-600" />
                                  </div>
                                  <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    min="0"
                                    step="1000"
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.price || clientErrors.price ? 'border-red-300' : 'border-gray-200'}`}
                                    required
                                  />
                                </div>
                                <div className="text-sm text-gray-500 mt-2">{formatCurrency(data.price)}</div>
                                {(errors.price || clientErrors.price) && <p className="text-red-600 text-sm mt-2">{errors.price || clientErrors.price}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Danh mục *</label>
                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 rounded border">
                                    <Layers className="w-4 h-4 text-indigo-500" />
                                  </div>
                                  <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.category_id || clientErrors.category_id ? 'border-red-300' : 'border-gray-200'}`}
                                    required
                                  >
                                    <option value="">-- Chọn danh mục --</option>
                                    {safeCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                  </select>
                                </div>
                                {(errors.category_id || clientErrors.category_id) && <p className="text-red-600 text-sm mt-2">{errors.category_id || clientErrors.category_id}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Thương hiệu *</label>
                                <div className="flex items-center gap-2">
                                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-50 rounded border">
                                    <Tag className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  <select
                                    value={data.brand_id}
                                    onChange={(e) => setData('brand_id', e.target.value)}
                                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.brand_id || clientErrors.brand_id ? 'border-red-300' : 'border-gray-200'}`}
                                    required
                                  >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {safeBrands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                  </select>
                                </div>
                                {(errors.brand_id || clientErrors.brand_id) && <p className="text-red-600 text-sm mt-2">{errors.brand_id || clientErrors.brand_id}</p>}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Bảo hành</label>
                                <select
                                  value={data.warranty_id}
                                  onChange={(e) => setData('warranty_id', e.target.value)}
                                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${errors.warranty_id ? 'border-red-300' : 'border-gray-200'}`}
                                >
                                  <option value="">-- Không có bảo hành --</option>
                                  {safeWarranties.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}
                                </select>
                                {errors.warranty_id && <p className="text-red-600 text-sm mt-2">{Array.isArray(errors.warranty_id) ? errors.warranty_id[0] : errors.warranty_id}</p>}
                              </div>
                            </div>
                          </section>

                          {/* Image & Visibility card */}
                          <section className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded"><Image className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                  <h3 className="text-lg font-semibold">Ảnh & Trạng thái</h3>
                                  <p className="text-xs text-gray-500 mt-1">Ảnh chính sẽ hiển thị trên danh sách sản phẩm.</p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">Preview</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                              <div>
                                {imagePreview ? (
                                  <div className="mb-3 flex items-center gap-4">
                                    <img src={imagePreview} alt="Preview" className="w-36 h-36 object-cover rounded-lg border shadow-sm" />
                                    <div>
                                      <p className="font-medium">{data.name || product.name}</p>
                                      <p className="text-sm text-gray-500 mt-2">{data.description ? `${data.description.slice(0,120)}${data.description.length>120?'...':''}` : 'Mô tả ngắn sẽ hiển thị ở đây.'}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
                                    <div className="w-28 h-28 flex items-center justify-center rounded-lg bg-gray-50 border text-gray-300">
                                      <Image className="w-6 h-6" />
                                    </div>
                                    <div>Chưa có ảnh — thêm ảnh sản phẩm để xem trước.</div>
                                  </div>
                                )}

                                <input type="file" accept="image/*" onChange={handleImageChange} className={`w-full px-4 py-2 border rounded-lg ${errors.image ? 'border-red-300' : 'border-gray-200'}`} />
                                <p className="text-sm text-gray-500 mt-2">Để trống để giữ ảnh hiện tại. Hỗ trợ JPEG, PNG, JPG, GIF, WebP — tối đa 4MB</p>
                                {errors.image && <p className="text-red-600 text-sm mt-2">{Array.isArray(errors.image) ? errors.image[0] : errors.image}</p>}
                              </div>

                              <div className="flex flex-col justify-between">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Hiển thị</label>
                                  <div className="flex items-center gap-3">
                                    <label className="inline-flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4" />
                                      <span className="text-sm font-medium text-gray-700">Kích hoạt sản phẩm</span>
                                    </label>
                                    <span className={`ml-2 px-2 py-1 text-xs rounded ${data.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{data.is_active ? 'Đang kích hoạt' : 'Đã tắt'}</span>
                                  </div>

                                  <div className="mt-6 text-sm text-gray-600 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <div>Thay đổi sẽ áp dụng ngay sau khi lưu</div>
                                  </div>
                                </div>

                                <div className="mt-4 flex gap-3 justify-end">
                                  <Link href="/seller/products" className="px-4 py-2 rounded border bg-white text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2">
                                    <XIcon className="w-4 h-4" /> Hủy
                                  </Link>
                                  <button type="submit" disabled={processing || Object.keys(clientErrors).length > 0} className="px-6 py-3 rounded bg-gradient-to-r from-[#0AC1EF] to-[#09b3db] text-white inline-flex items-center gap-2 shadow">
                                    <Save className="w-4 h-4" /> {processing ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </section>
                        </form>
                    </main>

                    <aside className="lg:col-span-1 border-l bg-gray-50 p-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded"><Tag className="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <h4 className="font-semibold">Tóm tắt</h4>
                                <p className="text-sm text-gray-600 mt-1">Xem nhanh thông tin hiển thị trước khi lưu thay đổi.</p>
                            </div>
                        </div>

                        <dl className="mt-4 text-sm text-gray-700 space-y-3">
                            <div className="flex justify-between"><dt className="text-gray-500">Tên</dt><dd className="font-medium">{data.name || '—'}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Giá</dt><dd className="font-medium">{formatCurrency(data.price)}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Danh mục</dt><dd>{safeCategories.find(c => String(c.id) === String(data.category_id))?.name ?? '—'}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Thương hiệu</dt><dd>{safeBrands.find(b => String(b.id) === String(data.brand_id))?.name ?? '—'}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Bảo hành</dt><dd>{safeWarranties.find(w => String(w.id) === String(data.warranty_id))?.title ?? '—'}</dd></div>
                            <div className="flex justify-between"><dt className="text-gray-500">Trạng thái</dt><dd>{data.is_active ? 'Đang kích hoạt' : 'Đã tắt'}</dd></div>
                        </dl>

                        <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded"><Info className="w-5 h-5 text-green-600" /></div>
                                <div>
                                    <h5 className="font-semibold">Gợi ý</h5>
                                    <p className="text-sm text-gray-600 mt-1">Thay đổi giá hoặc hình ảnh có thể ảnh hưởng đến giỏ hàng khách. Nếu cần, xác nhận thao tác khi được yêu cầu.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {showConfirmModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
                      <div className="p-6">
                        <h2 className="text-lg font-semibold mb-2">Xác nhận cập nhật</h2>
                        <p className="text-sm text-gray-700 mb-4">
                          Sản phẩm hiện có trong giỏ hàng của một số khách hàng. Thao tác này sẽ loại bỏ các sản phẩm đó khỏi giỏ hàng của họ. Bạn có chắc muốn tiếp tục?
                        </p>
                        <div className="flex justify-end gap-3">
                          <button onClick={handleCancelConfirm} className="px-4 py-2 rounded bg-gray-100">Hủy</button>
                          <button onClick={handleConfirmSubmit} className="px-4 py-2 rounded bg-red-600 text-white">{processing ? 'Đang xử lý...' : 'Xác nhận và cập nhật'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </AppLayout>
    );
}
