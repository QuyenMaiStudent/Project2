<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManageUserController extends Controller
{
    /**
     * Hiển thị danh sách người dùng, có lọc theo role, trạng thái, tìm kiếm.
     */
    public function index(Request $request)
    {
        $isAllowed = Auth::check() && Auth::user()->isSuperAdmin();

        $roles = Role::select('id', 'name')->get();

        if (! $isAllowed) {
            // render page but indicate not allowed; frontend will show message and disable UI
            return Inertia::render('Admin/ManageUser', [
                'users' => ['data' => [], 'links' => []],
                'roles' => $roles,
                'filters' => $request->only(['search', 'role', 'status']),
                'view' => 'index',
                'isAllowed' => false,
                'error' => 'Chỉ superadmin mới được truy cập mục Quản lý người dùng.'
            ]);
        }

        // exclude any user who has role 'superadmin'
        $query = User::with(['role', 'roles', 'profile'])
            ->when($request->search, fn($q) =>
                $q->where(function($q2) use ($request) {
                    $q2->where('name', 'like', "%{$request->search}%")
                       ->orWhere('email', 'like', "%{$request->search}%");
                })
            )
            ->when($request->role, fn($q) =>
                $q->whereHas('roles', fn($r) => $r->where('name', $request->role))
            )
            ->when($request->has('status'), fn($q) =>
                $q->where('is_active', (int) $request->status)
            )
            ->whereDoesntHave('roles', fn($r) => $r->where('name', 'superadmin'));

        $users = $query->latest()->paginate(10);

        return Inertia::render('Admin/ManageUser', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role', 'status']),
            'view' => 'index',
            'isAllowed' => true,
        ]);
    }

    /**
     * Hiển thị chi tiết người dùng.
     */
    public function show($id)
    {
        $user = User::with(['profile', 'roles', 'addresses', 'orders'])->findOrFail($id);

        return Inertia::render('Admin/ManageUser', [
            'user' => $user,
            'view' => 'show', // single page will handle "show" mode
        ]);
    }

    /**
     * Hiển thị form tạo mới người dùng.
     */
    public function create()
    {
        $roles = Role::select('id', 'name')->get(); // ✅ đồng bộ với frontend
        return Inertia::render('Admin/ManageUser', [
            'roles' => $roles,
            'view' => 'create', // single page will handle "create" mode
        ]);
    }

    /**
     * Lưu người dùng mới.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'nullable|string',
        ]);

        // xác định role_id trước khi tạo user để tránh lỗi nếu column NOT NULL
        $roleId = null;
        if (!empty($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            $roleId = $role ? $role->id : null;
        } else {
            $default = Role::where('name', 'customer')->first();
            $roleId = $default ? $default->id : null;
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_active' => true,
            'role_id' => $roleId,
        ]);

        if ($roleId) {
            $user->roles()->sync([$roleId]);
        }

        return redirect()->route('admin.users.index')->with('success', 'Tạo người dùng thành công');
    }

    /**
     * Hiển thị form chỉnh sửa người dùng.
     */
    public function edit($id)
    {
        $user = User::with(['roles'])->findOrFail($id);
        $roles = Role::select('id', 'name')->get();

        return Inertia::render('Admin/ManageUser', [
            'user' => $user,
            'roles' => $roles,
            'view' => 'edit', // single page will handle "edit" mode
        ]);
    }

    /**
     * Cập nhật thông tin người dùng.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_active' => $data['is_active'] ?? $user->is_active,
        ]);

        if (!empty($data['role'])) {
            $role = Role::where('name', $data['role'])->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
                $user->update(['role_id' => $role->id]);
            }
        }

        return redirect()->route('admin.users.index')->with('success', 'Cập nhật người dùng thành công');
    }

    /**
     * Khóa / Mở tài khoản.
     */
    public function toggleStatus($id)
    {
        
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        return back()->with('success', 'Trạng thái tài khoản đã được cập nhật.');
    }

    /**
     * Gán vai trò cho người dùng (ghi đè role hiện có).
     */
    public function assignRole(Request $request, $id)
    {
        
        $user = User::findOrFail($id);

        $data = $request->validate([
            'role' => 'required|string',
        ]);

        $role = Role::where('name', $data['role'])->firstOrFail();

        // Ghi đè: đồng bộ pivot và cập nhật role_id
        DB::transaction(function () use ($user, $role) {
            $user->roles()->sync([$role->id]);
            $user->update(['role_id' => $role->id]);
        });

        return back()->with('success', 'Cập nhật vai trò thành công');
    }

    /**
     * Tìm kiếm nâng cao (đã gộp vào index).
     */
    public function search(Request $request)
    {
        return $this->index($request);
    }

    /**
     * (Tuỳ chọn) Xem lịch sử hoạt động.
     */
    public function activityLog($id)
    {
        $user = User::with('activityLogs')->findOrFail($id);

        return Inertia::render('Admin/ManageUser', [
            'user' => $user,
            'view' => 'activity', // single page will handle "activity" mode
        ]);
    }
}
