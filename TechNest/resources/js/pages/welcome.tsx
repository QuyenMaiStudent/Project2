import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function Welcome() {
    return (
        <PublicLayout>
            <Head>{/* ... */}</Head>
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
        </PublicLayout>
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
