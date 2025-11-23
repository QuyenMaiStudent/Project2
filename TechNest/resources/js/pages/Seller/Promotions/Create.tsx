// @ts-nocheck
import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Sparkles, Tag, Clock, Users, Info } from 'lucide-react';

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
    conditions: [],
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

    if (!validateStart(form.data.starts_at as string)) return;
    if (!validateEnd(form.data.expires_at as string, form.data.starts_at as string)) return;

    const conditions = form.data.apply_all ? [] : (form.data.selected_products || []).map((p: number) => ({
      condition_type: 'product',
      target_id: p,
    }));

    form.setData('starts_at', starts);
    form.setData('expires_at', expires);
    form.setData('conditions', conditions);

    form.post('/seller/promotions');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tạo khuyến mãi" />
      <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 rounded-lg overflow-hidden shadow">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white">
                <div className="p-3 bg-white/10 rounded">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Tạo khuyến mãi</h1>
                  <p className="text-sm opacity-90">Tạo mã, cấu hình thời gian và phạm vi áp dụng cho sản phẩm của bạn.</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <Link href="/seller/promotions" className="inline-flex items-center gap-2 rounded bg-white/20 px-3 py-2 text-sm backdrop-blur-sm">
                    Quay lại
                  </Link>
                </div>
              </div>

              <div className="bg-white p-6">
                {flash?.success && <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">{flash.success}</div>}
                {flash?.error && <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded">{flash.error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Mã</label>
                      <div className="mt-2 flex">
                        <input
                          value={form.data.code}
                          onChange={e => form.setData('code', e.target.value)}
                          className="flex-1 rounded-l border border-r-0 px-4 py-3"
                          placeholder="VD: XMAS2025"
                        />
                        <button
                          type="button"
                          onClick={() => form.setData('code', `SALE${Math.floor(Math.random()*9000)+1000}`)}
                          className="rounded-r bg-gray-100 border px-4 py-3 text-sm"
                        >
                          Tạo nhanh
                        </button>
                      </div>
                      {form.errors.code && <div className="text-red-600 text-sm mt-2">{form.errors.code}</div>}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Loại</label>
                      <select value={form.data.type} onChange={e => form.setData('type', e.target.value)} className="mt-2 w-full border rounded px-4 py-3">
                        <option value="fixed">Tiền</option>
                        <option value="percent">Phần trăm</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Mô tả (tùy chọn)</label>
                      <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} className="mt-2 w-full border rounded px-4 py-3" rows={3} />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Giá trị</label>
                      <input value={form.data.value} onChange={e => form.setData('value', e.target.value)} className="mt-2 w-full border rounded px-4 py-3" placeholder="Số hoặc % (vd: 10)" />
                      {form.errors.value && <div className="text-red-600 text-sm">{form.errors.value}</div>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá tối thiểu (VND)</label>
                      <input value={form.data.min_order_amount} onChange={e => form.setData('min_order_amount', e.target.value)} className="mt-2 w-full border rounded px-4 py-3" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giới hạn lượt</label>
                      <input value={form.data.usage_limit} onChange={e => form.setData('usage_limit', e.target.value)} className="mt-2 w-full border rounded px-4 py-3" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bắt đầu</label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="datetime-local"
                          value={form.data.starts_at as string}
                          onChange={e => { form.setData('starts_at', e.target.value); validateStart(e.target.value); }}
                          className="w-full border rounded px-4 py-3"
                        />
                        <div className="text-sm text-gray-500 px-2">
                          <Clock className="inline-block w-4 h-4 mr-1" /> {formatVN(form.data.starts_at as string) || '—'}
                        </div>
                      </div>
                      {startError && <div className="text-red-600 text-sm mt-2">{startError}</div>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kết thúc</label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="datetime-local"
                          value={form.data.expires_at as string}
                          onChange={e => { form.setData('expires_at', e.target.value); validateEnd(e.target.value, form.data.starts_at as string); }}
                          onBlur={e => validateEnd(e.target.value, form.data.starts_at as string)}
                          className={`w-full border rounded px-4 py-3 ${endError ? 'border-red-400' : ''}`}
                        />
                        <div className="text-sm text-gray-500 px-2">
                          <Clock className="inline-block w-4 h-4 mr-1" /> {formatVN(form.data.expires_at as string) || '—'}
                        </div>
                      </div>
                      {endError && <div className="text-red-600 text-sm mt-2">{endError}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={form.data.apply_all} onChange={e => form.setData('apply_all', e.currentTarget.checked)} />
                      <span className="text-sm">Áp dụng cho tất cả sản phẩm của tôi</span>
                    </label>
                    <div className="ml-auto text-sm text-gray-500 flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" /> <span>Không thể sửa mã sau khi tạo</span>
                    </div>
                  </div>

                  {!form.data.apply_all && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chọn sản phẩm (Áp dụng)</label>
                      <select multiple value={form.data.selected_products.map(String)} onChange={e => {
                        const opts = Array.from(e.currentTarget.selectedOptions).map(o => Number(o.value));
                        form.setData('selected_products', opts);
                      }} className="w-full border rounded px-4 py-3 h-48">
                        {products.map((p: any) => <option key={p.id} value={p.id}>{p.name ?? `#${p.id}`}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-500">Bạn đang tạo mã cho cửa hàng của mình.</div>
                    <div className="flex gap-3">
                      <Link href="/seller/promotions" className="px-4 py-3 rounded border bg-white text-gray-700">Hủy</Link>
                      <button type="submit" disabled={form.processing} className="px-6 py-3 rounded bg-gradient-to-r from-[#0AC1EF] to-[#09b3db] text-white shadow">
                        {form.processing ? 'Đang gửi...' : 'Tạo khuyến mãi'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-lg border border-gray-200 p-5 bg-white shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded"><Tag className="w-5 h-5 text-indigo-600" /></div>
                <div>
                  <h3 className="font-semibold">Tóm tắt mã</h3>
                  <p className="text-sm text-gray-600">Xem nhanh cấu hình trước khi tạo.</p>
                </div>
              </div>

              <dl className="mt-4 text-sm text-gray-700 space-y-3">
                <div className="flex justify-between"><dt>Mã</dt><dd className="font-medium">{form.data.code || '—'}</dd></div>
                <div className="flex justify-between"><dt>Loại</dt><dd>{form.data.type === 'percent' ? 'Phần trăm' : 'Tiền'}</dd></div>
                <div className="flex justify-between"><dt>Giá trị</dt><dd>{form.data.value || '—'}</dd></div>
                <div className="flex justify-between"><dt>Phạm vi</dt><dd>{form.data.apply_all ? 'Tất cả sản phẩm' : `${form.data.selected_products.length} sản phẩm`}</dd></div>
                <div className="flex justify-between"><dt>Khoảng thời gian</dt><dd>{formatVN(form.data.starts_at as string) || '—'} → {formatVN(form.data.expires_at as string) || '—'}</dd></div>
              </dl>
            </div>

            <div className="rounded-lg border border-gray-200 p-5 bg-white shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded"><Users className="w-5 h-5 text-green-600" /></div>
                <div>
                  <h4 className="font-semibold">Gợi ý áp dụng</h4>
                  <p className="text-sm text-gray-600 mt-1">Nếu dùng % cho đơn hàng, cân nhắc giới hạn tối đa để tránh lỗ.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
