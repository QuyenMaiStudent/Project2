import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            {/* Header */}
            <header className="w-full bg-[#0AC1EF] py-3 px-6 flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/images/logo.png" alt="TechNest Logo" className="h-12 w-auto" />
                </div>
                {/* Thanh tìm kiếm với icon kính lúp */}
                <div className="flex-1 flex justify-center px-8">
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
            <section
                className="w-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/banner_bg.jpg')" }}
            >
                <div className="max-w-[1200px] w-full mx-auto flex items-center py-12">
                    {/* left content */}
                    <div className="flex-1 flex flex-col justify-center pl-12 pr-4">
                        <h2 className="text-4xl font-bold text-[#1b1b18] mb-4 leading-tight">
                            Những tiện ích<br />công nghệ mới nhất
                        </h2>
                        <p className="text-black mb-4 text-lg lg:text-xl max-w-xl font-bold leading-snug">
                            Khám phá các sản phẩm công nghệ hiện đại, tiện ích và phù hợp với mọi nhu cầu của bạn.<br />
                            TechNest luôn cập nhật những xu hướng mới nhất để mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-5 py-2 bg-[#0AC1EF] text-white text-base font-semibold rounded-lg shadow hover:bg-[#0999c2] border border-dashed border-[#0AC1EF] mt-2 w-auto min-w-[110px] max-w-[180px] text-center"
                        >
                            Mua ngay
                        </Link>
                    </div>

                    {/* right image */}
                    <div className="flex items-center justify-center h-full pr-12">
                        <img src="/images/banner-laptop.png" alt="Laptop" className="h-56 w-auto" />
                    </div>
                </div>
            </section>

             {/* Main content */}
            <div className="w-full bg-[#FDFDFC] flex flex-col items-center px-6 md:px-16 xl:px-32 py-8">
                 {/* Banner */}
                {/* banner đã di chuyển lên trên để tràn full-width */}
                 {/* Sản phẩm mới nhất */}
                <SectionTitle text="SẢN PHẨM MỚI NHẤT" />
                 <div className="w-full max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                     <ProductCard name="iPhone 17 Pro" price="39.900.000 đ" img="/images/iphone.jpg" />
                     <ProductCard name="Đồng hồ thông minh" price="2.900.000 đ" img="/images/smartwatch.jpg" />
                     <ProductCard name="Surface Laptop" price="62.000.000 đ" img="/images/surface_laptop.jpg" />
                     <ProductCard name="Tai nghe không dây" price="1.500.000 đ" img="/images/headphone.jpg" />
                 </div>

                {/* Sản phẩm được mua nhiều nhất */}
                <SectionTitle text="SẢN PHẨM ĐƯỢC MUA NHIỀU NHẤT" />
                <div className="w-full max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <ProductCard name="iPhone 17 Pro" price="39.900.000 đ" img="/images/iphone.jpg" />
                    <ProductCard name="Đồng hồ thông minh" price="2.900.000 đ" img="/images/smartwatch.jpg" />
                    <ProductCard name="Surface Laptop" price="62.000.000 đ" img="/images/surface_laptop.jpg" />
                    <ProductCard name="Tai nghe không dây" price="1.500.000 đ" img="/images/headphone.jpg" />
                </div>

                {/* Sản phẩm được đánh giá tốt nhất */}
                <SectionTitle text="SẢN PHẨM ĐƯỢC ĐÁNH GIÁ TỐT NHẤT" />
                <div className="w-full max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <ProductCard name="iPhone 17 Pro" price="39.900.000 đ" img="/images/iphone.jpg" />
                    <ProductCard name="Đồng hồ thông minh" price="2.900.000 đ" img="/images/smartwatch.jpg" />
                    <ProductCard name="Surface Laptop" price="62.000.000 đ" img="/images/surface_laptop.jpg" />
                    <ProductCard name="Tai nghe không dây" price="1.500.000 đ" img="/images/headphone.jpg" />
                </div>
            </div>

            {/* Footer */}
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

// Tiêu đề section
function SectionTitle({ text }: { text: string }) {
    return (
        <h3 className="text-2xl font-bold text-center mb-8 mt-2 tracking-wide">{text}</h3>
    );
}

// Card sản phẩm mẫu
function ProductCard({ name, price, img }: { name: string; price: string; img: string }) {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 w-full max-w-xs flex flex-col items-center p-6">
            <img src={img} alt={name} className="h-32 w-auto mb-4" />
            <div className="font-semibold text-lg text-[#1b1b18] text-center mb-2">{name}</div>
            <div className="text-[#0AC1EF] font-bold text-xl">{price}</div>
        </div>
    );
}
