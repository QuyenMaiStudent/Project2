import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Product {
    id: number;
    name: string;
    price: number;
    primary_image?: { url: string };
    brand?: { name: string };
    short_description?: string;
}

interface Props {
    products: Product[];
}

export default function ProductIndex({ products }: Props) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sản phẩm" />
            {/* Header (copy từ welcome.tsx) */}
            <header className="w-full bg-[#0AC1EF] py-3 px-6 flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/images/logo.png" alt="TechNest Logo" className="h-12 w-auto" />
                </div>
                <div className="flex-1 flex justify-center px-8">
                    <div className="relative w-full max-w-2xl">
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
                            placeholder="Tìm kiếm"
                            className="w-full px-10 py-3 rounded-lg border border-gray-300 focus:outline-none text-lg"
                        />
                    </div>
                </div>
                <nav className="flex items-center gap-6">
                    <Link href="/products" className="text-black font-semibold text-lg hover:underline">Sản phẩm</Link>
                    <Link href="/support" className="text-black font-semibold text-lg hover:underline">Hỗ trợ</Link>
                    {auth.user ? (
                        <Link
                            href={
                                auth.user.role === 'admin'
                                    ? '/admin/dashboard'
                                    : auth.user.role === 'seller'
                                    ? '/seller/dashboard'
                                    : '/customer/dashboard'
                            }
                            className="inline-block rounded-sm border border-white px-6 py-2 text-base leading-normal text-white hover:bg-[#0999c2]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="inline-block rounded-sm border border-white px-6 py-2 text-base leading-normal text-white hover:bg-[#0999c2]"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/register"
                                className="inline-block rounded-sm border border-white px-6 py-2 text-base leading-normal text-white hover:bg-[#0999c2]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Main content */}
            <div className="bg-[#f5f5f5] min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-8 text-[#0AC1EF] text-center">Danh sách sản phẩm</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {products.length === 0 && (
                            <div className="col-span-full text-center text-gray-500">Chưa có sản phẩm nào.</div>
                        )}
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col border border-gray-100 group"
                            >
                                <Link href={`/products/${product.id}`}>
                                    <div className="aspect-square bg-gray-50 flex items-center justify-center rounded-t-lg overflow-hidden">
                                        <img
                                            src={product.primary_image?.url || '/images/logo.png'}
                                            alt={product.name}
                                            className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                                            loading="lazy"
                                            onError={e => (e.currentTarget.src = '/images/logo.png')}
                                        />
                                    </div>
                                </Link>
                                <div className="flex-1 flex flex-col px-3 py-2">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="font-semibold text-base text-gray-900 hover:text-[#0AC1EF] line-clamp-2 min-h-[48px]"
                                    >
                                        {product.name}
                                    </Link>
                                    {product.brand && (
                                        <div className="text-xs text-gray-500 mt-1">{product.brand.name}</div>
                                    )}
                                    <div className="mt-2 font-bold text-lg text-[#ee4d2d]">
                                        {product.price != null
                                            ? Number(product.price).toLocaleString() + '₫'
                                            : 'Liên hệ'}
                                    </div>
                                    {product.short_description && (
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{product.short_description}</div>
                                    )}
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="mt-3 mb-1 px-3 py-1 bg-[#0AC1EF] text-white rounded text-sm text-center hover:bg-[#0999c2] transition-colors"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer (copy từ welcome.tsx) */}
            <footer className="w-full bg-[#0AC1EF] text-white mt-0 py-8 px-6">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="TechNest Logo" className="h-10 w-auto" />
                        <span className="font-bold text-lg">TechNest</span>
                    </div>
                    <div className="text-center md:text-left text-base">
                        © {new Date().getFullYear()} TechNest. All rights reserved.
                        <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 text-white/90">
                            <span>Hotline: <a href="tel:0979701300" className="underline hover:text-white">0979 701 300</a></span>
                            <span>Email: <a href="mailto:maixuangiaquyen10@gmail.com" className="underline hover:text-white">maixuangiaquyen10@gmail.com</a></span>
                            <span>
                                Facebook: <a href="https://www.facebook.com/maixuangiaquyen" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">facebook.com/maixuangiaquyen</a>
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/about" className="hover:underline text-white">Giới thiệu</Link>
                        <Link href="/support" className="hover:underline text-white">Hỗ trợ</Link>
                        <Link href="/contact" className="hover:underline text-white">Liên hệ</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}
