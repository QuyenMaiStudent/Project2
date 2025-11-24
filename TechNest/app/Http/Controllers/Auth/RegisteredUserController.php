<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:' . User::class,
            ],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:customer,seller',
        ], [
            'name.required' => "Vui lòng nhập họ tên",
            'name.max' => "Họ tên không được vượt quá 255 ký tự",
            'email.required' => "Vui lòng nhập email",
            'email.email' => "Email không đúng định dạng",
            'email.unique' => "Email đã được sử dụng",
            'email.max' => "Email không được vượt quá 255 ký tự",
            'password.required' => "Vui lòng nhập mật khẩu",
            'password.confirmed' => "Mật khẩu xác nhận không khớp",
            'role.required' => "Vui lòng chọn vai trò",
            'role.in' => "Vai trò không hợp lệ",
        ]);

        $roleId = Role::where('name', $request->role)->value('id');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $roleId,
        ]);

        // Gán vào bảng user_role (nếu dùng quan hệ n-n)
        $user->roles()->attach($roleId);

        event(new Registered($user));

        Auth::login($user);

        if ($user->hasRole('customer')) {
            Cart::firstOrCreate(['user_id' => $user->id]);
        }

        return redirect()->route('verification.notice');
    }
}
