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
        <AuthLayout title="Tạo một tài khoản mới" description="Nhập thông tin của bạn bên dưới để tạo tài khoản">
            <Head title="Đăng ký" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Tên</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa chỉ Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={emailError || errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Vai trò</Label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="border rounded px-3 py-2"
                                    tabIndex={5}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Chọn vai trò</option>
                                    <option value="customer">Khách hàng</option>
                                    <option value="seller">Người bán</option>
                                </select>
                                <InputError message={errors.role} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={6} data-test="register-user-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Tạo tài khoản
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Bạn đã có tài khoản?{' '}
                            <TextLink href={login()} tabIndex={7}>
                                Đăng nhập
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
