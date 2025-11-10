import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, ChangeEvent, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller/dashboard',
    },
    {
        title: 'Add Product',
        href: '/seller/products/create',
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

interface Props {
    brands?: Brand[]; // Thêm ? để optional
    warranties?: Warranty[]; // Thêm ? để optional
}

export default function AddProduct({ brands = [], warranties = [] }: Props) {
    const [clientErrors, setClientErrors] = useState<Record<string,string>>({});

    // Đảm bảo brands và warranties là mảng
    const safebrands = Array.isArray(brands) ? brands : [];
    const safeWarranties = Array.isArray(warranties) ? warranties : [];

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
        stock: '',
        brand_id: '',
        warranty_id: '',
        is_active: true,
        image: null as File | null,
    });

    // Thêm state cho preview ảnh
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('image', file);
        
        // Tạo preview
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Debug log
        console.log('Form submission started', {
            data,
            imageSelected: data.image?.name,
            imageSize: data.image?.size,
            clientErrors
        });
        
        // client-side validation
        const okName = validateField('name', data.name);
        const okDesc = validateField('description', data.description);
        
        if (!okName || !okDesc) {
            console.log('Client validation failed');
            return;
        }

        if (!data.image) {
            alert('Vui lòng chọn ảnh sản phẩm!');
            return;
        }

        // use useForm.post so Inertia knows about our form state (useForm supports files)
        post('/seller/products', {
            forceFormData: true,
            preserveScroll: true,
            onStart: () => {
                console.log('Request started');
            },
            onProgress: (progress) => {
                console.log('Upload progress:', progress);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
            },
            onSuccess: () => {
                console.log('Form submitted successfully');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Thêm sản phẩm mới</h1>
                    </div>
                    
                    <div className="p-6">
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                <div className="text-red-800">
                                    <ul className="list-disc list-inside">
                                        {Object.entries(errors).map(([field, error]) => (
                                            <li key={field}>
                                                {typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên sản phẩm *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => { setData('name', e.target.value); validateField('name', e.target.value); }}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                    )}
                                    {clientErrors.name && <p className="text-red-600 text-sm mt-1">{clientErrors.name}</p>}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => { setData('description', e.target.value); validateField('description', e.target.value); }}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.description ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                    )}
                                    {clientErrors.description && <p className="text-red-600 text-sm mt-1">{clientErrors.description}</p>}
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Giá (VNĐ) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        min="0"
                                        step="1000"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.price ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.price && (
                                        <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                    )}
                                </div>

                                {/* Stock */}
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                        Số lượng *
                                    </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.stock ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.stock && (
                                        <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
                                    )}
                                </div>

                                {/* Brand */}
                                <div>
                                    <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Thương hiệu *
                                    </label>
                                    <select
                                        id="brand_id"
                                        value={data.brand_id}
                                        onChange={(e) => setData('brand_id', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.brand_id ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">-- Chọn thương hiệu --</option>
                                        {safebrands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand_id && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {typeof errors.brand_id === 'string' ? errors.brand_id : (Array.isArray(errors.brand_id) ? errors.brand_id[0] : String(errors.brand_id))}
                                        </p>
                                    )}
                                </div>

                                {/* Warranty */}
                                <div>
                                    <label htmlFor="warranty_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Chính sách bảo hành
                                    </label>
                                    <select
                                        id="warranty_id"
                                        value={data.warranty_id}
                                        onChange={(e) => setData('warranty_id', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.warranty_id ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">-- Không bảo hành --</option>
                                        {safeWarranties.map((warranty) => (
                                            <option key={warranty.id} value={warranty.id}>
                                                {warranty.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.warranty_id && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {typeof errors.warranty_id === 'string' ? errors.warranty_id : (Array.isArray(errors.warranty_id) ? errors.warranty_id[0] : String(errors.warranty_id))}
                                        </p>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="md:col-span-2">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình ảnh sản phẩm *
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.image ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Chọn hình ảnh (JPEG, PNG, JPG, GIF, WebP - Max 4MB)
                                    </p>
                                    
                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Xem trước:</p>
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                            />
                                        </div>
                                    )}
                                    
                                    {errors.image && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {Array.isArray(errors.image) ? errors.image[0] : errors.image}
                                        </p>
                                    )}
                                </div>

                                {/* Active Status */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Sản phẩm hoạt động
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-4 mt-8">
                                <Link
                                    href="/seller/dashboard"
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || Object.keys(clientErrors).length > 0}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing ? 'Adding...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
