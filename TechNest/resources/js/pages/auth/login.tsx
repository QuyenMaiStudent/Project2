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

            {/* Banner full màn hình */}
            <section
                className="absolute top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-md rounded-2xl border-2 border-[#0AC1EF] bg-white p-10 shadow-xl mx-6">
                    <h2 className="mb-2 text-center text-3xl font-bold text-[#1b1b18]">
                        Chào mừng bạn trở lại
                    </h2>
                    <p className="mb-8 text-center text-gray-600">
                        Đăng nhập để tiếp tục mua sắm cùng TechNest
                    </p>

                    <Form
                        {...AuthenticatedSessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        autoComplete="email"
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password */}
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
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" name="remember" />
                                    <Label htmlFor="remember">Ghi nhớ đăng nhập</Label>
                                </div>

                                {/* Nút đăng nhập chính */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-1 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Đăng nhập
                                </Button>

                                {/* Đăng nhập bằng Google */}
                                <div className="flex justify-center">
                                    <a
                                        href="/auth/google"
                                        className="flex items-center gap-2 w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
                                    >
                                        <img src="/images/google-icon.svg" alt="Google" className="h-5 w-5" />
                                        Đăng nhập với Google
                                    </a>
                                </div>

                                {/* Link đăng ký */}
                                <div className="mt-1 text-center text-sm">
                                    Bạn chưa có tài khoản?{' '}
                                    <TextLink
                                        href="/register"
                                        className="text-[#0AC1EF] font-semibold"
                                    >
                                        Đăng ký ngay
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-5 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </section>
        </AuthLayout>
    );
}
