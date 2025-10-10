// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Role { id: number; name: string; }
interface User {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role_id?: number | null;
  roles?: Role[];
  created_at?: string;
}
interface Props {
  users?: { data: User[]; links: any[] };
  roles?: Role[];
  filters?: { search?: string; role?: string; status?: string | number };
  view?: string;
  user?: User;
}

export default function ManageUser() {
  const pageProps = usePage().props as any as Props;
  const mode = pageProps.view ?? 'index';

  // đảm bảo giá trị mặc định — tránh access users.data khi không phải mode index
  const users = mode === 'index' ? (pageProps.users ?? { data: [], links: [] }) : { data: [], links: [] };
  const roles = pageProps.roles ?? [];
  const filters = pageProps.filters ?? {};
  const flash = (pageProps as any).flash ?? {};

  const [query, setQuery] = useState<string>(filters?.search || '');
  const [filterRole, setFilterRole] = useState<string>(filters?.role || '');
  const [filterStatus, setFilterStatus] = useState<string>(filters?.status !== undefined ? String(filters.status) : '');
  const [selectedRole, setSelectedRole] = useState<Record<number, string>>({});
  // confirm UI for toggle status
  const [statusModal, setStatusModal] = useState<{ id: number | null; name?: string; action?: 'lock' | 'unlock' | ''; open: boolean }>({ id: null, name: undefined, action: '', open: false });
  const [successMessage, setSuccessMessage] = useState<string>('');
  // processing flag for toggle request
  const [toggleProcessing, setToggleProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (mode !== 'index') return; // chỉ map khi ở chế độ index
    const map: Record<number, string> = {};
    (users?.data || []).forEach((u: User) => {
      const primary = u.role_id
        ? roles.find(r => r.id === u.role_id)?.name
        : u.roles && u.roles.length > 0
        ? u.roles[0].name
        : '';
      map[u.id] = primary || (roles[0]?.name || '');
    });
    setSelectedRole(map);
  }, [mode, users, roles]);

  const submitFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params: any = {};
    if (query) params.search = query;
    if (filterRole) params.role = filterRole;
    if (filterStatus !== '') params.status = filterStatus;
    const qs = new URLSearchParams(params).toString();
    router.visit(`/admin/users${qs ? `?${qs}` : ''}`);
  };

  const assignRole = (userId: number) => {
    const roleName = selectedRole[userId];
    if (!roleName) return;
    router.post(`/admin/users/${userId}/assign-role`, { role: roleName });
  };

  // open confirm modal for toggle
  const askToggle = (userId: number, name: string, currentlyActive: boolean) => {
    setStatusModal({ id: userId, name, action: currentlyActive ? 'lock' : 'unlock', open: true });
  };
  const cancelToggle = () => setStatusModal({ id: null, name: undefined, action: '', open: false });
  const confirmToggle = (id: number | null) => {
    if (id === null || id === undefined) return cancelToggle();
    // close modal immediately so UI doesn't hang (optimistic)
    setStatusModal({ id: null, name: undefined, action: '', open: false });
    setToggleProcessing(true);
    router.post(`/admin/users/${id}/toggle-status`, {
      onSuccess: () => {
        setSuccessMessage('Cập nhật trạng thái thành công');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: () => {
        setSuccessMessage('Cập nhật thất bại, vui lòng thử lại');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onFinish: () => {
        setToggleProcessing(false);
      }
    });
  };

  // form cho chế độ create/edit
  const form = useForm({
    name: pageProps.user?.name ?? '',
    email: pageProps.user?.email ?? '',
    role: (() => {
      if (!pageProps.user) return '';
      if (pageProps.user.role_id) {
        const r = roles.find((x: Role) => x.id === pageProps.user!.role_id);
        return r?.name ?? '';
      }
      return pageProps.user.roles && pageProps.user.roles.length ? pageProps.user.roles[0].name : '';
    })(),
    is_active: pageProps.user?.is_active ?? true,
  });

  // form riêng cho chế độ tạo mới
  const createForm = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    is_active: true,
  });
  
  useEffect(() => {
    // khi pageProps.user thay đổi (navigate -> edit), đặt lại form
    if (mode === 'edit' && pageProps.user) {
      form.setData({
        name: pageProps.user.name ?? '',
        email: pageProps.user.email ?? '',
        role:
          (pageProps.user.role_id && roles.find((r: Role) => r.id === pageProps.user!.role_id)?.name) ||
          (pageProps.user.roles && pageProps.user.roles[0]?.name) ||
          '',
        is_active: pageProps.user.is_active ?? true,
      });
    }
  }, [mode, pageProps.user, roles]);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Trang quản trị', href: '/admin/dashboard' },
        { title: 'Quản lý người dùng', href: '/admin/users' },
      ]}
    >
      <Head title="Quản lý người dùng" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
          <Link href="/admin/users/create" className="bg-green-600 text-white px-4 py-2 rounded">Tạo mới</Link>
        </div>

        {/* Flash */}
        {flash?.success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.success}</div>}
        {flash?.error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>}

        {/* Nếu không ở chế độ index, frontend có thể hiển thị form/chi tiết */}
        {mode !== 'index' ? (
          <div>
            {mode === 'create' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createForm.post('/admin/users');
                }}
                className="max-w-xl bg-white p-6 rounded shadow"
              >
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Tên</label>
                  <input
                    value={createForm.data.name}
                    onChange={(e) => createForm.setData('name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {createForm.errors.name && <div className="text-sm text-red-600 mt-1">{createForm.errors.name}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    value={createForm.data.email}
                    onChange={(e) => createForm.setData('email', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {createForm.errors.email && <div className="text-sm text-red-600 mt-1">{createForm.errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Mật khẩu</label>
                  <input
                    type="password"
                    value={createForm.data.password}
                    onChange={(e) => createForm.setData('password', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {createForm.errors.password && <div className="text-sm text-red-600 mt-1">{createForm.errors.password}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    value={createForm.data.password_confirmation}
                    onChange={(e) => createForm.setData('password_confirmation', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {createForm.errors.password_confirmation && <div className="text-sm text-red-600 mt-1">{createForm.errors.password_confirmation}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Vai trò</label>
                  <select
                    value={createForm.data.role}
                    onChange={(e) => createForm.setData('role', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">— Chọn vai trò —</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                  {createForm.errors.role && <div className="text-sm text-red-600 mt-1">{createForm.errors.role}</div>}
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={createForm.data.is_active}
                      onChange={(e) => createForm.setData('is_active', e.target.checked)}
                    />
                    <span>Hoạt động</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={createForm.processing} className="bg-green-600 text-white px-4 py-2 rounded">
                    Tạo người dùng
                  </button>
                  <Link href="/admin/users" className="px-4 py-2 rounded bg-gray-200">Hủy</Link>
                </div>
              </form>
            )}
            {mode === 'show' && <div>Hiển thị chi tiết người dùng</div>}
            {mode === 'activity' && <div>Hiển thị lịch sử hoạt động</div>}

            {mode === 'edit' && pageProps.user && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.put(`/admin/users/${pageProps.user.id}`);
                }}
                className="max-w-xl bg-white p-6 rounded shadow"
              >
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Tên</label>
                  <input
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {form.errors.name && <div className="text-sm text-red-600 mt-1">{form.errors.name}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {form.errors.email && <div className="text-sm text-red-600 mt-1">{form.errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Vai trò</label>
                  <select
                    value={form.data.role}
                    onChange={(e) => form.setData('role', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">— Chọn vai trò —</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  {form.errors.role && <div className="text-sm text-red-600 mt-1">{form.errors.role}</div>}
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.data.is_active}
                      onChange={(e) => form.setData('is_active', e.target.checked)}
                    />
                    <span>Hoạt động</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={form.processing} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Lưu thay đổi
                  </button>
                  <Link href="/admin/users" className="px-4 py-2 rounded bg-gray-200">Hủy</Link>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Filters */}
            <form onSubmit={submitFilters} className="mb-4 flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="border rounded px-3 py-2 w-full md:w-1/3"
              />
              <select
                value={filterRole}
                onChange={e => setFilterRole(e.target.value)}
                className="border rounded px-3 py-2 w-full md:w-1/6"
              >
                <option value="">Tất cả vai trò</option>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border rounded px-3 py-2 w-full md:w-1/6"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Khóa</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lọc</button>
                <button type="button" onClick={() => { setQuery(''); setFilterRole(''); setFilterStatus(''); submitFilters(); }} className="bg-gray-200 px-4 py-2 rounded">Đặt lại</button>
              </div>
            </form>

            {/* Table */}
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Tên</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Vai trò</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Trạng thái</th>
                    <th className="px-4 py-3 text-center text-sm text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(users.data || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-500">Chưa có người dùng</td>
                    </tr>
                  ) : (
                    users.data.map((u: User) => (
                      <tr key={u.id} className="odd:bg-white even:bg-gray-50">
                        <td className="px-4 py-3">{u.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <div className="mb-2 text-sm text-gray-700">{(u.roles || []).map(r => r.name).join(', ') || '—'}</div>
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedRole[u.id] || ''}
                              onChange={e => setSelectedRole(prev => ({ ...prev, [u.id]: e.target.value }))}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                            <button onClick={() => assignRole(u.id)} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Đổi vai trò</button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {u.is_active ? <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Hoạt động</span> : <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-sm">Khóa</span>}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/admin/users/${u.id}/edit`} className="px-3 py-1 rounded bg-yellow-500 text-white">Sửa</Link>
                            <button onClick={() => askToggle(u.id, u.name, u.is_active)} className="px-3 py-1 rounded bg-indigo-600 text-white">
                              {u.is_active ? 'Khóa' : 'Mở'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {Array.isArray(users.links) && users.links.length > 0 && (
              <div className="mt-4 flex justify-center gap-1">
                {users.links.map((link: any, idx: number) =>
                  link.url ? (
                    <button
                      key={idx}
                      className={`px-3 py-1 rounded ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      onClick={() => router.visit(link.url)}
                    />
                  ) : (
                    <span key={idx} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* local success message (temporary, client-side) */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 p-3 bg-green-100 text-green-800 rounded shadow">
          {successMessage}
        </div>
      )}

      {/* Confirm modal for lock/unlock */}
      {statusModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={cancelToggle} />
          <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-2">{statusModal.action === 'lock' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở tài khoản'}</h3>
            <p className="text-sm text-gray-700 mb-4">
              Bạn có chắc muốn {statusModal.action === 'lock' ? 'khóa' : 'mở'} tài khoản <strong>{statusModal.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelToggle} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Hủy</button>
              <button
                type="button"
                onClick={() => confirmToggle(statusModal.id)}
                disabled={toggleProcessing}
                className={`px-4 py-2 rounded text-white ${toggleProcessing ? 'bg-gray-400' : 'bg-indigo-600'}`}
              >
                {toggleProcessing ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
