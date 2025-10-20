import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

function Edit() {
    const { brand, breadcrumbs }: any = usePage().props;
    
    // State cho form
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState('');
    const [useUrl, setUseUrl] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Đồng bộ state với prop brand khi brand ready
    useEffect(() => {
        if (!brand) return;
        
        setName(brand.name || '');
        setDescription(brand.description || '');
        
        // Nếu logo là URL
        if (brand.logo && String(brand.logo).startsWith('http')) {
            setLogoUrl(brand.logo);
            setUseUrl(true);
            setPreview(brand.logo);
        } 
        // Nếu logo là file
        else if (brand.logo) {
            setLogoUrl('');
            setUseUrl(false);
            setPreview(`/storage/${brand.logo}`);
        } 
        // Không có logo
        else {
            setLogoUrl('');
            setUseUrl(false);
            setPreview(null);
        }
    }, [brand]);

    // Cập nhật preview khi chọn file
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setLogo(file);
            setLogoUrl('');
            setUseUrl(false);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Cập nhật preview khi nhập URL
    const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setLogoUrl(url);
        setLogo(null);
        setUseUrl(true);
        
        if (url) {
            setPreview(url);
        } else {
            setPreview(null);
        }
    };

    // Xử lý submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        // Tạo FormData để gửi cả file và text
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Quan trọng: Laravel method spoofing
        
        // Chỉ gửi các trường đã thay đổi
        if (name !== brand.name) {
            formData.append('name', name);
        }
        
        if (description !== brand.description) {
            formData.append('description', description);
        }
        
        // Xử lý logo - chọn file hoặc URL
        if (logo) {
            formData.append('logo', logo);
        } else if (logoUrl && logoUrl !== brand.logo) {
            formData.append('logo_url', logoUrl);
        }
        
        // Gửi request POST (với _method=PUT) - không dùng PUT trực tiếp với file
        router.post(`/admin/brands/${brand.id}`, formData, {
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            },
            preserveScroll: true,
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

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Tên thương hiệu</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                        onChange={() => { setUseUrl(false); setLogoUrl(''); }}
                                        className="hidden"
                                    />
                                    Upload file
                                </label>
                                <label className={`px-3 py-1 rounded border cursor-pointer ${useUrl ? 'bg-gray-100' : ''}`}>
                                    <input
                                        type="radio"
                                        name="logo_choice"
                                        checked={useUrl}
                                        onChange={() => { setUseUrl(true); setLogo(null); }}
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
                                    value={logoUrl}
                                    onChange={onUrlChange}
                                    className="w-full border rounded p-2"
                                    type="url"
                                    placeholder="https://example.com/logo.png"
                                />
                            )}
                            {errors.logo && <div className="text-red-600 text-sm mt-1">{errors.logo}</div>}
                            {errors.logo_url && <div className="text-red-600 text-sm mt-1">{errors.logo_url}</div>}

                            <div className="mt-3">
                                <div className="w-48 h-24 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                                    {preview ? (
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                {processing ? 'Đang lưu...' : 'Cập nhật'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

export default Edit;
