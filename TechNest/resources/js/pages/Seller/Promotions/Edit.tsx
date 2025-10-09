import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Edit() {
  const page = usePage().props as any;
  const promotion = page.promotion;
  const flash = page.flash ?? {};
  const breadcrumbs = [
    { title: 'Seller Dashboard', href: '/seller/dashboard' },
    { title: 'Khuyến mãi', href: '/seller/promotions' },
    { title: promotion?.code ?? 'Chỉnh sửa', href: `/seller/promotions/${promotion?.id}/edit` },
  ];

  const form = useForm({
    type: promotion?.type ?? 'fixed',
    value: promotion?.value ?? '',
    description: promotion?.description ?? '',
    min_order_amount: promotion?.min_order_amount ?? '',
    usage_limit: promotion?.usage_limit ?? '',
    starts_at: promotion?.starts_at ? promotion.starts_at : '',
    expires_at: promotion?.expires_at ? promotion.expires_at : '',
  });

  useEffect(() => {
    if (promotion) {
      form.setData({
        type: promotion.type,
        value: promotion.value,
        description: promotion.description ?? '',
        min_order_amount: promotion.min_order_amount ?? '',
        usage_limit: promotion.usage_limit ?? '',
        starts_at: promotion.starts_at ?? '',
        expires_at: promotion.expires_at ?? '',
      });
    }
  }, [promotion]);

  const submit = (e: any) => {
    e.preventDefault();
    form.put(`/seller/promotions/${promotion.id}`);
  };

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

          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={form.processing} className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            <Link href="/seller/promotions" className="px-4 py-2 rounded bg-gray-200">Quay lại</Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
