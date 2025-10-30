// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

function toInputDatetime(dt:any){
  if(!dt) return '';
  // normalize server "YYYY-MM-DD HH:mm:SS" to ISO-ish "YYYY-MM-DDTHH:mm"
  let raw = dt;
  if (typeof raw === 'string' && raw.includes(' ')) {
    raw = raw.replace(' ', 'T').split(':00')[0];
  }
  const d = new Date(raw);
  if(Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0,16);
}

export default function Edit() {
  const page = usePage().props as any;
  const promotion = page.promotion;
  const brands = page.brands ?? [];
  const products = page.products ?? [];
  const categories = page.categories ?? [];

  const initialConds = promotion?.conditions ?? [];

  const form = useForm({
    code: promotion?.code ?? '',
    type: promotion?.type ?? 'fixed',
    value: promotion?.value ?? '',
    description: promotion?.description ?? '',
    min_order_amount: promotion?.min_order_amount ?? '',
    usage_limit: promotion?.usage_limit ?? '',
    starts_at: toInputDatetime(promotion?.starts_at),
    expires_at: toInputDatetime(promotion?.expires_at),
    is_active: promotion?.is_active ?? true,
    conditions: initialConds,
    no_min_amount: (promotion?.min_order_amount === 0), // pre-check if stored as 0
    no_usage_limit: (promotion?.usage_limit === null),
  });
  const [startError, setStartError] = useState<string>('');
  const [endError, setEndError] = useState<string>('');

  useEffect(()=>{
    if (promotion) {
      form.setData({
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        description: promotion.description ?? '',
        min_order_amount: promotion.min_order_amount ?? '',
        usage_limit: promotion.usage_limit ?? '',
        starts_at: toInputDatetime(promotion.starts_at),
        expires_at: toInputDatetime(promotion.expires_at),
        is_active: promotion.is_active ?? true,
        conditions: promotion.conditions ?? [],
        no_min_amount: (promotion.min_order_amount === 0),
        no_usage_limit: (promotion.usage_limit === null),
      });
    }
  }, [promotion]);

  const validateStart = (local?: string) => {
    if (!local) { setStartError(''); return true; }
    let s = local;
    if (s.includes(' ')) s = s.replace(' ', 'T').split(':00')[0];
    if (!s.includes('T') && s.length >= 16) s = s.slice(0,16);
    const sel = new Date(s);
    if (Number.isNaN(sel.getTime())) { setStartError('Ngày/giờ không hợp lệ'); return false; }
    const now = new Date();
    if (sel < now) { setStartError('Thời gian bắt đầu phải là hiện tại hoặc tương lai.'); return false; }
    setStartError('');
    return true;
  };

  const validateEnd = (localEnd?: string, localStart?: string) => {
    if (!localEnd) { setEndError(''); return true; }
    let e = localEnd;
    if (e.includes(' ')) e = e.replace(' ', 'T').split(':00')[0];
    if (!e.includes('T') && e.length >= 16) e = e.slice(0,16);
    const endDate = new Date(e);
    if (Number.isNaN(endDate.getTime())) { setEndError('Ngày/giờ kết thúc không hợp lệ'); return false; }

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
    const starts = form.data.starts_at ? form.data.starts_at.replace('T',' ') + ':00' : null;
    const expires = form.data.expires_at ? form.data.expires_at.replace('T',' ') + ':00' : null;
    const min = form.data.no_min_amount ? 0 : (form.data.min_order_amount === '' ? null : form.data.min_order_amount);
    const limit = form.data.no_usage_limit ? null : (form.data.usage_limit === '' ? null : form.data.usage_limit);

    // client-side check
    if (!validateStart(form.data.starts_at as string)) return;
    if (!validateEnd(form.data.expires_at as string, form.data.starts_at as string)) return;

    form.setData('min_order_amount', min);
    form.setData('usage_limit', limit);
    form.setData('starts_at', starts);
    form.setData('expires_at', expires);

    form.put(`/admin/promotions/${promotion.id}`);
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

  const breadcrumbs = [
    { title: 'Bảng điều khiển quản trị', href: '/admin/dashboard' },
    { title: 'Khuyến mãi', href: '/admin/promotions' },
    { title: promotion?.code ?? 'Chỉnh sửa', href: `/admin/promotions/${promotion?.id}/edit` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Chỉnh sửa ${promotion?.code}`} />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Chỉnh sửa: {promotion?.code}</h1>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="block mb-1">Mã</label>
            <input value={form.data.code} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
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
            <label className="block mb-1">Thời gian</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1">Bắt đầu</label>
                <input
                  type="datetime-local"
                  value={form.data.starts_at}
                  onChange={e=>{ form.setData('starts_at', e.target.value); validateStart(e.target.value); validateEnd(form.data.expires_at as string, e.target.value); }}
                  onBlur={e=>{ validateStart(e.target.value); validateEnd(form.data.expires_at as string, e.target.value); }}
                  className={`w-full border rounded px-3 py-2 ${startError || form.errors.starts_at ? 'border-red-400' : ''}`}
                />
                {(form.errors.starts_at) && <div className="text-red-600 text-sm mt-1">{form.errors.starts_at}</div>}
                {startError && <div className="text-red-600 text-sm mt-1">{startError}</div>}
              </div>
              <div>
                <label className="block mb-1">Kết thúc</label>
                <input
                  type="datetime-local"
                  value={form.data.expires_at}
                  onChange={e=>{ form.setData('expires_at', e.target.value); validateEnd(e.target.value, form.data.starts_at as string); }}
                  onBlur={e=>validateEnd(e.target.value, form.data.starts_at as string)}
                  className={`w-full border rounded px-3 py-2 ${endError ? 'border-red-400' : ''}`}
                />
                {endError && <div className="text-red-600 text-sm mt-1">{endError}</div>}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Trạng thái</label>
            <select value={form.data.is_active ? '1' : '0'} onChange={e=>form.setData('is_active', e.target.value === '1')} className="w-full border rounded px-3 py-2">
              <option value="1">Kích hoạt</option>
              <option value="0">Ngừng kích hoạt</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block mb-1">Ghi chú</label>
            <textarea value={form.data.description} onChange={e=>form.setData('description', e.target.value)} className="w-full border rounded px-3 py-2" rows={3}></textarea>
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
            <button type="submit" disabled={form.processing} className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            <Link href="/admin/promotions" className="px-4 py-2 rounded bg-gray-200">Quay lại</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
