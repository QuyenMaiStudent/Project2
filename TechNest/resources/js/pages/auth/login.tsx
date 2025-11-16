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
                <div className="w-full max-w-md rounded-2xl border-2 border-[#0AC1EF] bg-white p-8 shadow-xl mx-6 flex flex-col items-center">
                    
                    {/* Logo */}
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-4 h-24 w-auto" />

                    {/* Tiêu đề trang trí */}
                    <h1 className="mb-4 text-3xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Đăng nhập tài khoản của bạn
                    </h1>

                    <Form
                        {...AuthenticatedSessionController.store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-4 w-full"
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
                                        className="border-[#0AC1EF]"
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
                                        className="border-[#0AC1EF]"
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
                                    className="mt-1 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                >
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Đăng nhập
                                </Button>

                                <div className="flex justify-center mt-3">
                                    <a
                                        href="/auth/google"
                                        className="flex items-center gap-2 w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
                                    >
                                        <img src="/images/google-icon.svg" alt="Google" className="h-5 w-5" />
                                        Đăng nhập bằng Google
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
                            </>
                        )}
                    </Form>

                    {status && (
                        <div className="mt-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                </div>
            </section>
        </AuthLayout>
    );
}
