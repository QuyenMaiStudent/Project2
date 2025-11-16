import NewPasswordController from '@/actions/App/Http/Controllers/Auth/NewPasswordController';
import { Form, Head, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { flash, errors } = usePage().props as any;

    return (
        <AuthLayout title="Đặt lại mật khẩu" description="Vui lòng nhập mật khẩu mới bên dưới">
            <Head title="Đặt lại mật khẩu" />

            <section
                className="absolute top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-md rounded-2xl border-2 border-[#0AC1EF] bg-white p-8 shadow-xl mx-6 flex flex-col items-center">
                    
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-4 h-24 w-auto" />

                    <h1 className="mb-4 text-3xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Đặt lại mật khẩu
                    </h1>

                    {flash?.status && (
                        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded w-full text-center text-sm font-medium">
                            {flash.status}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded w-full text-center text-sm font-medium">
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

                    <Form
                        {...NewPasswordController.store.form()}
                        transform={(data) => ({ ...data, token, email })}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="flex flex-col gap-4 w-full"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Địa chỉ email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        readOnly
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Mật khẩu mới</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        autoFocus
                                        placeholder="Nhập mật khẩu mới"
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        placeholder="Nhập lại mật khẩu"
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Đặt lại mật khẩu
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AuthLayout>
    );
}
