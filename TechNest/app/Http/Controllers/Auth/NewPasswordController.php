<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Rules\NotOldPassword;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Password as PasswordBroken;
use Illuminate\Validation\Rules\Password as PasswordRule;

class NewPasswordController extends Controller
{
    /**
     * Show the password reset page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $messages = [
            'token.required' => 'Thiếu mã xác thực đặt lại mật khẩu.',
            'email.required' => 'Vui lòng nhập email.',
            'email.email' => 'Email không đúng định dạng.',
            'password.required' => 'Vui lòng nhập mật khẩu mới.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',
            'password.min' => 'Mật khẩu phải có ít nhất :min ký tự.',
            'password.mixed' => 'Mật khẩu phải có cả chữ hoa và chữ thường.',
            'password.numbers' => 'Mật khẩu phải chứa ít nhất một số.',
            'password.symbols' => 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.',
        ];

        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
        ], $messages);

        $user = User::where('email', $request->input('email'))->firstOrFail();

        $request->validate([
            'password' => [
                'required',
                'confirmed',
                PasswordRule::min(8)->mixedCase()->numbers()->symbols(),
                new NotOldPassword($user),
            ],
        ], $messages);

        $status = PasswordBroken::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->string('password')),
                ])->save();
            }
        );

        return $status === PasswordBroken::PASSWORD_RESET
            ? redirect()->route('login')->with('status', 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.')
            : back()->withErrors(['email' => ['Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại thông tin hoặc thử lại sau.']]);
    }
}
