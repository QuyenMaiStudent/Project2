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
import { useRef, useState } from 'react';

export default function Register() {
    const formRef = useRef<HTMLFormElement>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        const form = e.target as HTMLFormElement;
        const email = (form.email as HTMLInputElement).value;
        if (!email.endsWith('@gmail.com')) {
            e.preventDefault();
            setEmailError('Chỉ chấp nhận đăng ký bằng email Google (@gmail.com)');
        } else {
            setEmailError(null);
        }
    };

    return (
        <AuthLayout title="Đăng ký tài khoản" description="Nhập thông tin của bạn để tạo tài khoản mới">
            <Head title="Đăng ký" />

            <section
                className="absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="mx-6 flex w-full max-w-md flex-col items-center rounded-2xl border-2 border-[#0AC1EF] bg-white p-8 shadow-xl">
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-4 h-24 w-auto" />

                    <h1 className="mb-6 text-center text-3xl font-extrabold tracking-wide text-[#0AC1EF]">Đăng ký tài khoản mới của bạn</h1>

                    <Form
                        {...RegisteredUserController.store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex w-full flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-4">
                                    <div className="grid gap-1">
                                        <Label htmlFor="name">Họ và tên</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Nhập họ và tên"
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label htmlFor="email">Địa chỉ email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@gmail.com"
                                        />
                                        <InputError message={emailError || errors.email} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label htmlFor="password">Mật khẩu</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Nhập lại mật khẩu"
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-1" />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label htmlFor="role">Vai trò</Label>
                                        <select id="role" name="role" required className="rounded border px-3 py-2" tabIndex={5} defaultValue="">
                                            <option value="" disabled>
                                                Chọn vai trò
                                            </option>
                                            <option value="customer">Khách hàng</option>
                                            <option value="seller">Người bán</option>
                                        </select>
                                        <InputError message={errors.role} className="mt-1" />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                        tabIndex={6}
                                        data-test="register-user-button"
                                    >
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Tạo tài khoản
                                    </Button>
                                </div>

                                <div className="mt-3 flex justify-center">
                                    <a
                                        href="/auth/google"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
                                    >
                                        <img src="/images/google-icon.svg" alt="Google" className="h-5 w-5" />
                                        Đăng ký bằng Google
                                    </a>
                                </div>

                                <div className="mt-2 text-center text-sm text-muted-foreground">
                                    Bạn đã có tài khoản?{' '}
                                    <TextLink href={login()} tabIndex={7}>
                                        Đăng nhập
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AuthLayout>
    );
}
