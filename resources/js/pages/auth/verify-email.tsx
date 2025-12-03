import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Xác minh email"
            description="Vui lòng xác minh địa chỉ email của bạn bằng cách nhấp vào liên kết chúng tôi vừa gửi."
        >
            <Head title="Xác minh email" />

            <section
                className="absolute top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-md rounded-2xl border-2 border-[#0AC1EF] bg-white p-8 shadow-xl mx-6 flex flex-col items-center">
                    
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-4 h-24 w-auto" />

                    <h1 className="mb-4 text-3xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Xác minh địa chỉ email
                    </h1>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            Liên kết xác minh mới đã được gửi đến địa chỉ email bạn cung cấp khi đăng ký.
                        </div>
                    )}

                    <Form {...EmailVerificationNotificationController.store.form()} className="flex flex-col gap-4 w-full text-center">
                        {({ processing }) => (
                            <>
                                <Button
                                    disabled={processing}
                                    className="mt-2 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Gửi lại email xác minh
                                </Button>

                                <TextLink href={logout()} className="mt-2 text-sm text-[#0AC1EF] font-semibold">
                                    Đăng xuất
                                </TextLink>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AuthLayout>
    );
}