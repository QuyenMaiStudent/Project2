import ConfirmablePasswordController from '@/actions/App/Http/Controllers/Auth/ConfirmablePasswordController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Xác nhận mật khẩu"
            description="Đây là khu vực bảo mật, vui lòng xác nhận mật khẩu trước khi tiếp tục."
        >
            <Head title="Xác nhận mật khẩu" />

            <section
                className="absolute top-0 left-0 w-full h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="w-full max-w-md rounded-2xl border-2 border-[#0AC1EF] bg-white p-8 shadow-xl mx-6 flex flex-col items-center">
                    
                    <img src="/images/logo.png" alt="Logo TechNest" className="mb-4 h-24 w-auto" />

                    <h1 className="mb-4 text-3xl font-extrabold text-[#0AC1EF] text-center tracking-wide">
                        Xác nhận mật khẩu của bạn
                    </h1>

                    <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-4 w-full">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        autoComplete="current-password"
                                        autoFocus
                                        className="border-[#0AC1EF]"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    className="mt-2 w-full rounded-lg bg-[#0AC1EF] text-white hover:bg-[#0999c2]"
                                    disabled={processing}
                                    data-test="confirm-password-button"
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Xác nhận mật khẩu
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </section>
        </AuthLayout>
    );
}