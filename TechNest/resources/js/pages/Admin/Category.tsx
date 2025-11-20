import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState, useRef } from 'react';

interface Category {
    id: number;
    name: string;
    description?: string;
    products_count: number; // Thêm để hiển thị số sản phẩm
}
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}
interface Props {
    categories: {
        data: Category[];
        links: PaginationLink[];
    };
}

export default function CategoryPage({ categories }: Props) {
    const [form, setForm] = useState({ name: '', description: '', id: null as number | null });
    const [isEdit, setIsEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { flash, errors } = usePage().props as any;
    const success = flash?.success;
    const error = flash?.error;
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && form.id) {
            router.put(`/admin/categories/${form.id}/update`, form);
        } else {
            router.post('/admin/categories', form);
        }
        setForm({ name: '', description: '', id: null });
        setIsEdit(false);
    };

    const handleEdit = (cat: Category) => {
        setForm({ name: cat.name, description: cat.description || '', id: cat.id });
        setIsEdit(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handleDeleteClick = (cat: Category) => {
        setSelectedCategory(cat);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedCategory) {
            router.delete(`/admin/categories/${selectedCategory.id}/delete`);
            setShowDeleteModal(false);
            setSelectedCategory(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedCategory(null);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Quản lý danh mục', href: '/admin/categories' }
            ]}
        >
            <Head title="Quản lý danh mục" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                {/* Notification cải thiện */}
                {(success || error) && (
                    <div className={`mb-4 p-4 rounded-lg shadow-sm border ${
                        success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                        <div className="flex items-center">
                            <svg className={`w-5 h-5 mr-2 ${success ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                {success ? (
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                ) : (
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                )}
                            </svg>
                            <span>{success || error}</span>
                            <button 
                                onClick={() => { /* Clear notification */ }}
                                className="ml-auto text-lg leading-none hover:opacity-70"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
                {/* Hiển thị lỗi validate tiếng Việt */}
                {errors && Object.keys(errors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                        <ul className="list-disc list-inside">
                            {Object.values(errors).map((err, idx) => (
                                <li key={idx}>{String(err)}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <header className="mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý danh mục sản phẩm</h1>
                </header>

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Tên danh mục</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1 text-gray-700">Mô tả</label>
                            <textarea
                                className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            className="bg-[#0AC1EF] text-white px-4 py-2 rounded hover:bg-[#09b3db] transition-colors"
                        >
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
                                onClick={() => {
                                    setForm({ name: '', description: '', id: null });
                                    setIsEdit(false);
                                }}
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Tên danh mục</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Mô tả</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Sản phẩm liên quan</th>
                                <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-12">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có danh mục nào.</h3>
                                            <p className="text-gray-500">Hãy thêm danh mục mới để bắt đầu.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-gray-900 font-medium">{cat.name}</td>
                                        <td className="py-3 px-4 text-gray-700">{cat.description}</td>
                                        <td className="py-3 px-4 text-center text-gray-700">
                                            {cat.products_count > 0 ? `${cat.products_count} sản phẩm` : 'Không có'}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
                                                    disabled={cat.products_count > 0}
                                                    className={`px-3 py-1 rounded transition-colors ${
                                                        cat.products_count > 0
                                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                            : 'bg-red-600 text-white hover:bg-red-700'
                                                    }`}
                                                    title={cat.products_count > 0 ? 'Không thể xóa vì đã có sản phẩm liên quan' : ''}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Phân trang */}
                    {categories.links && categories.links.length > 1 && (
                        <div className="mt-4 flex justify-center gap-1 p-4 bg-gray-50">
                            {categories.links.map((link, idx) =>
                                link.url ? (
                                    <button
                                        key={idx}
                                        className={`px-3 py-1 rounded transition-all duration-200 ${
                                            link.active ? 'bg-[#0AC1EF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        onClick={() => router.visit(link.url!)}
                                    />
                                ) : (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-gray-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Modal xác nhận xóa */}
                {showDeleteModal && selectedCategory && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận xóa</h2>
                            <p className="mb-4 text-gray-700">Bạn có chắc muốn xóa danh mục "{selectedCategory.name}"?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={cancelDelete}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
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
