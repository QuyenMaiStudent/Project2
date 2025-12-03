<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    protected function redirectTo($request): ?string
    {
        if (! $request->expectsJson()) {
            // Nếu request tới vùng shipper mà chưa đăng nhập shipper -> về trang login shipper
            if ($request->is('shipper/*')) {
                return route('shipper.login');
            }
            return route('login');
        }
        return null;
    }
}
