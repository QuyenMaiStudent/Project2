// @ts-nocheck
import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

function toInputDatetime(dt: any) {
  if (!dt) return '';
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0,16); // "YYYY-MM-DDTHH:mm"
}

export default function Edit() {
  const page = usePage().props as any;
  const promotion = page.promotion;
  const brands = page.brands ?? [];

  const initialSelectedBrands = (promotion?.conditions ?? []).filter((c:any)=>c.condition_type==='brand').map((c:any)=>c.target_id);

  const form = useForm({
    type: promotion?.type ?? 'fixed',
    value: promotion?.value ?? '',
    description: promotion?.description ?? '',
    min_order_amount: promotion?.min_order_amount ?? '',
    usage_limit: promotion?.usage_limit ?? '',
    // use input-friendly datetime string for datetime-local
    starts_at: toInputDatetime(promotion?.starts_at),
    expires_at: toInputDatetime(promotion?.expires_at),
    apply_all: (promotion?.conditions?.length ?? 0) === 0,
    selected_brands: initialSelectedBrands,
    conditions: promotion?.conditions ?? [], // <-- thêm conditions vào state
  });

  useEffect(() => {
    if (promotion) {
      form.setData({
        type: promotion.type,
        value: promotion.value,
        description: promotion.description ?? '',
        min_order_amount: promotion.min_order_amount ?? '',
        usage_limit: promotion.usage_limit ?? '',
        starts_at: toInputDatetime(promotion.starts_at),
        expires_at: toInputDatetime(promotion.expires_at),
        apply_all: (promotion?.conditions?.length ?? 0) === 0,
        selected_brands: initialSelectedBrands,
        conditions: promotion?.conditions ?? [],
      });
    }
  }, [promotion]);

  const submit = (e: any) => {
    e.preventDefault();

    // convert input datetime-local => server-friendly "YYYY-MM-DD HH:mm:00" OR null
    const starts = form.data.starts_at ? form.data.starts_at.replace('T', ' ') + ':00' : null;
    const expires = form.data.expires_at ? form.data.expires_at.replace('T', ' ') + ':00' : null;

    // create conditions based on selected brands when not apply_all
    const conditions = form.data.apply_all
      ? []
      : (form.data.selected_brands || []).map((b:number)=>({
          condition_type: 'brand',
          target_id: b,
        }));

    // set fields individually to match useForm typings
    form.setData('starts_at', starts);
    form.setData('expires_at', expires);
    form.setData('conditions', conditions);

    form.put(`/seller/promotions/${promotion.id}`);
  };

  const toggleApplyAll = (checked: boolean) => {
    form.setData('apply_all', checked);
    if (checked) {
      // clear brand selection and conditions when switching to "all"
      form.setData('selected_brands', []);
      form.setData('conditions', []);
    } else {
      // when switching back to brand, ensure conditions reflect selected_brands
      const conditions = (form.data.selected_brands || []).map((b:number)=>({
        condition_type: 'brand',
        target_id: b,
      }));
      form.setData('conditions', conditions);
    }
  };

  const flash = page.flash ?? {};
  const breadcrumbs = [
    { title: 'Seller Dashboard', href: '/seller/dashboard' },
    { title: 'Khuyến mãi', href: '/seller/promotions' },
    { title: promotion?.code ?? 'Chỉnh sửa', href: `/seller/promotions/${promotion?.id}/edit` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Chỉnh sửa khuyến mãi" />
      {flash?.success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.success}</div>}
      {flash?.error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>}
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Chỉnh sửa: {promotion?.code}</h1>

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="block mb-1">Loại</label>
            <select
              value={form.data.type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => form.setData('type', e.currentTarget.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="fixed">Tiền</option>
              <option value="percent">Phần trăm</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Giá trị</label>
            <input
              value={form.data.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('value', e.currentTarget.value)}
              className="w-full border rounded px-3 py-2"
            />
            {form.errors.value && <div className="text-red-600 text-sm mt-1">{form.errors.value}</div>}
          </div>

          <div className="mb-3">
            <label className="block mb-1">Mô tả</label>
            <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Giá tối thiểu</label>
              <input value={form.data.min_order_amount} onChange={e => form.setData('min_order_amount', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Giới hạn lượt</label>
              <input value={form.data.usage_limit} onChange={e => form.setData('usage_limit', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block mb-1">Bắt đầu</label>
              <input type="datetime-local" value={form.data.starts_at} onChange={e => form.setData('starts_at', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1">Kết thúc</label>
              <input type="datetime-local" value={form.data.expires_at} onChange={e => form.setData('expires_at', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Áp dụng</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={form.data.apply_all}
                onChange={e => toggleApplyAll(e.currentTarget.checked)}
              />
              <span className="ml-2">Tất cả sản phẩm của tôi</span>
            </label>

            {!form.data.apply_all && (
              <div className="mt-2">
                <label className="block mb-1">Chọn brand (áp dụng theo brand)</label>
                <select multiple value={form.data.selected_brands.map(String)} onChange={e => {
                  const opts = Array.from(e.currentTarget.selectedOptions).map(o => Number(o.value));
                  form.setData('selected_brands', opts);
                  // keep conditions in sync with selected brands for immediate submit
                  const conditions = opts.map((b:number)=>({ condition_type: 'brand', target_id: b }));
                  form.setData('conditions', conditions);
                }} className="w-full border rounded px-3 py-2">
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={form.processing} className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            <Link href="/seller/promotions" className="px-4 py-2 rounded bg-gray-200">Quay lại</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
