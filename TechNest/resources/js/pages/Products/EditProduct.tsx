import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller/dashboard',
    },
    {
        title: 'Products',
        href: '/seller/products',
    },
    {
        title: 'Edit Product',
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

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    brand_id: number;
    warranty_id: number | null;
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
}

export default function EditProduct({ product, brands = [], warranties = [] }: Props) {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.primary_image?.url || null
    );

    // Đảm bảo brands và warranties là mảng
    const safeBrands = Array.isArray(brands) ? brands : [];
    const safeWarranties = Array.isArray(warranties) ? warranties : [];

    // Hàm kiểm tra URL hoặc số điện thoại - giống AddProduct
    const containsUrlOrPhone = (text?: string) => {
        const t = (text ?? '').trim();
        if (!t) return false;

        // Phát hiện URL: http(s)://... hoặc www.... hoặc domain.tld
        if (/(https?:\/\/|www\.)[^\s]+/i.test(t) || /\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i.test(t)) {
            return true;
        }

        // Phát hiện số điện thoại (chuỗi số >= 7 chữ số liên tiếp)
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

    // Sửa lại khởi tạo useForm - ép kiểu đúng ngay từ đầu:
    const { data, setData, put, processing, errors } = useForm({
        name: String(product.name || ''),
        description: String(product.description || ''),
        price: String(product.price || ''), // Giữ dạng string cho input number
        stock: String(product.stock || ''), // Giữ dạng string cho input number  
        brand_id: String(product.brand_id || ''), // Giữ dạng string cho select
        warranty_id: product.warranty_id ? String(product.warranty_id) : '', 
        is_active: Boolean(product.is_active),
        image: null as File | null,
    });

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
            setImagePreview(product.primary_image?.url || null);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log('Form data before submit:', data);

        // Client-side validation cho URL/Phone
        const okName = validateField('name', data.name);
        const okDesc = validateField('description', data.description || '');

        if (!okName || !okDesc) {
            console.log('Client validation failed');
            return;
        }

        // Kiểm tra các trường bắt buộc
        if (!data.name?.trim()) {
            setClientErrors(prev => ({ ...prev, name: 'Tên sản phẩm không được để trống.' }));
            return;
        }

        // Chuyển đổi và validate số
        const price = parseFloat(data.price);
        const stock = parseInt(data.stock);
        const brandId = parseInt(data.brand_id);

        if (isNaN(price) || price <= 0) {
            setClientErrors(prev => ({ ...prev, price: 'Giá sản phẩm phải là số và lớn hơn 0.' }));
            return;
        }

        if (isNaN(stock) || stock < 0) {
            setClientErrors(prev => ({ ...prev, stock: 'Số lượng phải là số và không được âm.' }));
            return;
        }

        if (isNaN(brandId) || !data.brand_id) {
            setClientErrors(prev => ({ ...prev, brand_id: 'Vui lòng chọn thương hiệu.' }));
            return;
        }

        console.log('Final submit data:', data);

        // Tạo FormData thủ công để đảm bảo đúng format
        const formData = new FormData();
        
        // Thêm các trường bắt buộc với đúng kiểu
        formData.append('name', data.name.trim());
        formData.append('description', data.description || '');
        formData.append('price', String(price)); // Đảm bảo là string number
        formData.append('stock', String(stock)); // Đảm bảo là string number
        formData.append('brand_id', String(brandId)); // Đảm bảo là string number
        
        if (data.warranty_id && data.warranty_id !== '') {
            formData.append('warranty_id', String(data.warranty_id));
        }
        
        formData.append('is_active', data.is_active ? '1' : '0'); // Convert boolean to string
        
        if (data.image) {
            formData.append('image', data.image);
        }

        // Thêm method spoofing cho PUT request
        formData.append('_method', 'PUT');

        // Debug FormData
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Submit bằng fetch thay vì Inertia để tránh lỗi conversion
        fetch(`/seller/products/${product.id}`, {
            method: 'POST', // Laravel method spoofing
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data && data.errors) {
                console.error('Validation errors:', data.errors);
                // Handle errors here if needed
            }
        })
        .catch(error => {
            console.error('Request failed:', error);
        });
    };

    // Hàm kiểm tra có thay đổi gì không
    const checkForChanges = () => {
        return (
            data.name !== String(product.name || '') ||
            data.description !== String(product.description || '') ||
            data.price !== String(product.price || '') ||
            data.stock !== String(product.stock || '') ||
            data.brand_id !== String(product.brand_id || '') ||
            data.warranty_id !== (product.warranty_id ? String(product.warranty_id) : '') ||
            data.is_active !== Boolean(product.is_active) ||
            data.image !== null
        );
    };

    // Thêm useEffect để debug data
    useEffect(() => {
        console.log('Current form data:', data);
        console.log('Original product:', product);
    }, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product - ${product.name}`} />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
                        <p className="text-gray-600 mt-1">Update your product information</p>
                        
                        {/* Hiển thị trạng thái thay đổi */}
                        {checkForChanges() && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                Bạn có thay đổi chưa được lưu
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6">
                        {/* Error Messages */}
                        {(Object.keys(errors).length > 0 || Object.keys(clientErrors).length > 0) && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                <div className="text-red-800">
                                    <ul className="list-disc list-inside">
                                        {Object.entries({ ...errors, ...clientErrors }).map(([field, error]) => (
                                            <li key={field}>
                                                {typeof error === 'string' ? error : (Array.isArray(error) ? error[0] : String(error))}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => {
                                        setData('name', e.target.value);
                                        validateField('name', e.target.value);
                                    }}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.name || clientErrors.name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {(errors.name || clientErrors.name) && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.name || clientErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => {
                                        setData('description', e.target.value);
                                        validateField('description', e.target.value);
                                    }}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.description || clientErrors.description ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter product description..."
                                />
                                {(errors.description || clientErrors.description) && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.description || clientErrors.description}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (VND) *
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)} // Giữ string
                                    min="0"
                                    step="1000"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.price || clientErrors.price ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {(errors.price || clientErrors.price) && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.price || clientErrors.price}
                                    </p>
                                )}
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)} // Giữ string
                                    min="0"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.stock || clientErrors.stock ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {(errors.stock || clientErrors.stock) && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.stock || clientErrors.stock}
                                    </p>
                                )}
                            </div>

                            {/* Brand */}
                            <div>
                                <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand *
                                </label>
                                <select
                                    id="brand_id"
                                    value={data.brand_id}
                                    onChange={(e) => setData('brand_id', e.target.value)} // Giữ string
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.brand_id || clientErrors.brand_id ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">-- Select Brand --</option>
                                    {safeBrands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {(errors.brand_id || clientErrors.brand_id) && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.brand_id || clientErrors.brand_id}
                                    </p>
                                )}
                            </div>

                            {/* Warranty */}
                            <div>
                                <label htmlFor="warranty_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Warranty Policy
                                </label>
                                <select
                                    id="warranty_id"
                                    value={data.warranty_id}
                                    onChange={(e) => setData('warranty_id', e.target.value)} // Giữ string
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.warranty_id ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- No Warranty --</option>
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

                            {/* Product Image */}
                            <div className="md:col-span-2">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Image
                                </label>
                                
                                {/* Current Image Preview */}
                                {imagePreview && (
                                    <div className="mb-3">
                                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                                        <img 
                                            src={imagePreview} 
                                            alt="Current product image" 
                                            className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                        />
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.image ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave empty to keep current image (JPEG, PNG, JPG, GIF, WebP - Max 4MB)
                                </p>
                                
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
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active Product</span>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="md:col-span-2 flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing || Object.keys(clientErrors).length > 0}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Product'}
                                </button>
                                
                                <a
                                    href="/seller/products"
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
                                >
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
