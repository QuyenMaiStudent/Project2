import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, ChangeEvent } from 'react';
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
    brands: Brand[];
    warranties: Warranty[];
}

export default function AddProduct({ brands, warranties }: Props) {
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

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData('image', e.target.files ? e.target.files[0] : null);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('brand_id', data.brand_id);
        if (data.warranty_id) formData.append('warranty_id', data.warranty_id);
        formData.append('is_active', data.is_active ? '1' : '0');
        if (data.image) formData.append('image', data.image);

        post('/seller/products', {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Product" />
            
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Add New Product</h1>
                    </div>
                    
                    <div className="p-6">
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                <div className="text-red-800">
                                    <ul className="list-disc list-inside">
                                        {Object.entries(errors).map(([field, error]) => (
                                            <li key={field}>{Array.isArray(error) ? error[0] : error}</li>
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
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
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
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.description ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (VNĐ) *
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
                                        Stock *
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
                                        Brand *
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
                                        <option value="">-- Select Brand --</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.brand_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.brand_id}</p>
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
                                        onChange={(e) => setData('warranty_id', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.warranty_id ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">-- No Warranty --</option>
                                        {warranties.map((warranty) => (
                                            <option key={warranty.id} value={warranty.id}>
                                                {warranty.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.warranty_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.warranty_id}</p>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="md:col-span-2">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Image *
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
                                        Select an image (JPEG, PNG, JPG, GIF, WebP - Max 4MB)
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
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Active Product
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
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
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