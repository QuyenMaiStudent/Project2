// @ts-nocheck
import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Create() {
  const page = usePage().props as any;
  const brands = page.brands ?? [];
  const products = page.products ?? [];
  const categories = page.categories ?? [];

  const breadcrumbs = [
    { title: 'Bảng điều khiển quản trị', href: '/admin/dashboard' },
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
  });

  const submit = (e:any) => {
    e.preventDefault();
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
