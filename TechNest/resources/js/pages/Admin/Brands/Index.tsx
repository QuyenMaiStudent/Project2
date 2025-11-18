import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';

function Index() {
    const { brands, breadcrumbs }: any = usePage().props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<any>(null);

    const handleDeleteClick = (brand: any) => {
        setSelectedBrand(brand);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedBrand) {
            router.delete(`/admin/brands/${selectedBrand.id}`);
            setShowDeleteModal(false);
            setSelectedBrand(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedBrand(null);
    };

    const fallbackBreadcrumbs = [
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý thương hiệu', href: '/admin/brands' },
    ];

    return (
        <AppLayout
            breadcrumbs={breadcrumbs ?? fallbackBreadcrumbs}
        >
            <Head title="Quản lý thương hiệu" />
            <div className="p-6 bg-gray-100 min-h-[80vh]">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Danh sách thương hiệu</h1>
                    <Link
                        href="/admin/brands/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                    >
                        + Thêm thương hiệu
                    </Link>
                </div>

                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 border">#</th>
                                <th className="p-3 border">Logo</th>
                                <th className="p-3 border">Tên</th>
                                <th className="p-3 border">Mô tả</th>
                                <th className="p-3 border text-center">Sản phẩm liên quan</th>
                                <th className="p-3 border text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands?.data?.length ? (
                                brands.data.map((b: any, i: number) => (
                                    <tr key={b.id} className="border-t">
                                        <td className="p-3 align-top">
                                            {i + 1 + ((brands.meta?.current_page - 1) * brands.meta?.per_page || 0)}
                                        </td>

                                        <td className="p-3 align-top">
                                            {b.logo ? (
                                                <img
                                                    src={b.logo.startsWith('http') ? b.logo : `/storage/${b.logo}`}
                                                    alt={b.name}
                                                    className="h-12 w-32 object-contain"
                                                />
                                            ) : (
                                                <div className="h-12 w-32 bg-gray-100 text-gray-500 flex items-center justify-center text-xs">
                                                    Không có Logo
                                                </div>
                                            )}
                                        </td>

                                        <td className="p-3 align-top">{b.name}</td>

                                        {/* Description: clamp to 3 lines with ellipsis */}
                                        <td className="p-3 align-top max-w-[48rem]">
                                            <div
                                                className="text-sm text-gray-700"
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {b.description || '-'}
                                            </div>
                                        </td>

                                        {/* Sản phẩm liên quan */}
                                        <td className="p-3 text-center align-top">
                                            {b.products_count > 0 ? `${b.products_count} sản phẩm` : 'Không có'}
                                        </td>

                                        {/* Actions: ensure top alignment and buttons on same row */}
                                        <td className="p-3 text-center align-top">
                                            <div className="flex items-start justify-center gap-2">
                                                <Link
                                                    href={`/admin/brands/${b.id}/edit`}
                                                    className="inline-block bg-yellow-400 text-black px-3 py-1 rounded"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(b)}
                                                    disabled={b.has_products}
                                                    className={`inline-block px-3 py-1 rounded ${
                                                        b.has_products
                                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                            : 'bg-red-600 text-white hover:bg-red-500'
                                                    }`}
                                                    title={b.has_products ? 'Không thể xóa vì đã có sản phẩm liên quan' : ''}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        Không có thương hiệu nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Inertia style) */}
                <div className="mt-4 flex items-center justify-end space-x-2">
                    {brands?.links?.map((l: any, idx: number) => (
                        <Link
                            key={idx}
                            href={l.url ?? '#'}
                            className={`px-3 py-1 rounded border text-sm ${l.active ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}
                            preserveScroll
                        >
                            <span dangerouslySetInnerHTML={{ __html: l.label }} />
                        </Link>
                    ))}
                </div>

                {/* Modal xác nhận xóa */}
                {showDeleteModal && selectedBrand && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
                            <p className="mb-4">Bạn có chắc muốn xóa thương hiệu "{selectedBrand.name}"?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={cancelDelete}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

export default Index;
