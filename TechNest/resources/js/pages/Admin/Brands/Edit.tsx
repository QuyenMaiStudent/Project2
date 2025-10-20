import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

function Edit() {
    const { brand, breadcrumbs }: any = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        name: brand?.name || '',
        logo: null,
        logo_url: '',
        description: brand?.description || '',
    });

    const [useUrl, setUseUrl] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        // prefer file preview, otherwise logo_url, otherwise existing brand.logo
        if (data.logo && typeof data.logo !== 'string') {
            const objUrl = URL.createObjectURL(data.logo as File);
            setPreview(objUrl);
            return () => URL.revokeObjectURL(objUrl);
        }
        if (data.logo_url) {
            setPreview(data.logo_url);
            return;
        }
        if (brand?.logo) {
            setPreview(brand.logo.startsWith('http') ? brand.logo : `/storage/${brand.logo}`);
            return;
        }
        setPreview(null);
    }, [data.logo, data.logo_url, brand]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        setData('logo_url', '');
        setUseUrl(false);
    };

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setData('logo_url', url);
        setData('logo', null);
        setUseUrl(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/brands/${brand.id}`, {
            forceFormData: true,
            onSuccess: () => {
                // optional post-update action
            },
        });
    };

    const fallbackBreadcrumbs = [
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý thương hiệu', href: '/admin/brands' },
        { title: 'Chỉnh sửa', href: `/admin/brands/${brand?.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs ?? fallbackBreadcrumbs}>
            <Head title="Chỉnh sửa thương hiệu" />
            <div className="p-6 bg-gray-100 min-h-[70vh]">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Chỉnh sửa thương hiệu</h2>
                        <Link href="/admin/brands" className="text-sm text-gray-600">Quay lại</Link>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Tên thương hiệu</label>
                            <input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border rounded p-2"
                                type="text"
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Logo (đổi / bỏ qua để giữ hiện tại)</label>

                            <div className="flex gap-3 mb-2">
                                <label className={`px-3 py-1 rounded border cursor-pointer ${!useUrl ? 'bg-gray-100' : ''}`}>
                                    <input
                                        type="radio"
                                        name="logo_choice"
                                        checked={!useUrl}
                                        onChange={() => { setUseUrl(false); setData('logo_url', ''); }}
                                        className="hidden"
                                    />
                                    Upload file
                                </label>
                                <label className={`px-3 py-1 rounded border cursor-pointer ${useUrl ? 'bg-gray-100' : ''}`}>
                                    <input
                                        type="radio"
                                        name="logo_choice"
                                        checked={useUrl}
                                        onChange={() => { setUseUrl(true); setData('logo', null); }}
                                        className="hidden"
                                    />
                                    Dùng URL
                                </label>
                            </div>

                            {!useUrl ? (
                                <input
                                    onChange={onFileChange}
                                    className="w-full"
                                    type="file"
                                    accept="image/*"
                                />
                            ) : (
                                <input
                                    value={data.logo_url}
                                    onChange={onUrlChange}
                                    className="w-full border rounded p-2"
                                    type="url"
                                    placeholder="https://example.com/logo.png"
                                />
                            )}
                            {errors.logo && <div className="text-red-600 text-sm mt-1">{errors.logo}</div>}
                            {errors.logo_url && <div className="text-red-600 text-sm mt-1">{errors.logo_url}</div>}

                            {/* Preview box */}
                            <div className="mt-3">
                                <div className="w-48 h-24 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Logo preview" className="max-h-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-gray-500">Preview</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Upload file hoặc nhập URL. Không nhập cả hai — nếu có file sẽ ưu tiên file.</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm mb-1">Mô tả</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full border rounded p-2"
                                rows={4}
                            />
                            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                className="bg-yellow-500 text-black px-4 py-2 rounded disabled:opacity-60"
                                disabled={processing}
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

export default Edit;
