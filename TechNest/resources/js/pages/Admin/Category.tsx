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
            <div className="max-w-3xl mx-auto p-6">
                {/* Thông báo thành công/lỗi */}
                {(success || error) && (
                    <div className={`mb-4 px-4 py-3 rounded text-white font-semibold ${success ? 'bg-green-600' : 'bg-red-600'}`}>
                        {success || error}
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
                <h1 className="text-2xl font-bold mb-6">Quản lý danh mục sản phẩm</h1>
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="mb-8 bg-white p-4 rounded shadow flex flex-col gap-3"
                >
                    <div>
                        <label className="block font-medium mb-1">Tên danh mục</label>
                        <input
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mô tả</label>
                        <textarea
                            className="border rounded px-3 py-2 w-full"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {isEdit ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        {isEdit && (
                            <button
                                type="button"
                                className="ml-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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
                <div className="bg-white rounded shadow">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-3 text-left">Tên danh mục</th>
                                <th className="py-2 px-3 text-left">Mô tả</th>
                                <th className="py-2 px-3 text-center">Sản phẩm liên quan</th>
                                <th className="py-2 px-3 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-500">
                                        Chưa có danh mục nào.
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map(cat => (
                                    <tr key={cat.id}>
                                        <td className="py-2 px-3">{cat.name}</td>
                                        <td className="py-2 px-3">{cat.description}</td>
                                        <td className="py-2 px-3 text-center">
                                            {cat.products_count > 0 ? `${cat.products_count} sản phẩm` : 'Không có'}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
                                                    disabled={cat.products_count > 0}
                                                    className={`px-3 py-1 rounded ${
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
                        <div className="mt-4 flex justify-center gap-1">
                            {categories.links.map((link, idx) =>
                                link.url ? (
                                    <button
                                        key={idx}
                                        className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>
                            <p className="mb-4">Bạn có chắc muốn xóa danh mục "{selectedCategory.name}"?</p>
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
