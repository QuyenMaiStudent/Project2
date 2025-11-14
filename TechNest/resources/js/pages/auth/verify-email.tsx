// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout title="Xác thực Email" description="Vui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào liên kết chúng tôi vừa gửi đến email của bạn.">
            <Head title="Xác thực Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Một liên kết xác thực mới đã được gửi đến địa chỉ email bạn đã cung cấp trong quá trình đăng ký.
                </div>
            )}

            <Form {...EmailVerificationNotificationController.store.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Gửi lại email xác thực
                        </Button>

                        <TextLink href={logout()} className="mx-auto block text-sm">
                            Đăng xuất
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
