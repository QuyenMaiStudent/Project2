import { Head, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/shipper/register');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Head title="Đăng ký Shipper" />
            <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-lg bg-white p-8 shadow">
                <h1 className="text-2xl font-semibold text-gray-900">Đăng ký Shipper</h1>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <input
                        type="text"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

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
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                        type="text"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        value={data.phone}
                        onChange={(event) => setData('phone', event.target.value)}
                        placeholder="0987xxxxxx"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
                >
                    Đăng ký
                </button>
            </form>
        </div>
    );
}