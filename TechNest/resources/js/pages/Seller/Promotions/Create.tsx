import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
  const page = usePage().props as any;
  const flash = page.flash ?? {};
  const breadcrumbs = [
    { title: 'Seller Dashboard', href: '/seller/dashboard' },
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
  });

  // convert local datetime-local (YYYY-MM-DDTHH:mm) => "YYYY-MM-DD HH:mm:00" (VN-friendly)
  const toServerDatetime = (local?: string) => {
    if (!local) return null;
    // local expected like "2025-10-09T14:30"
    return local.replace('T', ' ') + ':00';
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

    // transform before submit so backend (Carbon::parse) gets explicit datetime in VN format
    const starts = toServerDatetime(form.data.starts_at as string);
    const expires = toServerDatetime(form.data.expires_at as string);

    form.setData({
      ...form.data,
      starts_at: starts,
      expires_at: expires,
    });

    form.post('/seller/promotions');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tạo khuyến mãi" />
      {flash?.success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.success}</div>}
      {flash?.error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>}
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Tạo khuyến mãi</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">Mã</label>
            <input value={form.data.code} onChange={e => form.setData('code', e.target.value)} className="w-full border rounded px-3 py-2" />
            {form.errors.code && <div className="text-red-600 text-sm mt-1">{form.errors.code}</div>}
          </div>

          <div className="mb-3 flex gap-3">
            <div className="flex-1">
              <label className="block mb-1">Loại</label>
              <select value={form.data.type} onChange={e => form.setData('type', e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="fixed">Tiền</option>
                <option value="percent">Phần trăm</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1">Giá trị</label>
              <input value={form.data.value} onChange={e => form.setData('value', e.target.value)} className="w-full border rounded px-3 py-2" />
              {form.errors.value && <div className="text-red-600 text-sm mt-1">{form.errors.value}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Mô tả</label>
            <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Giá tối thiểu</label>
              <input value={form.data.min_order_amount} onChange={e => form.setData('min_order_amount', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Giới hạn lượt</label>
              <input value={form.data.usage_limit} onChange={e => form.setData('usage_limit', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Bắt đầu</label>
              <input
                type="datetime-local"
                value={form.data.starts_at as string}
                onChange={e => form.setData('starts_at', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <div className="text-sm text-gray-600 mt-1">Đã chọn: {formatVN(form.data.starts_at as string) || '—'}</div>
              {form.errors.starts_at && <div className="text-red-600 text-sm mt-1">{form.errors.starts_at}</div>}
            </div>
            <div>
              <label className="block mb-1">Kết thúc</label>
              <input
                type="datetime-local"
                value={form.data.expires_at as string}
                onChange={e => form.setData('expires_at', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <div className="text-sm text-gray-600 mt-1">Đã chọn: {formatVN(form.data.expires_at as string) || '—'}</div>
              {form.errors.expires_at && <div className="text-red-600 text-sm mt-1">{form.errors.expires_at}</div>}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={form.processing} className="bg-green-600 text-white px-4 py-2 rounded">Tạo</button>
            <Link href="/seller/promotions" className="px-4 py-2 rounded bg-gray-200">Hủy</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
