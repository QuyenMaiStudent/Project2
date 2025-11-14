import React, { useState } from 'react';
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
  is_in_cart?: boolean;
};
type PageProps = {
  products: { data: Product[]; links?: Link[] } | null;
  filters: { seller?: string; status?: string; q?: string } | null;
  errors?: { status?: string };
  flash?: { success?: string };
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
  const errors = props?.errors ?? {};
  const flash = props?.flash ?? {};

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hiển thị thông báo khi có flash message hoặc error
  React.useEffect(() => {
    if (flash.success) {
      setNotification({ type: 'success', message: flash.success });
    } else if (errors.status) {
      setNotification({ type: 'error', message: errors.status });
    }

    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash.success, errors.status]);

  const changeStatus = (product: Product, status: string) => {
    if (product.is_in_cart) {
      setNotification({ 
        type: 'error', 
        message: 'Không thể thay đổi trạng thái sản phẩm vì đang có trong giỏ hàng của khách hàng.' 
      });
      return;
    }

    router.post(`/admin/products/${product.id}/status`, { status }, { 
      preserveScroll: true,
      onError: (errors) => {
        if (errors.status) {
          setNotification({ type: 'error', message: errors.status });
        }
      }
    });
  };

  const content = (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 text-lg leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
            <a href="/admin/products" className="btn px-4">Đặt lại</a>
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
                    <div className="flex items-center gap-2">
                      <a href={`/admin/products/${p.id}`} className="font-medium text-blue-600 hover:underline">
                        {p.name || `#${p.id}`}
                      </a>
                      {p.is_in_cart && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                          Trong giỏ hàng
                        </span>
                      )}
                    </div>
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
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          changeStatus(p, e.target.value);
                          e.target.value = ""; // Reset select
                        }
                      }}
                      className={`text-sm px-2 py-1 border rounded ${
                        p.is_in_cart ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                      }`}
                      disabled={p.is_in_cart}
                      title={p.is_in_cart ? 'Không thể thay đổi vì sản phẩm đang có trong giỏ hàng' : 'Đổi trạng thái'}
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