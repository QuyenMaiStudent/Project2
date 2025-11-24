import { Head, Form } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Đăng nhập tài khoản" description="">
            <Head title="Đăng nhập" />

            <section
                className="absolute top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-sm rounded-2xl border-2 border-[#0AC1EF] bg-white p-6 shadow-xl mx-6 flex flex-col items-center">
                    
                    {/* Logo */}
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-3 h-16 w-auto" />

                    {/* Tiêu đề trang trí */}
                    <h1 className="mb-3 text-2xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Đăng nhập tài khoản của bạn
                    </h1>

                    <Form
                        {...AuthenticatedSessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-3 w-full"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Địa chỉ email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="email@gmail.com"
                                        autoComplete="email"
                                        className="border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF]"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href="/forgot-password"
                                                className="text-sm text-[#0AC1EF]"
                                            >
                                                Quên mật khẩu?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Nhập mật khẩu"
                                        autoComplete="current-password"
                                        className="border-[#0AC1EF] focus:ring-2 focus:ring-[#0AC1EF]"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" name="remember" />
                                    <Label htmlFor="remember">Ghi nhớ đăng nhập</Label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-1 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2] flex items-center justify-center"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <span>{processing ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
                                </Button>

                                <div className="flex justify-center mt-3">
                                    <a
                                        href="/auth/google"
                                        className="flex items-center gap-2 justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100 w-auto"
                                    >
                                        {/* Inline Google icon to ensure visibility */}
                                        <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path fill="#4285F4" d="M533.5 278.4c0-17.6-1.5-34.6-4.3-51.1H272v96.7h147.7c-6.4 34.6-25.2 63.9-53.9 83.6v69.5h87c51.2-47.1 82.7-116.7 82.7-198.7z"/>
                                            <path fill="#34A853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.2l-87-69.5c-24.1 16.2-55 25.8-93.6 25.8-71.9 0-132.8-48.5-154.6-113.8H28.1v71.4C73.1 490.7 167.2 544.3 272 544.3z"/>
                                            <path fill="#FBBC05" d="M117.4 328.6c-10.9-32.6-10.9-67.8 0-100.4V156.8H28.1c-39.6 78.2-39.6 170.1 0 248.3l89.3-76.5z"/>
                                            <path fill="#EA4335" d="M272 107.2c39.9 0 75.9 13.7 104.2 40.6l78.1-78.1C407.3 24.3 345.5 0 272 0 167.2 0 73.1 53.6 28.1 137.5l89.3 71.4C139.2 155.7 200.1 107.2 272 107.2z"/>
                                        </svg>
                                        <span>Đăng nhập bằng Google</span>
                                    </a>
                                </div>

                                <div className="mt-2 text-center text-sm">
                                    Bạn chưa có tài khoản?{' '}
                                    <TextLink
                                        href="/register"
                                        className="text-[#0AC1EF] font-semibold"
                                    >
                                        Đăng ký ngay
                                    </TextLink>
                                </div>

                                {/* Shipper section (improved, compact) */}
                                <div className="w-full mt-4 pt-3 border-t border-gray-100">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <svg className="h-5 w-5 text-[#0AC1EF]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path d="M3 7h13v6H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M16 13h2l2 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="7" cy="17" r="1.5" fill="currentColor"/>
                                                <circle cx="18" cy="17" r="1.5" fill="currentColor"/>
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-700">Bạn là Shipper?</h3>
                                        </div>

                                        <p className="text-xs text-gray-500 text-center px-2">
                                            Giao diện Shipper — nhận đơn, quản lý tài xế và theo dõi lộ trình.
                                        </p>

                                        <div className="flex gap-2 w-full justify-center">
                                            <a
                                                href="/shipper/login"
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0AC1EF] text-white shadow-sm hover:bg-[#0999c2] transition text-sm"
                                            >
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M12 11v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M9 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
                                                </svg>
                                                Đăng nhập Shipper
                                            </a>

                                            <a
                                                href="/shipper/register"
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0AC1EF] text-[#0AC1EF] bg-white hover:bg-[#f0fbfd] transition text-sm"
                                            >
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M12 5v14" stroke="#0AC1EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M5 12h14" stroke="#0AC1EF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                Đăng ký Shipper
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-3 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </section>
        </AuthLayout>
    );
}
