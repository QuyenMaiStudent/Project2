import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa chỉ Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Email của bạn"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    {canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            Quên mật khẩu?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Mật khẩu của bạn"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Ghi nhớ đăng nhập</Label>
                            </div>

                            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing} data-test="login-button">
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Đăng nhập
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Bạn chưa có tài khoản?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Đăng ký
                            </TextLink>
                        </div>

                        <div className="mt-4 text-center space-y-2">
                            <a
                                href="/auth/google"
                                className="bg-black text-white px-4 py-2 rounded flex items-center justify-center mt-4"
                            >
                                {/* Google icon */}
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                                    <g>
                                        <path fill="#4285F4" d="M44.5,20H24v8.5h11.7C34.7,33.1,29.8,36,24,36c-6.6,0-12-5.4-12-12s5.4-12,12-12c3.1,0,5.9,1.1,8.1,2.9l6.4-6.4C34.5,5.1,29.5,3,24,3C12.9,3,4,11.9,4,23s8.9,20,20,20c11,0,19.8-8,19.8-20C44,21.3,44.3,20.6,44.5,20z"/>
                                        <path fill="#34A853" d="M6.3,14.7l7,5.1C15.2,17.1,19.2,14,24,14c3.1,0,5.9,1.1,8.1,2.9l6.4-6.4C34.5,5.1,29.5,3,24,3C16.1,3,9.1,7.9,6.3,14.7z"/>
                                        <path fill="#FBBC05" d="M24,44c5.5,0,10.5-2.1,14.3-5.7l-6.6-5.4C29.7,35.1,27,36,24,36c-5.8,0-10.7-2.9-13.7-7.5l-7,5.4C9.1,40.1,16.1,44,24,44z"/>
                                        <path fill="#EA4335" d="M44.5,20H24v8.5h11.7c-1.6,4.1-5.7,7.5-11.7,7.5c-5.8,0-10.7-2.9-13.7-7.5l-7,5.4C9.1,40.1,16.1,44,24,44c11,0,19.8-8,19.8-20C44,21.3,44.3,20.6,44.5,20z"/>
                                    </g>
                                </svg>
                                Đăng nhập bằng Google
                            </a>
                            <div className="text-xs text-gray-600">
                                Bạn là Shipper?{' '}
                                <a href="/shipper/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Đăng nhập Shipper
                                </a>
                                {' '}|{' '}
                                <a href="/shipper/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Đăng ký Shipper
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
