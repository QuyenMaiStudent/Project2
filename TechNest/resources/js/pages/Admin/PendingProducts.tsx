import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: number;
    brand: { name: string };
    created_by: { name: string };
    created_at: string;
}

interface Props {
    products: {
        data: Product[];
        links: any[];
    };
}

export default function PendingProducts({ products }: Props) {
    const { flash } = usePage().props as any;

    const handleApprove = (productId: number) => {
        if (confirm('Bạn có chắc muốn duyệt sản phẩm này?')) {
            router.post(`/admin/products/${productId}/approve`);
        }
    };

    const handleReject = (productId: number) => {
        if (confirm('Bạn có chắc muốn từ chối sản phẩm này?')) {
            router.post(`/admin/products/${productId}/reject`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin Dashboard', href: '/admin/dashboard' },
                { title: 'Sản phẩm chờ duyệt', href: '/admin/products/pending' },
            ]}
        >
            <Head title="Sản phẩm chờ duyệt" />
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Sản phẩm chờ duyệt</h1>
                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>
                )}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thương hiệu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Seller
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        Không có sản phẩm chờ duyệt
                                    </td>
                                </tr>
                            ) : (
                                products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.brand?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.created_by?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(product.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                                >
                                                    Xem
                                                </Link>
                                                <button
                                                    onClick={() => handleApprove(product.id)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleReject(product.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                >
                                                    Từ chối
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products.links && (
                    <div className="mt-4 flex justify-center">
                        {/* Component pagination tương tự như các trang khác */}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
