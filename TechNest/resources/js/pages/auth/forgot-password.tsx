import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { flash, errors } = usePage().props as any;

    return (
        <AuthLayout title="Quên mật khẩu" description="Nhập email của bạn để nhận liên kết đặt lại mật khẩu">
            <Head title="Quên mật khẩu" />

            <section
                className="absolute top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-md rounded-2xl border-2 border-[#0AC1EF] bg-white p-8 shadow-xl mx-6 flex flex-col items-center">
                    
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-4 h-24 w-auto" />

                    <h1 className="mb-4 text-3xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Quên mật khẩu
                    </h1>

                    {(status || flash?.status) && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status || flash.status}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 text-center text-sm font-medium text-red-600">
                            {flash.error}
                        </div>
                    )}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm text-left w-full">
                            <ul className="list-disc list-inside">
                                {Object.values(errors).map((err, idx) => (
                                    <li key={idx}>{String(err)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Form {...PasswordResetLinkController.store.form()} className="flex flex-col gap-4 w-full">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Địa chỉ email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="nhapemail@gmail.com"
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <Button
                                    className="mt-2 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Gửi liên kết đặt lại mật khẩu
                                </Button>
                            </>
                        )}
                    </Form>

                    <div className="mt-3 text-center text-sm text-muted-foreground">
                        <span>Hoặc quay lại </span>
                        <TextLink href={login()} className="text-[#0AC1EF] font-semibold">
                            Đăng nhập
                        </TextLink>
                    </div>
                </div>
            </section>
        </AuthLayout>
    );
}
