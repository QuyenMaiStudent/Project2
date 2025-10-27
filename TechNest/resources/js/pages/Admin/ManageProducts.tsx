import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type Link = { url: string | null; label: string; active?: boolean };
type Product = {
  id: number;
  name?: string;
  created_by?: number | string;
  seller?: { id?: number; name?: string } | null;
  brand?: { name?: string } | null;
  status?: string;
  created_at?: string;
};
type PageProps = {
  products: { data: Product[]; links?: Link[] } | null;
  filters: { seller?: string; status?: string; q?: string } | null;
};

const statusClasses = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'archived':
      return 'bg-purple-100 text-purple-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

export default function ManageProducts() {
  const { props } = usePage<PageProps>();
  const products = props?.products ?? { data: [], links: [] };
  const filters = props?.filters ?? {};

  const changeStatus = (productId: number, status: string) => {
    router.post(`/admin/products/${productId}/status`, { status }, { preserveScroll: true });
  };

  const content = (
    <div className="p-6">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý sản phẩm</h1>
          <p className="text-sm text-muted-foreground">Danh sách sản phẩm (lọc theo seller / trạng thái / tìm kiếm)</p>
        </div>

        <form method="get" action="/admin/products" className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            name="q"
            defaultValue={filters.q || ''}
            placeholder="Tìm theo tên sản phẩm..."
            className="input px-3 py-2 w-full sm:w-64"
          />
          <input
            name="seller"
            defaultValue={filters.seller || ''}
            placeholder="Seller ID"
            className="input px-3 py-2 w-full sm:w-36"
          />
          <select name="status" defaultValue={filters.status || ''} className="input px-3 py-2 w-full sm:w-40">
            <option value="">Tất cả trạng thái</option>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="archived">archived</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary px-4">Lọc</button>
            <a href="/admin/products" className="btn px-4">Reset</a>
          </div>
        </form>
      </header>

      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sản phẩm</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Seller</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Thương hiệu</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Trạng thái</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {(products.data || []).map((p: Product) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{p.id}</td>

                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <a href={`/admin/products/${p.id}`} className="font-medium text-blue-600 hover:underline">
                      {p.name || `#${p.id}`}
                    </a>
                    <span className="text-xs text-gray-500">{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</span>
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {p.seller?.name ? (
                    <a href={`/admin/users/${p.seller.id}/edit`} className="text-sm text-gray-700 hover:underline">
                      {p.seller.name}
                    </a>
                  ) : (
                    <span className="text-gray-500">ID: {p.created_by}</span>
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">{p.brand?.name ?? '-'}</td>

                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${statusClasses(p.status)}`}>
                    {p.status ?? 'unknown'}
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/products/${p.id}`}
                      className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      Xem
                    </a>

                    <select
                      aria-label="Đổi trạng thái"
                      defaultValue={p.status || ''}
                      onChange={(e) => changeStatus(p.id, e.target.value)}
                      className="text-sm px-2 py-1 border rounded"
                    >
                      <option value="">— đổi trạng thái —</option>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="archived">archived</option>
                      <option value="approved">approved</option>
                      <option value="rejected">rejected</option>
                      <option value="draft">draft</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}

            {((products.data || []).length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Hiển thị {(products.data || []).length} sản phẩm
        </div>

        <div>
          {Array.isArray(products.links) && (
            <nav aria-label="Pagination" className="inline-flex gap-1">
              {products.links!.map((link, idx) => (
                <span key={idx}>
                  {link.url ? (
                    <a
                      href={link.url}
                      className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span className="px-3 py-1 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý sản phẩm', href: '/admin/products' },
      ]}
    >
      <Head title="Quản lý sản phẩm" />
      {content}
    </AppLayout>
  );
}