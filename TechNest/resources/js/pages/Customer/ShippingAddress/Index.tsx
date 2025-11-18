import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState, useEffect } from 'react';
import LeafletMapPicker from '@/components/LeafletMapPicker'; // Changed from GoogleMapPicker

interface Address {
    id: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    province_code: string;
    province_name?: string;
    ward_code: string;
    ward_name?: string;
    is_default: boolean;
    latitude?: number | null;
    longitude?: number | null;
    full_address: string;
}

interface Province { code: string; name: string; }
interface Ward { code: string; name: string; province_code: string; }

interface Props {
    addresses: {
        data: Address[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    provinces: Province[];
    wards: Ward[];
}

export default function Index({ addresses, provinces, wards }: Props) {
    const { flash } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        id: null as number | null,
        recipient_name: '',
        phone: '',
        address_line: '',
        province_code: '',
        ward_code: '',
        latitude: '',
        longitude: '',
        is_default: false,
    });
    const [errors, setErrors] = useState<any>({});

    const resetForm = () => {
        setForm({
            id: null,
            recipient_name: '',
            phone: '',
            address_line: '',
            province_code: '',
            ward_code: '',
            latitude: '',
            longitude: '',
            is_default: false,
        });
        setErrors({});
        setIsEdit(false);
        setShowForm(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (isEdit && form.id) {
            router.put(`/shipping-addresses/${form.id}`, form, {
                onSuccess: resetForm,
                onError: setErrors,
            });
        } else {
            router.post('/shipping-addresses', form, {
                onSuccess: resetForm,
                onError: setErrors,
            });
        }
    };

    const handleEdit = (addr: Address) => {
        setForm({
            id: addr.id,
            recipient_name: addr.recipient_name,
            phone: addr.phone,
            address_line: addr.address_line,
            province_code: addr.province_code ?? '',
            ward_code: addr.ward_code ?? '',
            latitude: addr.latitude?.toString() ?? '',
            longitude: addr.longitude?.toString() ?? '',
            is_default: addr.is_default,
        });
        setIsEdit(true);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            router.delete(`/shipping-addresses/${id}`);
        }
    };

    const filteredWards = wards.filter(w => w.province_code == form.province_code);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/customer/dashboard' },
                { title: 'Địa chỉ giao hàng', href: '/shipping-addresses' }
            ]}
        >
            <Head title="Địa chỉ giao hàng" />
            <div className="max-w-3xl mx-auto p-6">
                {flash?.success && (
                    <div className="mb-4 px-4 py-3 rounded text-white font-semibold bg-green-600">
                        {flash.success}
                    </div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Địa chỉ giao hàng</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => { resetForm(); setShowForm(true); }}
                    >
                        Thêm mới
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-8 bg-white p-4 rounded shadow flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">{isEdit ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</span>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-red-600"
                                onClick={resetForm}
                                title="Đóng"
                            >✕</button>
                        </div>
                        
                        <div>
                            <label className="block font-medium mb-1">Người nhận</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full"
                                value={form.recipient_name}
                                onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))}
                                required
                            />
                            {errors.recipient_name && <div className="text-red-600 text-sm">{errors.recipient_name}</div>}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                required
                            />
                            {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                className="border rounded px-3 py-2 w-full"
                                value={form.address_line}
                                onChange={e => setForm(f => ({ ...f, address_line: e.target.value }))}
                                required
                            />
                            {errors.address_line && <div className="text-red-600 text-sm">{errors.address_line}</div>}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Tỉnh/Thành phố</label>
                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={form.province_code}
                                onChange={e => {
                                    setForm(f => ({
                                        ...f,
                                        province_code: e.target.value,
                                        ward_code: '',
                                    }));
                                }}
                                required
                            >
                                <option value="">-- Chọn tỉnh/thành --</option>
                                {provinces.map(p => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                            </select>
                            {errors.province_code && <div className="text-red-600 text-sm">{errors.province_code}</div>}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Phường/Xã</label>
                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={form.ward_code}
                                onChange={e => setForm(f => ({ ...f, ward_code: e.target.value }))}
                                required
                                disabled={!form.province_code}
                            >
                                <option value="">-- Chọn phường/xã --</option>
                                {filteredWards.map(w => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                ))}
                            </select>
                            {errors.ward_code && <div className="text-red-600 text-sm">{errors.ward_code}</div>}
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Vị trí trên bản đồ</label>
                            <LeafletMapPicker
                                lat={form.latitude ? Number(form.latitude) : undefined}
                                lng={form.longitude ? Number(form.longitude) : undefined}
                                onLocationChange={(lat, lng, formattedAddress) => {
                                    setForm(f => ({
                                        ...f,
                                        latitude: lat.toString(),
                                        longitude: lng.toString(),
                                        address_line: formattedAddress ?? f.address_line,
                                    }));
                                }}
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Mặc định</label>
                            <input
                                type="checkbox"
                                checked={form.is_default}
                                onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
                            /> Đặt làm địa chỉ mặc định
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                {isEdit ? 'Cập nhật' : 'Lưu'}
                            </button>
                            <button
                                type="button"
                                className="ml-2 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={resetForm}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                )}

                <div className="bg-white rounded shadow">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-3 text-left">Người nhận</th>
                                <th className="py-2 px-3 text-left">Số điện thoại</th>
                                <th className="py-2 px-3 text-left">Địa chỉ</th>
                                <th className="py-2 px-3 text-center">Mặc định</th>
                                <th className="py-2 px-3 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {addresses.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        Chưa có địa chỉ nào.
                                    </td>
                                </tr>
                            ) : (
                                addresses.data.map((addr: Address) => (
                                    <tr key={addr.id}>
                                        <td className="py-2 px-3">{addr.recipient_name}</td>
                                        <td className="py-2 px-3">{addr.phone}</td>
                                        <td className="py-2 px-3">
                                            <div>{addr.address_line}</div>
                                            <div className="text-sm text-gray-500">
                                                {[addr.ward_name, addr.province_name].filter(Boolean).join(', ')}
                                            </div>
                                            {addr.latitude && addr.longitude && (
                                                <a
                                                    href={`https://www.openstreetmap.org/?mlat=${addr.latitude}&mlon=${addr.longitude}#map=16/${addr.latitude}/${addr.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-xs"
                                                >
                                                    Xem bản đồ
                                                </a>
                                            )}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            {addr.is_default ? (
                                                <span className="text-green-600 font-semibold">Mặc định</span>
                                            ) : ''}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(addr)}
                                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(addr.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

                    {addresses.links && addresses.links.length > 1 && (
                        <div className="mt-4 flex justify-center gap-1 pb-4">
                            {addresses.links.map((link, idx) =>
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
            </div>
        </AppLayout>
    );
}
