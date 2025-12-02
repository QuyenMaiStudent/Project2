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
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <header className="mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Quản lý thương hiệu</h1>
                        <Link
                            href="/admin/brands/create"
                            className="bg-[#0AC1EF] text-white px-6 py-3 rounded-lg hover:bg-[#09b3db] transition-colors text-base md:text-lg"
                        >
                            + Thêm thương hiệu
                        </Link>
                    </div>
                </header>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">#</th>
                                <th className="py-3 px-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Logo</th>
                                <th className="py-3 px-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Tên</th>
                                <th className="py-3 px-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Mô tả</th>
                                <th className="py-3 px-4 text-center text-base md:text-lg font-semibold uppercase tracking-wider">Sản phẩm liên quan</th>
                                <th className="py-3 px-4 text-center text-base md:text-lg font-semibold uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {brands?.data?.length ? (
                                brands.data.map((b: any, i: number) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-gray-900 font-medium">
                                            {i + 1 + ((brands.meta?.current_page - 1) * brands.meta?.per_page || 0)}
                                        </td>

                                        <td className="py-3 px-4">
                                            {b.logo ? (
                                                <img
                                                    src={b.logo.startsWith('http') ? b.logo : `/storage/${b.logo}`}
                                                    alt={b.name}
                                                    className="h-16 w-40 object-contain"
                                                />
                                            ) : (
                                                <div className="h-16 w-40 bg-gray-100 text-gray-500 flex items-center justify-center text-sm md:text-base">
                                                    Không có Logo
                                                </div>
                                            )}
                                        </td>

                                        <td className="py-3 px-4 text-gray-900 font-semibold text-base md:text-lg">{b.name}</td>

                                        {/* Description: clamp to 3 lines with ellipsis */}
                                        <td className="py-3 px-4 max-w-[48rem]">
                                            <div
                                                className="text-base md:text-lg text-gray-700"
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
                                        <td className="py-3 px-4 text-center text-base md:text-lg text-gray-700">
                                            {b.products_count > 0 ? `${b.products_count} sản phẩm` : 'Không có'}
                                        </td>

                                        {/* Actions: ensure top alignment and buttons on same row */}
                                        <td className="py-3 px-4 text-center align-middle">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link
                                                    href={`/admin/brands/${b.id}/edit`}
                                                    className="bg-yellow-500 text-white px-5 py-3 rounded-lg hover:bg-yellow-600 transition-colors text-base md:text-lg"
                                                >
                                                    Sửa
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(b)}
                                                    disabled={b.has_products}
                                                    className={`px-5 py-3 rounded-lg transition-colors text-base md:text-lg ${
                                                        b.has_products
                                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                            : 'bg-red-600 text-white hover:bg-red-700'
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
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Chưa có thương hiệu nào.</h3>
                                            <p className="text-base md:text-lg text-gray-500">Hãy thêm thương hiệu mới để bắt đầu.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Inertia style) */}
                {brands?.links && brands.links.length > 1 && (
                    <div className="mt-4 flex justify-center gap-3 p-4 bg-gray-50">
                        {brands.links.map((l: any, idx: number) =>
                            l.url ? (
                                <Link
                                    key={idx}
                                    href={l.url}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 text-base md:text-lg ${
                                        l.active ? 'bg-[#0AC1EF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ) : (
                                <span
                                    key={idx}
                                    className="px-4 py-2 text-gray-400 text-base md:text-lg"
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            )
                        )}
                    </div>
                )}

                {/* Modal xác nhận xóa */}
                {showDeleteModal && selectedBrand && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">Xác nhận xóa</h2>
                            <p className="mb-4 text-base md:text-lg text-gray-700">Bạn có chắc muốn xóa thương hiệu "{selectedBrand.name}"?</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="bg-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-400 transition-colors text-base md:text-lg"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-500 transition-colors text-base md:text-lg"
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
