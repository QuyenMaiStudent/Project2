import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Tạo một tài khoản mới" description="Nhập thông tin của bạn bên dưới để tạo tài khoản">
            <Head title="Đăng ký" />

            <section
                className="absolute top-0 left-0 bottom-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-2xl rounded-2xl border-2 border-[#0AC1EF] bg-white p-4 shadow-xl mx-4 flex flex-col items-center">
                    <img src="/images/logo.png" alt="TechNest logo" className="mb-2 h-12 w-auto" />

                    <h1 className="mb-1 text-xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Tạo tài khoản mới
                    </h1>
                    <p className="text-xs text-gray-500 mb-3 text-center">Nhập thông tin để bắt đầu với TechNest</p>

                    <Form
                        {...RegisteredUserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-2 w-full"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* name + email on one row to reduce vertical length */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="name">Tên</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            autoFocus
                                            placeholder="Tên đầy đủ"
                                            autoComplete="name"
                                            className="border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF] text-sm"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="example@gmail.com"
                                            autoComplete="email"
                                            className="border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF] text-sm"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                {/* password + confirmation on one row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="Mật khẩu"
                                            autoComplete="new-password"
                                            className="border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF] text-sm"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            required
                                            placeholder="Xác nhận mật khẩu"
                                            autoComplete="new-password"
                                            className="border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF] text-sm"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <Label htmlFor="role">Vai trò</Label>
                                        <select
                                            id="role"
                                            name="role"
                                            required
                                            className="w-full border rounded px-3 py-2 text-sm border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF]"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Chọn vai trò</option>
                                            <option value="customer">Khách hàng</option>
                                            <option value="seller">Người bán</option>
                                        </select>
                                        <InputError message={errors.role} />
                                    </div>

                                    <div className="sm:w-44">
                                        <Button
                                            type="submit"
                                            className="mt-1 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2] flex items-center justify-center py-2 text-sm"
                                            disabled={processing}
                                        >
                                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                            <span>{processing ? 'Đang tạo...' : 'Tạo tài khoản'}</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center my-2">
                                    <div className="h-px bg-gray-200 flex-1" />
                                    <span className="px-2 text-xs text-gray-400">hoặc</span>
                                    <div className="h-px bg-gray-200 flex-1" />
                                </div>

                                <a
                                    href="/auth/google"
                                    className="flex items-center gap-2 justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 w-full"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.5-34.6-4.3-51.1H272v96.7h147.7c-6.4 34.6-25.2 63.9-53.9 83.6v69.5h87c51.2-47.1 82.7-116.7 82.7-198.7z"/>
                                        <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.2l-87-69.5c-24.1 16.2-55 25.8-93.6 25.8-71.9 0-132.8-48.5-154.6-113.8H28.1v71.4C73.1 490.7 167.2 544.3 272 544.3z"/>
                                        <path fill="#FBBC05" d="M117.4 328.6c-10.9-32.6-10.9-67.8 0-100.4V156.8H28.1c-39.6 78.2-39.6 170.1 0 248.3l89.3-76.5z"/>
                                        <path fill="#EA4335" d="M272 107.2c39.9 0 75.9 13.7 104.2 40.6l78.1-78.1C407.3 24.3 345.5 0 272 0 167.2 0 73.1 53.6 28.1 137.5l89.3 71.4C139.2 155.7 200.1 107.2 272 107.2z"/>
                                    </svg>
                                    <span>Đăng ký bằng Google</span>
                                </a>

                                <div className="mt-2 text-center text-sm">
                                    Bạn đã có tài khoản?{' '}
                                    <TextLink href={login()} className="text-[#0AC1EF] font-semibold">
                                        Đăng nhập
                                    </TextLink>
                                </div>

                                <div className="w-full mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-5 w-5 text-[#0AC1EF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path d="M3 7h13v6H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 13h2l2 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
                                                <circle cx="18" cy="17" r="1.5" fill="currentColor"/>
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-700">Dành cho Shipper</h3>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center px-2">
                                            Truy cập nhanh cho Shipper — quản lý đơn và lộ trình.
                                        </p>

                                        <div className="flex gap-2 w-full justify-center">
                                            <a
                                                href="/shipper/register"
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0AC1EF] text-[#0AC1EF] bg-white hover:bg-[#f0fbfd] transition text-sm"
                                            >
                                                Đăng ký Shipper
                                            </a>

                                            <a
                                                href="/shipper/login"
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2] transition text-sm"
                                            >
                                                Đăng nhập Shipper
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AuthLayout>
    );
}
