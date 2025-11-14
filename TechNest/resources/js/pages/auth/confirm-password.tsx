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
            title="Xác nhận mật khẩu của bạn"
            description="Đây là khu vực an toàn của ứng dụng. Vui lòng xác nhận mật khẩu của bạn trước khi tiếp tục."
        >
            <Head title="Xác nhận mật khẩu" />

            <Form {...ConfirmablePasswordController.store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input id="password" type="password" name="password" placeholder="Password" autoComplete="current-password" autoFocus />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button className="w-full" disabled={processing} data-test="confirm-password-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Xác nhận mật khẩu
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
