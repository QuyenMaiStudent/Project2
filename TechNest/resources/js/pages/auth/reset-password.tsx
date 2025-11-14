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

            {/* Thông báo thành công/lỗi */}
            {flash?.status && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{flash.status}</div>
            )}
            {flash?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{flash.error}</div>
            )}

            <Form
                {...NewPasswordController.store.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Địa chỉ Email</Label>
                            <Input id="email" type="email" name="email" autoComplete="email" value={email} className="mt-1 block w-full" readOnly />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Mật khẩu mới</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder="Nhập mật khẩu mới"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder="Nhập lại mật khẩu"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <Button type="submit" className="mt-4 w-full" disabled={processing} data-test="reset-password-button">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Đặt lại mật khẩu
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
