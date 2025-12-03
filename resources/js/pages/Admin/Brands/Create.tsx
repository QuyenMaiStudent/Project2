import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

function Create() {
    const { breadcrumbs }: any = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        logo: null,      // File
        logo_url: '',    // External URL (optional)
        description: '',
    });

    const [useUrl, setUseUrl] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        // preview: prefer file object url, otherwise logo_url
        if (data.logo && typeof data.logo !== 'string') {
            const objUrl = URL.createObjectURL(data.logo as File);
            setPreview(objUrl);
            return () => URL.revokeObjectURL(objUrl);
        }
        setPreview(data.logo_url || null);
    }, [data.logo, data.logo_url]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        setData('logo_url', '');
    };

    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setData('logo_url', url);
        setData('logo', null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/brands', {
            onSuccess: () => reset(),
        });
    };

    const fallbackBreadcrumbs = [
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý thương hiệu', href: '/admin/brands' },
        { title: 'Thêm', href: '/admin/brands/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs ?? fallbackBreadcrumbs}>
            <Head title="Thêm thương hiệu" />
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-base md:text-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 border-l-4 border-[#0AC1EF] pl-4">Thêm thương hiệu mới</h2>
                        <Link href="/admin/brands" className="text-base md:text-lg text-[#0AC1EF] hover:text-[#09b3db] transition-colors">Quay lại</Link>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="mb-4">
                            <label className="block text-base md:text-lg font-medium mb-1 text-gray-700">Tên thương hiệu</label>
                            <input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                                type="text"
                                placeholder="Tên thương hiệu"
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-base md:text-lg font-medium mb-1 text-gray-700">Logo</label>

                            <div className="flex gap-3 mb-2">
                                <label className={`px-3 py-1 rounded border cursor-pointer transition-colors ${!useUrl ? 'bg-[#0AC1EF] text-white border-[#0AC1EF]' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="logo_choice"
                                        checked={!useUrl}
                                        onChange={() => setUseUrl(false)}
                                        className="hidden"
                                    />
                                    Tải ảnh lên
                                </label>
                                <label className={`px-3 py-1 rounded border cursor-pointer transition-colors ${useUrl ? 'bg-[#0AC1EF] text-white border-[#0AC1EF]' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="logo_choice"
                                        checked={useUrl}
                                        onChange={() => setUseUrl(true)}
                                        className="hidden"
                                    />
                                    Dùng URL
                                </label>
                            </div>

                            {!useUrl ? (
                                <input
                                    onChange={onFileChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                                    type="file"
                                    accept="image/*"
                                />
                            ) : (
                                <input
                                    value={data.logo_url}
                                    onChange={onUrlChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                                    type="url"
                                    placeholder="https://example.com/logo.png"
                                />
                            )}
                            {errors.logo && <div className="text-red-600 text-sm mt-1">{errors.logo}</div>}
                            {errors.logo_url && <div className="text-red-600 text-sm mt-1">{errors.logo_url}</div>}

                            {/* Preview box */}
                            <div className="mt-3">
                                <div className="w-48 h-24 border border-gray-300 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {preview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={preview} alt="Logo preview" className="max-h-full object-contain" />
                                    ) : (
                                        <span className="text-sm text-gray-500">Xem trước</span>
                                    )}
                                </div>
                                <p className="text-sm md:text-base text-gray-500 mt-1">Bạn có thể upload file hoặc dán URL. Nếu dùng URL, server cần chấp nhận logo_url (hoặc tự download nếu muốn lưu vào storage).</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-base md:text-lg font-medium mb-1 text-gray-700">Mô tả (tùy chọn)</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-base md:text-lg focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                                rows={4}
                            />
                            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                className="bg-[#0AC1EF] text-white px-4 py-2 rounded hover:bg-[#09b3db] transition-colors disabled:opacity-60 text-base md:text-lg"
                                disabled={processing}
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

export default Create;
