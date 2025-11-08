import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import CartIcon from '@/components/Cart/CartIcon';

export default function Header() {
    const props = usePage<SharedData>().props;
    const auth = props.auth;

    return (
        <header className="flex w-full items-center justify-between bg-[#0AC1EF] px-6 py-3">
            {/* Logo */}
            <div className="flex items-center">
                <img src="/images/logo.png" alt="TechNest Logo" className="h-12 w-auto" />
            </div>

            {/* Thanh tìm kiếm với icon kính lúp và nút tìm */}
            <div className="flex flex-1 justify-center px-8">
                <form
                    onSubmit={e =>
                    {
                        e.preventDefault();
                        const input = e.currentTarget.querySelector('input[name="search"]') as HTMLInputElement;
                        if (input && input.value.trim() !== '') {
                            // Dùng router.visit để gửi request Inertia
                            router.visit('/products', { method: 'get', data: { search: input.value.trim() }, preserveState: true });
                        }
                    }}
                    className="relative w-full max-w-2xl flex"
                >
                    {/* Icon kính lúp */}
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm kiếm"
                        className="flex-1 rounded-l-lg border border-gray-300 px-10 py-3 text-lg focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-[#0999c2] text-white px-4 py-3 rounded-r-lg hover:bg-[#077a99]"
                    >
                        Tìm
                    </button>
                </form>
            </div>

            {/* Navigation links và giỏ hàng */}
            <nav className="flex items-center gap-6">
                <Link href="/products" className="text-lg font-semibold text-black hover:underline">
                    Sản phẩm
                </Link>
                <Link href="/support" className="text-lg font-semibold text-black hover:underline">
                    Hỗ trợ
                </Link>

                {/* Cart icon + count chỉ hiện cho khách hàng */}
                <CartIcon />

                {auth.user ? (
                    <Link
                        href={
                            auth.user.role === 'admin'
                                ? '/admin/dashboard'
                                : auth.user.role === 'seller'
                                  ? '/seller/dashboard'
                                  : '/settings/profile'
                        }
                        className="inline-block rounded-sm border border-white px-6 py-2 text-base leading-normal text-white hover:bg-[#0999c2]"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={login()}
                            className="inline-block rounded-sm border border-white px-6 py-2 text-base leading-normal text-white hover:bg-[#0999c2]"
                        >
                            Log in
                        </Link>
                        <Link
                            href={register()}
                            className="inline-block rounded-sm border border-white px-6 py-2 text-base leading-normal text-white hover:bg-[#0999c2]"
                        >
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
