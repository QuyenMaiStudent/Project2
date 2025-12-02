import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import React, { useState } from 'react';
import MapLibreMapPicker from '@/components/MapLibrMapPicker';

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

    // delete modal state (replace window.confirm)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAddrId, setDeletingAddrId] = useState<number | null>(null);
    const [processingDelete, setProcessingDelete] = useState(false);
    const openDeleteModal = (id: number) => {
        setDeletingAddrId(id);
        setShowDeleteModal(true);
    };
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingAddrId(null);
    };
    const confirmDelete = () => {
        if (deletingAddrId == null) return;
        setProcessingDelete(true);
        router.delete(`/shipping-addresses/${deletingAddrId}`, {
            onSuccess: () => {
                setProcessingDelete(false);
                setShowDeleteModal(false);
                setDeletingAddrId(null);
            },
            onError: () => {
                setProcessingDelete(false);
                // optional: setErrors or flash handling
            }
        });
    };

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

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        if (isEdit && form.id) {
            router.put(`/shipping-addresses/${form.id}`, form, {
                onSuccess: resetForm,
                onError: (err) => setErrors(err || {}),
            });
        } else {
            router.post('/shipping-addresses', form, {
                onSuccess: resetForm,
                onError: (err) => setErrors(err || {}),
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // removed direct window.confirm usage; use modal (openDeleteModal) instead

    const filteredWards = wards.filter(w => w.province_code == form.province_code);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Giao diện người dùng', href: '/customer/dashboard' },
                { title: 'Địa chỉ giao hàng', href: '/shipping-addresses' }
            ]}
        >
            <Head title="Địa chỉ giao hàng" />
            <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="max-w-5xl mx-auto space-y-6">
                    {flash?.success && (
                        <div className="rounded-md p-4 text-green-900 bg-green-50 border border-green-100 text-lg">
                             {flash.success}
                         </div>
                     )}

                     <div className="flex items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Địa chỉ giao hàng</h1>
                            <p className="text-base md:text-lg text-slate-500">Quản lý địa chỉ giao hàng của bạn — thêm, sửa hoặc đặt mặc định.</p>
                        </div>

                         <div className="flex items-center gap-2">
                             {/* Show "Đóng" only when the form is open */}
                             {showForm ? (
                                <button
                                    className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded shadow-sm hover:shadow-md text-base"
                                    onClick={() => setShowForm(false)}
                                    title="Thu gọn form"
                                >
                                    Đóng
                                </button>
                             ) : null}

                            <button
                                className="inline-flex items-center gap-3 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 text-lg"
                                onClick={openCreate}
                            >
                                Thêm địa chỉ
                            </button>
                         </div>
                     </div>

                     {/* Improved form UI */}
                     <div className={`transition-[max-height,opacity] duration-300 overflow-hidden ${showForm ? 'max-h-[1400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                         <form
                             onSubmit={handleSubmit}
                             className="bg-white rounded-lg shadow p-6 grid grid-cols-1 gap-6"
                         >
                             <div className="flex items-center justify-between">
                                 <h3 className="text-xl md:text-2xl font-semibold">{isEdit ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                                 <div className="flex items-center gap-3">
                                     <button type="button" className="text-base px-4 py-2 rounded border" onClick={resetForm}>Hủy</button>
                                     <button type="submit" className="text-base px-5 py-2 rounded bg-blue-600 text-white">{isEdit ? 'Cập nhật' : 'Lưu'}</button>
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 <div>
                                     <label className="block text-sm font-medium mb-1">Người nhận</label>
                                    <input
                                        type="text"
                                        className="border rounded px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        value={form.recipient_name}
                                        onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))}
                                        placeholder="Họ và tên người nhận"
                                        required
                                    />
                                     {errors.recipient_name && <div className="text-red-600 text-sm mt-1">{errors.recipient_name}</div>}
                                 </div>

                                 <div>
                                     <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="border rounded px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="09xxxxxxxx"
                                        required
                                    />
                                     {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
                                 </div>

                                 <div className="md:col-span-2">
                                     <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="border rounded px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                                        value={form.address_line}
                                        onChange={e => setForm(f => ({ ...f, address_line: e.target.value }))}
                                        placeholder="Số nhà, ngõ, tên đường..."
                                        required
                                    />
                                     {errors.address_line && <div className="text-red-600 text-sm mt-1">{errors.address_line}</div>}
                                 </div>

                                 <div>
                                     <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
                                    <select
                                        className="border rounded px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                                     {errors.province_code && <div className="text-red-600 text-sm mt-1">{errors.province_code}</div>}
                                 </div>

                                 <div>
                                     <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                                    <select
                                        className="border rounded px-4 py-3 w-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                                     {errors.ward_code && <div className="text-red-600 text-sm mt-1">{errors.ward_code}</div>}
                                 </div>
                             </div>

                             <div>
                                 <label className="block text-sm font-medium mb-2">Vị trí trên bản đồ (kéo thả để chính xác)</label>
                                <div className="h-[640px] rounded overflow-hidden border">
                                     <MapLibreMapPicker
                                         lat={form.latitude ? Number(form.latitude) : undefined}
                                         lng={form.longitude ? Number(form.longitude) : undefined}
                                         height={640} /* làm to hơn */
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
                             </div>

                             <div className="flex items-center gap-3">
                                 <label className="inline-flex items-center gap-2 text-sm">
                                     <input
                                         type="checkbox"
                                         checked={form.is_default}
                                         onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
                                     />
                                    <span className="text-base">Đặt làm địa chỉ mặc định</span>
                                 </label>

                                 <div className="ml-auto text-sm text-slate-500">
                                     {form.latitude && form.longitude && (
                                         <a
                                             href={`https://www.openstreetmap.org/?mlat=${form.latitude}&mlon=${form.longitude}#map=16/${form.latitude}/${form.longitude}`}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-base"
                                         >
                                             Xem vị trí hiện tại
                                         </a>
                                     )}
                                 </div>
                             </div>
                         </form>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {addresses.data.length === 0 ? (
                            <div className="md:col-span-2 bg-white rounded-lg p-8 text-center text-slate-600 text-lg">
                                Chưa có địa chỉ nào. Nhấn "Thêm địa chỉ" để bắt đầu.
                            </div>
                         ) : (
                             addresses.data.map((addr: Address) => (
                                <div key={addr.id} className="bg-white rounded-lg p-6 shadow-sm border flex flex-col justify-between">
                                     <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-semibold text-lg md:text-xl text-slate-900">{addr.recipient_name}</div>
                                                <div className="text-base text-slate-600 mt-1">{addr.phone}</div>
                                            </div>
                                            <div className="text-right">
                                                {addr.is_default && <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded">Mặc định</span>}
                                            </div>
                                        </div>

                                        <div className="mt-3 text-base text-slate-700">
                                            <div>{addr.address_line}</div>
                                            <div className="text-sm text-slate-500 mt-1">
                                                {[addr.ward_name, addr.province_name].filter(Boolean).join(', ')}
                                            </div>
                                             {addr.latitude && addr.longitude && (
                                                 <div className="mt-2">
                                                     <a
                                                         href={`https://www.openstreetmap.org/?mlat=${addr.latitude}&mlon=${addr.longitude}#map=16/${addr.latitude}/${addr.longitude}`}
                                                         target="_blank"
                                                         rel="noopener noreferrer"
                                                        className="text-blue-600 text-base hover:underline"
                                                     >
                                                         Xem trên bản đồ
                                                     </a>
                                                 </div>
                                             )}
                                         </div>
                                     </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <button
                                            onClick={() => handleEdit(addr)}
                                            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-base"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(addr.id)}
                                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-base"
                                        >
                                            Xóa
                                        </button>

                                        {!addr.is_default && (
                                            <button
                                                onClick={() => router.post(`/shipping-addresses/${addr.id}/set-default`)}
                                                className="ml-auto px-4 py-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-base"
                                            >
                                                Đặt mặc định
                                            </button>
                                        )}
                                    </div>
                                 </div>
                             ))
                         )}
                     </div>

                     {addresses.links && addresses.links.length > 1 && (
                        <div className="mt-6 flex justify-center gap-3">
                             {addresses.links.map((link, idx) =>
                                 link.url ? (
                                     <button
                                         key={idx}
                                        className={`px-4 py-2 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'} text-base`}
                                         dangerouslySetInnerHTML={{ __html: link.label }}
                                         onClick={() => router.visit(link.url!)}
                                     />
                                 ) : (
                                    <span key={idx} className="px-4 py-2 text-gray-400 text-base" dangerouslySetInnerHTML={{ __html: link.label }} />
                                 )
                             )}
                         </div>
                     )}

                     {/* Delete confirmation modal (UI) */}
                     {showDeleteModal && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center">
                             <div className="absolute inset-0 bg-black opacity-40" onClick={cancelDelete}></div>
                             <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full p-6">
                                <h3 className="text-xl md:text-2xl font-semibold mb-3">Xác nhận xóa địa chỉ</h3>
                                <p className="text-base text-slate-600 mb-4">
                                     Bạn có chắc muốn xóa địa chỉ{' '}
                                     <span className="font-medium">
                                         {addresses.data.find(a => a.id === deletingAddrId)?.recipient_name || ''}
                                     </span>
                                     ? Hành động này không thể hoàn tác.
                                 </p>
                                 <div className="flex justify-end gap-2">
                                    <button type="button" className="px-4 py-2 rounded border text-base" onClick={cancelDelete} disabled={processingDelete}>Hủy</button>
                                    <button type="button" className="px-4 py-2 rounded bg-red-600 text-white text-base" onClick={confirmDelete} disabled={processingDelete}>
                                        {processingDelete ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
        </AppLayout>
    );
}
