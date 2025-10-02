import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState, useEffect } from 'react';

interface Address {
    id: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    province_id: number;
    district_id: number;
    ward_id: number;
    is_default: boolean;
}

interface Province { id: number; name: string; }
interface District { id: number; name: string; province_id: number; }
interface Ward { id: number; name: string; district_id: number; }

interface Props {
    addresses: {
        data: Address[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    provinces: Province[];
    districts: District[];
    wards: Ward[];
}

export default function Index({ addresses, provinces, districts, wards }: Props) {
    const { flash } = usePage().props as any;
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        id: null as number | null,
        recipient_name: '',
        phone: '',
        address_line: '',
        province_id: '',
        district_id: '',
        ward_id: '',
        is_default: false,
    });
    const [errors, setErrors] = useState<any>({});

    // Reset form when closing
    const resetForm = () => {
        setForm({
            id: null,
            recipient_name: '',
            phone: '',
            address_line: '',
            province_id: '',
            district_id: '',
            ward_id: '',
            is_default: false,
        });
        setErrors({});
        setIsEdit(false);
        setShowForm(false);
    };

    // Handle submit
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

    // Handle edit
    const handleEdit = (addr: Address) => {
        setForm({
            id: addr.id,
            recipient_name: addr.recipient_name,
            phone: addr.phone,
            address_line: addr.address_line,
            province_id: addr.province_id + '',
            district_id: addr.district_id + '',
            ward_id: addr.ward_id + '',
            is_default: addr.is_default,
        });
        setIsEdit(true);
        setShowForm(true);
    };

    // Handle delete
    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            router.delete(`/shipping-addresses/${id}`);
        }
    };

    // Lọc quận theo tỉnh
    const filteredDistricts = districts.filter(d => d.province_id == form.province_id);
    // Lọc phường theo quận
    const filteredWards = wards.filter(w => w.district_id == form.district_id);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Customer Dashboard', href: '/customer/dashboard' },
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
                {/* Form Thêm/Sửa */}
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
                                value={form.province_id}
                                onChange={e => {
                                    setForm(f => ({
                                        ...f,
                                        province_id: e.target.value,
                                        district_id: '',
                                        ward_id: '',
                                    }));
                                }}
                                required
                            >
                                <option value="">-- Chọn tỉnh/thành --</option>
                                {provinces.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.province_id && <div className="text-red-600 text-sm">{errors.province_id}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Quận/Huyện</label>
                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={form.district_id}
                                onChange={e => {
                                    setForm(f => ({
                                        ...f,
                                        district_id: e.target.value,
                                        ward_id: '',
                                    }));
                                }}
                                required
                                disabled={!form.province_id}
                            >
                                <option value="">-- Chọn quận/huyện --</option>
                                {filteredDistricts.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            {errors.district_id && <div className="text-red-600 text-sm">{errors.district_id}</div>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Phường/Xã</label>
                            <select
                                className="border rounded px-3 py-2 w-full"
                                value={form.ward_id}
                                onChange={e => setForm(f => ({ ...f, ward_id: e.target.value }))}
                                required
                                disabled={!form.district_id}
                            >
                                <option value="">-- Chọn phường/xã --</option>
                                {filteredWards.map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                            {errors.ward_id && <div className="text-red-600 text-sm">{errors.ward_id}</div>}
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
                {/* Danh sách địa chỉ */}
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
                                        <td className="py-2 px-3">{addr.address_line}</td>
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
                    {/* Phân trang */}
                    {addresses.links && addresses.links.length > 1 && (
                        <div className="mt-4 flex justify-center gap-1">
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
