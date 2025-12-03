import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Eye, Search, Filter, RefreshCw } from 'lucide-react'; // Thêm icons từ lucide-react

type Link = { url: string | null; label: string; active?: boolean };
type Product = {
  id: number;
  name?: string;
  created_by?: number | string;
  seller?: { id?: number; name?: string } | null;
  brand?: { name?: string } | null;
  status?: string;
  is_active?: boolean;
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

  // THÊM: State local cho checked của từng product (optimistic update)
  const [localChecked, setLocalChecked] = useState<Record<number, boolean>>({});

  // Hàm lấy checked (ưu tiên local state, fallback từ data)
  const getChecked = (product: Product) => {
    return localChecked[product.id] !== undefined ? localChecked[product.id] : (product.is_active ?? false);
  };

  const toggleActive = (product: Product) => {
    if (product.is_in_cart) {
      setNotification({
        type: 'error',
        message: 'Không thể thay đổi trạng thái ẩn/hiện vì sản phẩm đang có trong giỏ hàng của khách hàng.'
      });
      return;
    }

    // Optimistic update
    const newChecked = !getChecked(product);
    setLocalChecked(prev => ({ ...prev, [product.id]: newChecked }));

    // DÙNG axios thay vì Inertia router để tránh "plain JSON" modal
    axios.patch(`/admin/products/${product.id}/toggle-active`)
      .then(() => {
        // thành công: giữ trạng thái local (không cần thông báo nếu không muốn)
      })
      .catch((error) => {
        // revert khi lỗi
        setLocalChecked(prev => ({ ...prev, [product.id]: !newChecked }));
        const msg = error.response?.data?.error || 'Có lỗi xảy ra.';
        setNotification({ type: 'error', message: msg });
      });
  };


  const content = (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
      {/* Notification cải thiện */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg shadow-sm border ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        } text-base md:text-lg`}>
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${notification.type === 'success' ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
              {notification.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              ) : (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              )}
            </svg>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-lg leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Quản lý sản phẩm</h1>
        </div>

        <form method="get" action="/admin/products" className="flex flex-col sm:flex-row gap-3 items-center bg-white p-5 rounded-lg shadow-sm border border-gray-200 text-base md:text-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="q"
              defaultValue={filters.q || ''}
              placeholder="Tìm theo tên sản phẩm..."
              className="pl-10 pr-3 py-3 w-full sm:w-64 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
            />
          </div>
          <input
            name="seller"
            defaultValue={filters.seller || ''}
            placeholder="Seller ID"
            className="px-3 py-3 w-full sm:w-36 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent text-base md:text-lg"
          />
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              name="status"
              defaultValue={filters.status || ''}
              className="appearance-none pl-10 pr-8 py-3 w-full sm:w-44 border border-gray-300 rounded-md bg-white text-base md:text-lg focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
              aria-label="Lọc theo trạng thái"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="approved">Đang bán</option>
              <option value="draft">Bản nháp</option>
            </select>
            {/* caret */}
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-3 bg-[#0AC1EF] text-white rounded-md hover:bg-[#09b3db] transition-colors flex items-center space-x-2 text-base md:text-lg">
              <Search className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            <a href="/admin/products" className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2 text-base md:text-lg">
              <RefreshCw className="w-4 h-4" />
              <span>Đặt lại</span>
            </a>
          </div>
        </form>
      </header>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Sản phẩm</th>
              <th className="px-6 py-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Seller</th>
              <th className="px-6 py-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Thương hiệu</th>
              <th className="px-6 py-4 text-center text-base md:text-lg font-semibold uppercase tracking-wider">Ẩn hiện</th>
              <th className="px-6 py-4 text-left text-base md:text-lg font-semibold uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-right text-base md:text-lg font-semibold uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(products.data || []).map((p: Product) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-base md:text-lg text-gray-700 font-medium">{p.id}</td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <a href={`/admin/products/${p.id}`} className="font-medium text-[#0AC1EF] hover:text-[#09b3db] hover:underline transition-colors">
                        {p.name || `#${p.id}`}
                      </a>
                      {p.is_in_cart && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                          </svg>
                          Trong giỏ hàng
                        </span>
                      )}
                    </div>
                    <span className="text-base md:text-lg text-gray-500">{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-base md:text-lg text-gray-700">
                  {p.seller?.name ? (
                    <a href={`/admin/users/${p.seller.id}/edit`} className="text-gray-700 hover:text-[#0AC1EF] hover:underline transition-colors">
                      {p.seller.name}
                    </a>
                  ) : (
                    <span className="text-gray-500">ID: {p.created_by}</span>
                  )}
                </td>

                <td className="px-6 py-4 text-base md:text-lg text-gray-700">{p.brand?.name ?? '-'}</td>
                {/* Cột Ẩn/Hiện với checkbox cải thiện */}
                <td className='px-6 py-4 text-center'>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={getChecked(p)}
                      onChange={() => toggleActive(p)}
                      disabled={p.is_in_cart}
                      className={`sr-only peer`}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0AC1EF]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0AC1EF] ${p.is_in_cart ? 'cursor-not-allowed opacity-50' : ''}`}></div>
                  </label>
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm md:text-base font-semibold ${statusClasses(p.status)}`}>
                    {p.status ?? 'unknown'}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/products/${p.id}`}
                      className="px-4 py-3 bg-[#0AC1EF] text-white rounded-md hover:bg-[#09b3db] transition-colors flex items-center space-x-2 text-base md:text-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem</span>
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
                      className={`px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent text-base md:text-lg ${
                        p.is_in_cart ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
                      }`}
                      disabled={p.is_in_cart}
                      title={p.is_in_cart ? 'Không thể thay đổi vì sản phẩm đang có trong giỏ hàng' : 'Đổi trạng thái'}
                    >
                      <option value="">— Đổi trạng thái —</option>
                      <option value="approved">approved</option>
                      <option value="draft">draft</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}

            {((products.data || []).length === 0) && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Không có sản phẩm nào</h3>
                    <p className="text-base md:text-lg text-gray-500">Hãy thử điều chỉnh bộ lọc để tìm sản phẩm.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
        <div className="text-base md:text-lg text-gray-600">
          Hiển thị {(products.data || []).length} sản phẩm
        </div>

        <div>
          {Array.isArray(products.links) && (
            <nav aria-label="Pagination" className="inline-flex gap-2">
              {products.links!.map((link, idx) => (
                <span key={idx}>
                  {link.url ? (
                    <a
                      href={link.url}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 text-base md:text-lg ${
                        link.active
                          ? 'bg-[#0AC1EF] text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span className="px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
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