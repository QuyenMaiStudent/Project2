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
  const pageProps = usePage().props as any as Props & { isAllowed?: boolean; error?: string; auth?: any };
  const isAllowed = pageProps.isAllowed !== undefined ? pageProps.isAllowed : true;
  const serverError = pageProps.error ?? null;

  const mode = pageProps.view ?? 'index';

  // đảm bảo giá trị mặc định — tránh access users.data khi không phải mode index
  const users = mode === 'index' ? (pageProps.users ?? { data: [], links: [] }) : { data: [], links: [] };
  const roles = pageProps.roles ?? [];
  // loại bỏ vai trò superadmin khỏi các dropdown lọc / chọn
  const filteredRoles = roles.filter((r) => r.name?.toLowerCase() !== 'superadmin');

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
      map[u.id] = primary || (filteredRoles[0]?.name || '');
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

      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        {/* Notification giống Category */}
        {(flash?.success || flash?.error || serverError) && (
          <div className={`mb-4 p-4 rounded-lg shadow-sm border ${
            flash?.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-2 ${flash?.success ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                {flash?.success ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                ) : (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                )}
              </svg>
              <span>{flash?.success || flash?.error || serverError}</span>
              <button 
                onClick={() => { /* no-op client clear */ }}
                className="ml-auto text-lg leading-none hover:opacity-70"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {!isAllowed && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            {serverError ?? 'Bạn không có quyền truy cập mục này.'}
          </div>
        )}

        {/* Hide main UI if not allowed */}
        {!isAllowed ? null : (
          <>
            <header className="mb-6 flex items-center justify-between bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
                <p className="text-sm text-gray-600 mt-1">Quản lý vai trò và trạng thái tài khoản</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/admin/users/create" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Tạo mới</Link>
              </div>
            </header>

            {/* Filters (styled like Category) */}
            <form onSubmit={submitFilters} className="mb-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col md:flex-row gap-3 items-center">
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="pl-4 pr-3 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                />
              </div>

              <div className="relative w-full md:w-1/6">
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 w-full border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                >
                  <option value="">Tất cả vai trò</option>
                  {filteredRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="relative w-full md:w-1/6">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 w-full border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="1">Hoạt động</option>
                  <option value="0">Khóa</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex gap-2 ml-auto">
                <button type="submit" className="px-4 py-2 bg-[#0AC1EF] text-white rounded hover:bg-[#09b3db] transition-colors">Lọc</button>
                <button type="button" onClick={() => { setQuery(''); setFilterRole(''); setFilterStatus(''); submitFilters(); }} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">Đặt lại</button>
              </div>
            </form>

            {/* Main table (styled like Category) */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#0AC1EF] to-[#0894c7] text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Tên</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Vai trò</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Trạng thái</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(users.data || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6M12 5v14" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có người dùng</h3>
                          <p className="text-gray-500">Người dùng sẽ xuất hiện khi họ đăng ký hoặc được tạo bởi admin.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.data.map((u: User) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-gray-900 font-medium">{u.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <div className="mb-2 text-sm text-gray-700">{(u.roles || []).map(r => r.name).filter(n => n.toLowerCase() !== 'superadmin').join(', ') || '—'}</div>
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedRole[u.id] || ''}
                              onChange={e => setSelectedRole(prev => ({ ...prev, [u.id]: e.target.value }))}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              {filteredRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                            <button onClick={() => assignRole(u.id)} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Đổi vai trò</button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {u.is_active ? <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">Hoạt động</span> : <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-sm">Khóa</span>}
                        </td>
                        <td className="py-3 px-4 text-center text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/admin/users/${u.id}/edit`} className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">Sửa</Link>
                            <button onClick={() => askToggle(u.id, u.name, u.is_active)} className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                              {u.is_active ? 'Khóa' : 'Mở'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {Array.isArray(users.links) && users.links.length > 0 && (
                <div className="mt-4 flex justify-center gap-1 p-4 bg-gray-50">
                  {users.links.map((link: any, idx: number) =>
                    link.url ? (
                      <button
                        key={idx}
                        className={`px-3 py-1 rounded transition-all duration-200 ${link.active ? 'bg-[#0AC1EF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        onClick={() => router.visit(link.url)}
                      />
                    ) : (
                      <span key={idx} className="px-3 py-1 text-gray-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                    )
                  )}
                </div>
              )}
            </div>

            {/* nếu mode !== index hiển thị form/chi tiết giống trước (giữ nguyên logic) */}
            {mode !== 'index' && (
              <div className="mt-6">
                {mode === 'create' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createForm.post('/admin/users');
                    }}
                    className="max-w-xl bg-white p-6 rounded shadow mt-4"
                  >
                    {/* giữ nguyên nội dung form tạo */}
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
                        {filteredRoles.map((r) => (
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

                {mode === 'edit' && pageProps.user && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      form.put(`/admin/users/${pageProps.user.id}`);
                    }}
                    className="max-w-xl bg-white p-6 rounded shadow mt-4"
                  >
                    {/* giữ nội dung edit form hiện tại */}
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
                        {filteredRoles.map((r) => (
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
            )}
          </>
        )}

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
      </div>
    </AppLayout>
  );
}
