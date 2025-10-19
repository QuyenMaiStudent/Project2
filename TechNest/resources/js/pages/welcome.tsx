import CartIcon from '@/components/Cart/CartIcon';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import ChatBot from '@/pages/ChatUI/ChatBot';
import { useState } from 'react';

export default function Welcome() {
    const props = usePage<SharedData>().props;
    const auth = props.auth;
    const cartCount: number = (props.cartCount ?? 0) as number;
    const isCustomer: boolean = (props.isCustomer ?? false) as boolean;
    const [showChat, setShowChat] = useState(false);

    return (
        <>
            <Head>{/* ... */}</Head>
            {/* Header */}
            <header className="flex w-full items-center justify-between bg-[#0AC1EF] px-6 py-3">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/images/logo.png" alt="TechNest Logo" className="h-12 w-auto" />
                </div>

                {/* Thanh tìm kiếm với icon kính lúp */}
                <div className="flex flex-1 justify-center px-8">
                    <div className="relative w-full max-w-2xl">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {/* SVG icon kính lúp */}
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
                            className="w-full rounded-lg border border-gray-300 px-10 py-3 text-lg focus:outline-none"
                        />
                    </div>
                </div>

                {/* Navigation links and cart */}
                <nav className="flex items-center gap-6">
                    <Link href="/products" className="text-lg font-semibold text-black hover:underline">
                        Sản phẩm
                    </Link>
                    <Link href="/support" className="text-lg font-semibold text-black hover:underline">
                        Hỗ trợ
                    </Link>

                    {/* Cart icon + count only for customer users */}
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

            {/* Full-width banner: flush with header and edges (no side padding) */}
            <section className="w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}>
                <div className="mx-auto flex w-full max-w-[1200px] items-center py-12">
                    {/* left content */}
                    <div className="flex flex-1 flex-col justify-center pr-4 pl-12">
                        <h2 className="mb-4 text-4xl leading-tight font-bold text-[#1b1b18]">
                            Những tiện ích
                            <br />
                            công nghệ mới nhất
                        </h2>
                        <p className="mb-4 max-w-xl text-lg leading-snug font-bold text-black lg:text-xl">
                            Khám phá các sản phẩm công nghệ hiện đại, tiện ích và phù hợp với mọi nhu cầu của bạn.
                            <br />
                            TechNest luôn cập nhật những xu hướng mới nhất để mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
                        </p>
                        <Link
                            href="/products"
                            className="mt-2 inline-block w-auto max-w-[180px] min-w-[110px] rounded-lg border border-dashed border-[#0AC1EF] bg-[#0AC1EF] px-5 py-2 text-center text-base font-semibold text-white shadow hover:bg-[#0999c2]"
                        >
                            Mua ngay
                        </Link>
                    </div>

                    {/* right image */}
                    <div className="flex h-full items-center justify-center pr-12">
                        <img src="/images/banner-laptop.png" alt="Laptop" className="h-56 w-auto" />
                    </div>
                </div>
            </section>

            {/* Main content */}
            <div className="flex w-full flex-col items-center bg-[#FDFDFC] px-6 py-8 md:px-16 xl:px-32">
                {/* Banner */}
                {/* banner đã di chuyển lên trên để tràn full-width */}
                {/* Sản phẩm mới nhất */}
                <SectionTitle text="SẢN PHẨM MỚI NHẤT" />
                <div className="mb-12 grid w-full max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-4">
                    <ProductCard name="iPhone 17 Pro" price="39.900.000 đ" img="/images/iphone.jpg" />
                    <ProductCard name="Đồng hồ thông minh" price="2.900.000 đ" img="/images/smartwatch.jpg" />
                    <ProductCard name="Surface Laptop" price="62.000.000 đ" img="/images/surface_laptop.jpg" />
                    <ProductCard name="Tai nghe không dây" price="1.500.000 đ" img="/images/headphone.jpg" />
                </div>

                {/* Sản phẩm được mua nhiều nhất */}
                <SectionTitle text="SẢN PHẨM ĐƯỢC MUA NHIỀU NHẤT" />
                <div className="mb-12 grid w-full max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-4">
                    <ProductCard name="iPhone 17 Pro" price="39.900.000 đ" img="/images/iphone.jpg" />
                    <ProductCard name="Đồng hồ thông minh" price="2.900.000 đ" img="/images/smartwatch.jpg" />
                    <ProductCard name="Surface Laptop" price="62.000.000 đ" img="/images/surface_laptop.jpg" />
                    <ProductCard name="Tai nghe không dây" price="1.500.000 đ" img="/images/headphone.jpg" />
                </div>

                {/* Sản phẩm được đánh giá tốt nhất */}
                <SectionTitle text="SẢN PHẨM ĐƯỢC ĐÁNH GIÁ TỐT NHẤT" />
                <div className="mb-16 grid w-full max-w-[1400px] grid-cols-2 gap-8 md:grid-cols-4">
                    <ProductCard name="iPhone 17 Pro" price="39.900.000 đ" img="/images/iphone.jpg" />
                    <ProductCard name="Đồng hồ thông minh" price="2.900.000 đ" img="/images/smartwatch.jpg" />
                    <ProductCard name="Surface Laptop" price="62.000.000 đ" img="/images/surface_laptop.jpg" />
                    <ProductCard name="Tai nghe không dây" price="1.500.000 đ" img="/images/headphone.jpg" />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-0 w-full bg-[#0AC1EF] px-6 py-8 text-white">
                <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="TechNest Logo" className="h-10 w-auto" />
                        <span className="text-lg font-bold">TechNest</span>
                    </div>
                    <div className="text-center text-base md:text-left">
                        © {new Date().getFullYear()} TechNest. All rights reserved.
                        <div className="mt-2 flex flex-col gap-2 text-white/90 md:flex-row md:items-center">
                            <span>
                                Hotline:{' '}
                                <a href="tel:0979701300" className="underline hover:text-white">
                                    0979 701 300
                                </a>
                            </span>
                            <span>
                                Email:{' '}
                                <a href="mailto:maixuangiaquyen10@gmail.com" className="underline hover:text-white">
                                    maixuangiaquyen10@gmail.com
                                </a>
                            </span>
                            <span>
                                Facebook:{' '}
                                <a
                                    href="https://www.facebook.com/maixuangiaquyen"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-white"
                                >
                                    facebook.com/maixuangiaquyen
                                </a>
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/about" className="text-white hover:underline">
                            Giới thiệu
                        </Link>
                        <Link href="/support" className="text-white hover:underline">
                            Hỗ trợ
                        </Link>
                        <Link href="/contact" className="text-white hover:underline">
                            Liên hệ
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Floating chat button */}
            <div className="fixed bottom-6 right-6 z-50">
                {showChat ? (
                    <div className="bg-white rounded-lg shadow-xl p-2 mb-2 w-[480px] md:w-[575px]">
                        <div className="flex justify-end mb-1">
                            <button 
                                onClick={() => setShowChat(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="sr-only">Đóng</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <ChatBot />
                    </div>
                ) : (
                    <button
                        onClick={() => setShowChat(true)}
                        className="bg-[#0AC1EF] text-white p-4 rounded-full shadow-lg hover:bg-[#09b0da] transition-colors flex items-center justify-center"
                        title="Chat với trợ lý"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                    </button>
                )}
            </div>
        </>
    );
}

// Tiêu đề section
function SectionTitle({ text }: { text: string }) {
    return <h3 className="mt-2 mb-8 text-center text-2xl font-bold tracking-wide">{text}</h3>;
}

// Card sản phẩm mẫu
function ProductCard({ name, price, img }: { name: string; price: string; img: string }) {
    return (
        <div className="flex w-full max-w-xs flex-col items-center rounded-xl border border-gray-200 bg-white p-6 shadow">
            <img src={img} alt={name} className="mb-4 h-32 w-auto" />
            <div className="mb-2 text-center text-lg font-semibold text-[#1b1b18]">{name}</div>
            <div className="text-xl font-bold text-[#0AC1EF]">{price}</div>
        </div>
    );
}
