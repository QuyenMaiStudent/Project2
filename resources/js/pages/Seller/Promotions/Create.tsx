// @ts-nocheck
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Clock, Info, Sparkles, Tag, Users } from 'lucide-react';
import React, { useState } from 'react';

export default function Create() {
    const page = usePage().props as any;
    const products = page.products ?? [];
    const [startError, setStartError] = useState<string>('');
    const [endError, setEndError] = useState<string>('');
    const [valueError, setValueError] = useState<string>('');
    const flash = page.flash ?? {};
    const breadcrumbs = [
        { title: 'Giao diện người bán', href: '/seller/dashboard' },
        { title: 'Khuyến mãi', href: '/seller/promotions' },
        { title: 'Tạo khuyến mãi', href: '/seller/promotions/create' },
    ];

    const form = useForm({
        code: '',
        type: 'fixed',
        value: '',
        description: '',
        min_order_amount: '',
        usage_limit: '',
        starts_at: '',
        expires_at: '',
        apply_all: true,
        selected_products: [] as number[],
        conditions: [],
    });

    // convert local datetime-local (YYYY-MM-DDTHH:mm) => "YYYY-MM-DD HH:mm:00" (VN-friendly)
    const toServerDatetime = (local?: string) => {
        if (!local) return null;
        // local expected like "2025-10-09T14:30"
        return local.replace('T', ' ') + ':00';
    };

    const validateStart = (local?: string) => {
        if (!local) {
            setStartError('');
            return true;
        }
        const sel = new Date(local);
        if (Number.isNaN(sel.getTime())) {
            setStartError('Ngày/giờ không hợp lệ');
            return false;
        }
        const now = new Date();
        if (sel < now) {
            setStartError('Thời gian bắt đầu phải là hiện tại hoặc tương lai.');
            return false;
        }
        setStartError('');
        return true;
    };

    const validateEnd = (localEnd?: string, localStart?: string) => {
        if (!localEnd) {
            setEndError('');
            return true;
        }
        let e = localEnd;
        // accept server format "YYYY-MM-DD HH:mm:00" or input "YYYY-MM-DDTHH:mm"
        if (e.includes(' ')) e = e.replace(' ', 'T').split(':00')[0];
        if (!e.includes('T') && e.length >= 16) e = e.slice(0, 16);
        const endDate = new Date(e);
        if (Number.isNaN(endDate.getTime())) {
            setEndError('Ngày/giờ kết thúc không hợp lệ');
            return false;
        }

        if (localStart) {
            let s = localStart;
            if (s.includes(' ')) s = s.replace(' ', 'T').split(':00')[0];
            if (!s.includes('T') && s.length >= 16) s = s.slice(0, 16);
            const startDate = new Date(s);
            if (!Number.isNaN(startDate.getTime()) && endDate <= startDate) {
                setEndError('Thời gian kết thúc phải sau thời gian bắt đầu.');
                return false;
            }
        }

        setEndError('');
        return true;
    };

    // format for display: dd/mm/yyyy HH:mm (24h)
    const formatVN = (local?: string) => {
        if (!local) return '';
        const parts = local.split('T');
        if (parts.length !== 2) return '';
        const [y, m, d] = parts[0].split('-');
        const time = parts[1];
        return `${d}/${m}/${y} ${time}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const starts = toServerDatetime(form.data.starts_at as string);
        const expires = toServerDatetime(form.data.expires_at as string);
        if (!validateStart(form.data.starts_at as string)) return;
        if (!validateEnd(form.data.expires_at as string, form.data.starts_at as string)) return;
        if (!validateValue(form.data.value, form.data.type)) return;

        const conditions = form.data.apply_all
            ? products.map((p: any) => ({ condition_type: 'product', target_id: p.id }))
            : (form.data.selected_products || []).map((id: number) => ({
                  condition_type: 'product',
                  target_id: id,
              }));

        form.setData('starts_at', starts);
        form.setData('expires_at', expires);
        form.setData('conditions', conditions);
        form.post('/seller/promotions');
    };

    const validateValue = (value: string, type: string) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            setValueError('Giá trị phải là số dương.');
            return false;
        }
        if (type === 'percent') {
            if (num > 100) {
                setValueError('Giá trị phần trăm không được vượt quá 100%.');
                return false;
            }
            if (num > 20) {
                setValueError('Khuyến nghị: Giá trị phần trăm không nên vượt quá 20% để tránh lỗ.');
                return false;
            }
        } else if (type === 'fixed') {
            if (num > 1000000) {
                setValueError('Giá trị giảm giá cố định không được vượt quá 1.000.000 VNĐ.');
                return false;
            }
        }
        setValueError('');
        return true;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tạo khuyến mãi" />
            <div className="mx-auto min-h-screen max-w-7xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <div className="mb-6 overflow-hidden rounded-lg shadow">
                            <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-cyan-500 p-6 text-white">
                                <div className="rounded bg-white/10 p-3">
                                    <Sparkles className="h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold">Tạo khuyến mãi</h1>
                                    <p className="text-sm opacity-90">Tạo mã, cấu hình thời gian và phạm vi áp dụng cho sản phẩm của bạn.</p>
                                </div>
                                <div className="ml-auto flex items-center gap-3">
                                    <Link
                                        href="/seller/promotions"
                                        className="inline-flex items-center gap-2 rounded bg-white/20 px-3 py-2 text-sm backdrop-blur-sm"
                                    >
                                        Quay lại
                                    </Link>
                                </div>
                            </div>

                            <div className="bg-white p-6">
                                {flash?.success && <div className="mb-4 rounded bg-green-50 p-3 text-green-800">{flash.success}</div>}
                                {flash?.error && <div className="mb-4 rounded bg-yellow-50 p-3 text-yellow-800">{flash.error}</div>}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Mã</label>
                                            <div className="mt-2 flex">
                                                <input
                                                    value={form.data.code}
                                                    onChange={(e) => form.setData('code', e.target.value)}
                                                    className="flex-1 rounded-l border border-r-0 px-4 py-3"
                                                    placeholder="VD: XMAS2025"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => form.setData('code', `SALE${Math.floor(Math.random() * 9000) + 1000}`)}
                                                    className="rounded-r border bg-gray-100 px-4 py-3 text-sm"
                                                >
                                                    Tạo nhanh
                                                </button>
                                            </div>
                                            {form.errors.code && <div className="mt-2 text-sm text-red-600">{form.errors.code}</div>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">Loại</label>
                                            <select
                                                value={form.data.type}
                                                onChange={(e) => form.setData('type', e.target.value)}
                                                className="mt-2 w-full rounded border px-4 py-3"
                                            >
                                                <option value="fixed">Tiền</option>
                                                <option value="percent">Phần trăm</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Mô tả (tùy chọn)</label>
                                            <textarea
                                                value={form.data.description}
                                                onChange={(e) => form.setData('description', e.target.value)}
                                                className="mt-2 w-full rounded border px-4 py-3"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-gray-700">Giá trị</label>
                                            <input
                                                value={form.data.value}
                                                onChange={(e) => {
                                                    form.setData('value', e.target.value);
                                                    validateValue(e.target.value, form.data.type);
                                                }}
                                                className="mt-2 w-full rounded border px-4 py-3"
                                                placeholder="Số hoặc % (vd: 10)"
                                            />
                                            {valueError && <div className='text-red-600 text-sm'>{valueError}</div>}
                                            {form.errors.value && <div className="text-sm text-red-600">{form.errors.value}</div>}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Giá tối thiểu (VND)</label>
                                            <input
                                                value={form.data.min_order_amount}
                                                onChange={(e) => form.setData('min_order_amount', e.target.value)}
                                                className="mt-2 w-full rounded border px-4 py-3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Giới hạn lượt</label>
                                            <input
                                                value={form.data.usage_limit}
                                                onChange={(e) => form.setData('usage_limit', e.target.value)}
                                                className="mt-2 w-full rounded border px-4 py-3"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bắt đầu</label>
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    type="datetime-local"
                                                    value={form.data.starts_at as string}
                                                    onChange={(e) => {
                                                        form.setData('starts_at', e.target.value);
                                                        validateStart(e.target.value);
                                                    }}
                                                    className="w-full rounded border px-4 py-3"
                                                />
                                                <div className="px-2 text-sm text-gray-500">
                                                    <Clock className="mr-1 inline-block h-4 w-4" /> {formatVN(form.data.starts_at as string) || '—'}
                                                </div>
                                            </div>
                                            {startError && <div className="mt-2 text-sm text-red-600">{startError}</div>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Kết thúc</label>
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    type="datetime-local"
                                                    value={form.data.expires_at as string}
                                                    onChange={(e) => {
                                                        form.setData('expires_at', e.target.value);
                                                        validateEnd(e.target.value, form.data.starts_at as string);
                                                    }}
                                                    onBlur={(e) => validateEnd(e.target.value, form.data.starts_at as string)}
                                                    className={`w-full rounded border px-4 py-3 ${endError ? 'border-red-400' : ''}`}
                                                />
                                                <div className="px-2 text-sm text-gray-500">
                                                    <Clock className="mr-1 inline-block h-4 w-4" /> {formatVN(form.data.expires_at as string) || '—'}
                                                </div>
                                            </div>
                                            {endError && <div className="mt-2 text-sm text-red-600">{endError}</div>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={form.data.apply_all}
                                                onChange={(e) => form.setData('apply_all', e.currentTarget.checked)}
                                            />
                                            <span className="text-sm">Áp dụng cho tất cả sản phẩm của tôi</span>
                                        </label>
                                        <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
                                            <Info className="h-4 w-4 text-gray-400" /> <span>Không thể sửa mã sau khi tạo</span>
                                        </div>
                                    </div>

                                    {!form.data.apply_all && (
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Chọn sản phẩm (Áp dụng)</label>
                                            <select
                                                multiple
                                                value={form.data.selected_products.map(String)}
                                                onChange={(e) => {
                                                    const opts = Array.from(e.currentTarget.selectedOptions).map((o) => Number(o.value));
                                                    form.setData('selected_products', opts);
                                                }}
                                                className="h-48 w-full rounded border px-4 py-3"
                                            >
                                                {products.map((p: any) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name ?? `#${p.id}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-sm text-gray-500">Bạn đang tạo mã cho cửa hàng của mình.</div>
                                        <div className="flex gap-3">
                                            <Link href="/seller/promotions" className="rounded border bg-white px-4 py-3 text-gray-700">
                                                Hủy
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={form.processing}
                                                className="rounded bg-gradient-to-r from-[#0AC1EF] to-[#09b3db] px-6 py-3 text-white shadow"
                                            >
                                                {form.processing ? 'Đang gửi...' : 'Tạo khuyến mãi'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-5 lg:col-span-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow">
                            <div className="flex items-center gap-3">
                                <div className="rounded bg-indigo-50 p-2">
                                    <Tag className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Tóm tắt mã</h3>
                                    <p className="text-sm text-gray-600">Xem nhanh cấu hình trước khi tạo.</p>
                                </div>
                            </div>

                            <dl className="mt-4 space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <dt>Mã</dt>
                                    <dd className="font-medium">{form.data.code || '—'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Loại</dt>
                                    <dd>{form.data.type === 'percent' ? 'Phần trăm' : 'Tiền'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Giá trị</dt>
                                    <dd>{form.data.value || '—'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Phạm vi</dt>
                                    <dd>{form.data.apply_all ? 'Tất cả sản phẩm' : `${form.data.selected_products.length} sản phẩm`}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Khoảng thời gian</dt>
                                    <dd>
                                        {formatVN(form.data.starts_at as string) || '—'} → {formatVN(form.data.expires_at as string) || '—'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow">
                            <div className="flex items-center gap-3">
                                <div className="rounded bg-green-50 p-2">
                                    <Users className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Gợi ý áp dụng</h4>
                                    <p className="mt-1 text-sm text-gray-600">Nếu dùng % cho đơn hàng, cân nhắc giới hạn tối đa để tránh lỗ.</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
