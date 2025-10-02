import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Package, Eye, Edit, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Seller Dashboard',
        href: '/seller/dashboard',
    },
    {
        title: 'View Products',
        href: '/seller/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    is_active: boolean;
    brand: {
        name: string;
    };
    primary_image?: {
        url: string;
        alt_text: string;
    };
    seller: {
        name: string;
    };
}

interface Props {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
}

function Pagination({ links }: { links: any[] }) {
    return (
        <nav className="flex gap-2">
            {links.map((link, idx) => (
                link.url ? (
                    <Link
                        key={idx}
                        href={link.url}
                        className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-100`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={idx}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </nav>
    );
}

export default function ViewProduct({ products }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Products" />
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">My Products</h1>
                    <Link
                        href="/seller/products/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                        <Package className="h-4 w-4" />
                        <span>Add Product</span>
                    </Link>
                </div>

                {products.data.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-500 mb-4">Start by adding your first product</p>
                        <Link
                            href="/seller/products/create"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add First Product
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.data.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="aspect-w-16 aspect-h-9">
                                    {product.primary_image ? (
                                        <img
                                            src={product.primary_image ? product.primary_image.url : '/images/no-image.png'}
                                            alt={product.primary_image ? product.primary_image.alt_text : product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <Package className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                                            {product.name}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            product.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">
                                        Brand: {product.brand.name}
                                    </p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(Number(product.price))}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View</span>
                                        </Link>
                                        
                                        <Link
                                            href={`/seller/products/${product.id}/edit`}
                                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span>Edit</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {products.data.length > 0 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination links={products.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}