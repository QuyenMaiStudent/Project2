import { Head, useForm, usePage } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const { props } = usePage();
    const success = (props as any).flash?.success;

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/shipper/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Head title="Đăng nhập Shipper" />
            <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-lg bg-white p-8 shadow">
                <h1 className="text-2xl font-semibold text-gray-900">Đăng nhập Shipper</h1>

                {success && (
                    <div className="rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                    <input
                        type="password"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        required
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <label className="inline-flex items-center text-sm text-gray-600">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={data.remember}
                        onChange={(event) => setData('remember', event.target.checked)}
                    />
                    Ghi nhớ đăng nhập
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}