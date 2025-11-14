// @ts-nocheck
import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
  const page = usePage().props as any;
  const products = page.products ?? [];
  const [startError, setStartError] = useState<string>('');
  const [endError, setEndError] = useState<string>('');
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
    conditions: [], // <-- thêm field conditions vào initial state
  });

  // convert local datetime-local (YYYY-MM-DDTHH:mm) => "YYYY-MM-DD HH:mm:00" (VN-friendly)
  const toServerDatetime = (local?: string) => {
    if (!local) return null;
    // local expected like "2025-10-09T14:30"
    return local.replace('T', ' ') + ':00';
  };

  const validateStart = (local?: string) => {
    if (!local) { setStartError(''); return true; }
    const sel = new Date(local);
    if (Number.isNaN(sel.getTime())) { setStartError('Ngày/giờ không hợp lệ'); return false; }
    const now = new Date();
    if (sel < now) { setStartError('Thời gian bắt đầu phải là hiện tại hoặc tương lai.'); return false; }
    setStartError('');
    return true;
  };

  const validateEnd = (localEnd?: string, localStart?: string) => {
    if (!localEnd) { setEndError(''); return true; }
    let e = localEnd;
    // accept server format "YYYY-MM-DD HH:mm:00" or input "YYYY-MM-DDTHH:mm"
    if (e.includes(' ')) e = e.replace(' ', 'T').split(':00')[0];
    if (!e.includes('T') && e.length >= 16) e = e.slice(0,16);
    const endDate = new Date(e);
    if (Number.isNaN(endDate.getTime())) { setEndError('Ngày/giờ kết thúc không hợp lệ'); return false; }

    if (localStart) {
      let s = localStart;
      if (s.includes(' ')) s = s.replace(' ', 'T').split(':00')[0];
      if (!s.includes('T') && s.length >= 16) s = s.slice(0,16);
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

    // client-side check: block submit if invalid start time
    if (!validateStart(form.data.starts_at as string)) return;
    if (!validateEnd(form.data.expires_at as string, form.data.starts_at as string)) return;

    // build conditions payload
    const conditions = form.data.apply_all ? [] : (form.data.selected_products || []).map((p: number) => ({
      condition_type: 'product',
      target_id: p,
    }));

    // set từng field (an toàn với useForm typings / runtime)
    form.setData('starts_at', starts);
    form.setData('expires_at', expires);
    form.setData('conditions', conditions);

    // gửi
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
                onChange={e => { form.setData('starts_at', e.target.value); validateStart(e.target.value); }}
                className="w-full border rounded px-3 py-2"
              />
              <div className="text-sm text-gray-600 mt-1">Đã chọn: {formatVN(form.data.starts_at as string) || '—'}</div>
              {form.errors.starts_at && <div className="text-red-600 text-sm mt-1">{form.errors.starts_at}</div>}
              {startError && <div className="text-red-600 text-sm mt-1">{startError}</div>}
            </div>
            <div>
              <label className="block mb-1">Kết thúc</label>
              <input
                type="datetime-local"
                value={form.data.expires_at as string}
                onChange={e => {
                  form.setData('expires_at', e.target.value);
                  validateEnd(e.target.value, form.data.starts_at as string);
                }}
                onBlur={e => validateEnd(e.target.value, form.data.starts_at as string)}
                className={`w-full border rounded px-3 py-2 ${endError ? 'border-red-400' : ''}`}
              />
              <div className="text-sm text-gray-600 mt-1">Đã chọn: {formatVN(form.data.expires_at as string) || '—'}</div>
              {form.errors.expires_at && <div className="text-red-600 text-sm mt-1">{form.errors.expires_at}</div>}
              {endError && <div className="text-red-600 text-sm mt-1">{endError}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Áp dụng</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center">
                <input type="checkbox" checked={form.data.apply_all} onChange={e => form.setData('apply_all', e.currentTarget.checked)} />
                <span className="ml-2">Tất cả sản phẩm của tôi</span>
              </label>
            </div>

            {!form.data.apply_all && (
              <div className="mt-2">
                <label className="block mb-1">Chọn sản phẩm (áp dụng theo sản phẩm)</label>
                <select multiple value={form.data.selected_products.map(String)} onChange={e => {
                  const opts = Array.from(e.currentTarget.selectedOptions).map(o => Number(o.value));
                  form.setData('selected_products', opts);
                }} className="w-full border rounded px-3 py-2">
                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.name ?? `#${p.id}`}</option>)}
                </select>
              </div>
            )}
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
