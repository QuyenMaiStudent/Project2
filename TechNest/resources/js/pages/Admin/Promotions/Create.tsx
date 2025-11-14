// @ts-nocheck
import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
  const page = usePage().props as any;
  const brands = page.brands ?? [];
  const products = page.products ?? [];
  const categories = page.categories ?? [];

  const breadcrumbs = [
    { title: 'Trang quản trị', href: '/admin/dashboard' },
    { title: 'Khuyến mãi', href: '/admin/promotions' },
    { title: 'Tạo khuyến mãi', href: '/admin/promotions/create' },
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
    is_active: true,
    conditions: [],
    // flags for "no min" / "no limit"
    no_min_amount: false,
    no_usage_limit: false,
  });
  const [startError, setStartError] = useState<string>('');
  const [endError, setEndError] = useState<string>('');

  const validateStart = (local?: string) => {
    // normalize server-format "YYYY-MM-DD HH:mm:00" => "YYYY-MM-DDTHH:mm"
    if (!local) { setStartError(''); return true; }
    let s = local;
    if (s.includes(' ')) {
      // possible server format "2025-10-09 14:30:00"
      s = s.replace(' ', 'T').split(':00')[0];
    }
    // ensure we have "YYYY-MM-DDTHH:mm"
    if (!s.includes('T') && s.length >= 16) s = s.slice(0,16);
    const sel = new Date(s);
    if (Number.isNaN(sel.getTime())) { setStartError('Ngày/giờ không hợp lệ'); return false; }
    const now = new Date();
    if (sel < now) { setStartError('Thời gian bắt đầu phải là hiện tại hoặc tương lai.'); return false; }
    setStartError('');
    return true;
  };

  const validateEnd = (localEnd?: string, localStart?: string) => {
    // normalize both inputs to comparable Date objects
    if (!localEnd) { setEndError(''); return true; }
    let e = localEnd;
    if (e.includes(' ')) e = e.replace(' ', 'T').split(':00')[0];
    if (!e.includes('T') && e.length >= 16) e = e.slice(0,16);
    const endDate = new Date(e);
    if (Number.isNaN(endDate.getTime())) { setEndError('Ngày/giờ kết thúc không hợp lệ'); return false; }

    // if start provided, compare
    if (localStart) {
      let s = localStart;
      if (s.includes(' ')) s = s.replace(' ', 'T').split(':00')[0];
      if (!s.includes('T') && s.length >= 16) s = s.slice(0,16);
      const startDate = new Date(s);
      if (!Number.isNaN(startDate.getTime())) {
        if (endDate <= startDate) {
          setEndError('Thời gian kết thúc phải sau thời gian bắt đầu.');
          return false;
        }
      }
    }

    setEndError('');
    return true;
  };

  const submit = (e:any) => {
    e.preventDefault();

    // compute min / limit based on toggles:
    // - if no_min_amount checked -> send 0 (meaning "no minimum" with current schema)
    // - if no_usage_limit checked -> send null (meaning "no limit")
    const min = form.data.no_min_amount ? 0 : (form.data.min_order_amount === '' ? null : form.data.min_order_amount);
    const limit = form.data.no_usage_limit ? null : (form.data.usage_limit === '' ? null : form.data.usage_limit);

    const starts = form.data.starts_at ? form.data.starts_at.replace('T',' ') + ':00' : null;
    const expires = form.data.expires_at ? form.data.expires_at.replace('T',' ') + ':00' : null;

    // client-side check: start + end
    if (!validateStart(form.data.starts_at as string)) return;
    if (!validateEnd(form.data.expires_at as string, form.data.starts_at as string)) return;

    form.setData('min_order_amount', min);
    form.setData('usage_limit', limit);
    form.setData('starts_at', starts);
    form.setData('expires_at', expires);

    form.post('/admin/promotions');
  };

  const toggleCondition = (type:string, id:number) => {
    const exists = form.data.conditions.find((c:any)=>c.condition_type===type && c.target_id===id);
    if (exists) {
      form.setData('conditions', form.data.conditions.filter((c:any)=>!(c.condition_type===type && c.target_id===id)));
    } else {
      form.setData('conditions', [...form.data.conditions, { condition_type: type, target_id: id }]);
    }
  };

  const isSelected = (type:string, id:number) => form.data.conditions.some((c:any)=>c.condition_type===type && c.target_id===id);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tạo khuyến mãi" />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Tạo khuyến mãi</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="block mb-1">Mã</label>
            <input value={form.data.code} onChange={e=>form.setData('code', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Loại</label>
              <select value={form.data.type} onChange={e=>form.setData('type', e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="fixed">Tiền</option>
                <option value="percent">Phần trăm</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Giá trị</label>
              <input value={form.data.value} onChange={e=>form.setData('value', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Mô tả</label>
            <textarea value={form.data.description} onChange={e=>form.setData('description', e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Giá tối thiểu</label>
              <input value={form.data.min_order_amount} onChange={e=>form.setData('min_order_amount', e.target.value)} className="w-full border rounded px-3 py-2" />
              <label className="inline-flex items-center mt-2">
                <input type="checkbox" checked={form.data.no_min_amount} onChange={e=>form.setData('no_min_amount', e.currentTarget.checked)} />
                <span className="ml-2 text-sm">Không yêu cầu (0)</span>
              </label>
            </div>
            <div>
              <label className="block mb-1">Giới hạn lượt</label>
              <input value={form.data.usage_limit} onChange={e=>form.setData('usage_limit', e.target.value)} className="w-full border rounded px-3 py-2" />
              <label className="inline-flex items-center mt-2">
                <input type="checkbox" checked={form.data.no_usage_limit} onChange={e=>form.setData('no_usage_limit', e.currentTarget.checked)} />
                <span className="ml-2 text-sm">Không giới hạn</span>
              </label>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Thời gian áp dụng</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="datetime-local"
                  value={form.data.starts_at?.substring(0,16)}
                  onChange={e => {
                    form.setData('starts_at', e.target.value);
                    validateStart(e.target.value);
                    // re-validate end against new start
                    validateEnd(form.data.expires_at as string, e.target.value);
                  }}
                  onBlur={e => { validateStart(e.target.value); validateEnd(form.data.expires_at as string, e.target.value); }}
                  className={`w-full border rounded px-3 py-2 ${startError || form.errors.starts_at ? 'border-red-400' : ''}`}
                />
                {(form.errors.starts_at) && <div className="text-red-600 text-sm mt-1">{form.errors.starts_at}</div>}
                {startError && <div className="text-red-600 text-sm mt-1">{startError}</div>}
              </div>
              <div>
                <input
                  type="datetime-local"
                  value={form.data.expires_at?.substring(0,16)}
                  onChange={e => {
                    form.setData('expires_at', e.target.value);
                    validateEnd(e.target.value, form.data.starts_at as string);
                  }}
                  onBlur={e => validateEnd(e.target.value, form.data.starts_at as string)}
                  className={`w-full border rounded px-3 py-2 ${endError ? 'border-red-400' : ''}`}
                />
                {endError && <div className="text-red-600 text-sm mt-1">{endError}</div>}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Áp dụng (chọn nhiều)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="font-medium mb-1">Thương hiệu</div>
                <div className="space-y-1 max-h-48 overflow-auto">
                  {brands.map((b:any) => (
                    <label key={b.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={isSelected('brand', b.id)} onChange={() => toggleCondition('brand', b.id)} />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Sản phẩm</div>
                <div className="space-y-1 max-h-48 overflow-auto">
                  {products.map((p:any) => (
                    <label key={p.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={isSelected('product', p.id)} onChange={() => toggleCondition('product', p.id)} />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Danh mục</div>
                <div className="space-y-1 max-h-48 overflow-auto">
                  {categories.map((c:any) => (
                    <label key={c.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={isSelected('category', c.id)} onChange={() => toggleCondition('category', c.id)} />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={form.processing} className="bg-green-600 text-white px-4 py-2 rounded">Tạo</button>
            <Link href="/admin/promotions" className="px-4 py-2 rounded bg-gray-200">Hủy</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
