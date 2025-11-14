// Components
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
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-sm text-left">
                    <ul className="list-disc list-inside">
                        {Object.values(errors).map((err, idx) => (
                            <li key={idx}>{String(err)}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="space-y-6">
                <Form {...PasswordResetLinkController.store.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="Nhập email của bạn"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button className="w-full" disabled={processing} data-test="email-password-reset-link-button">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Gửi liên kết đặt lại mật khẩu
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>Hoặc quay lại</span>
                    <TextLink href={login()}>đăng nhập</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
