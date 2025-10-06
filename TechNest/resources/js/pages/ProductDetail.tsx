import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { type SharedData } from '@/types';
import { router } from '@inertiajs/react';

interface Image { url: string; alt_text?: string; is_primary?: boolean; }
interface Variant { id: number; variant_name: string; price: number; stock: number; }
interface Spec { key: string; value: string; }
interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    brand?: string;
    images: Image[];
    variants: Variant[];
    specs: Spec[];
}

interface Props { product: Product; }

export default function ProductDetail({ product }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [mainImg, setMainImg] = useState(
        product.images && product.images.length > 0
            ? product.images[0].url
            : '/images/logo.png'
    );
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants && product.variants.length > 0
            ? product.variants[0]
            : null
    );
    const [quantity, setQuantity] = useState(1);

    const price = selectedVariant ? selectedVariant.price : product.price;
    const maxStock = selectedVariant ? selectedVariant.stock : product.stock;

    const handleAddToCart = () => {
        if (!auth.user) {
            alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
            router.visit('/login');
            return;
        }
        router.post('/cart/add', {
            product_id: product.id,
            product_variant_id: selectedVariant ? selectedVariant.id : null,
            quantity,
        }, {
            onSuccess: () => alert('Đã thêm vào giỏ hàng!'),
            onError: (errors) => {
                alert(errors.msg || 'Có lỗi xảy ra!');
            }
        });
    };

    return (
        <>
            <Head title={product.name} />

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

            {/* Main content giữ nguyên */}
            <div className="bg-[#f5f5f5] min-h-screen py-8">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-8 flex flex-col md:flex-row gap-8">
                    {/* Ảnh sản phẩm */}
                    <div className="md:w-2/5 flex flex-col items-center">
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded border mb-4 overflow-hidden">
                            <img src={mainImg} alt={product.name} className="object-contain w-full h-full" />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {(product.images && product.images.length > 0 ? product.images : [{ url: '/images/logo.png', alt_text: 'No image' }]).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img.url}
                                    alt={img.alt_text || product.name}
                                    className={`h-16 w-16 object-contain rounded border cursor-pointer ${mainImg === img.url ? 'border-[#0AC1EF] border-2' : 'border-gray-200'}`}
                                    onClick={() => setMainImg(img.url)}
                                />
                            ))}
                        </div>
                    </div>
                    {/* Thông tin sản phẩm */}
                    <div className="md:w-3/5 flex flex-col gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                        {product.brand && (
                            <div className="text-base text-gray-500 mb-1">Thương hiệu: <span className="font-semibold">{product.brand}</span></div>
                        )}
                        <div className="text-[#ee4d2d] text-3xl font-bold mb-2">
                            {price.toLocaleString()}₫
                        </div>
                        <div className="text-gray-600 mb-2">
                            {maxStock > 0 ? `Còn ${maxStock} sản phẩm` : 'Hết hàng'}
                        </div>
                        {/* Variant */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-2">
                                <div className="font-semibold mb-1">Phân loại:</div>
                                <div className="flex gap-2 flex-wrap">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            className={`px-4 py-2 rounded border ${selectedVariant?.id === variant.id ? 'bg-[#0AC1EF] text-white border-[#0AC1EF]' : 'bg-white border-gray-300 text-gray-800'} font-medium`}
                                            onClick={() => setSelectedVariant(variant)}
                                        >
                                            {variant.variant_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Số lượng */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-semibold">Số lượng:</span>
                            <button
                                type="button"
                                className="w-8 h-8 rounded border border-gray-300 text-lg"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >-</button>
                            <input
                                type="number"
                                min={1}
                                max={maxStock}
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, Math.min(maxStock, Number(e.target.value))))}
                                className="w-14 text-center border rounded"
                            />
                            <button
                                type="button"
                                className="w-8 h-8 rounded border border-gray-300 text-lg"
                                onClick={() => setQuantity(q => Math.min(maxStock, q + 1))}
                                disabled={quantity >= maxStock}
                            >+</button>
                            <span className="text-gray-500 ml-2">({maxStock} có sẵn)</span>
                        </div>
                        {/* Nút mua */}
                        <div className="flex gap-4 mt-2">
                            <button 
                                className="px-8 py-3 bg-[#ee4d2d] text-white rounded font-bold text-lg hover:bg-[#d73211] transition-colors"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>
                            <button className="px-8 py-3 bg-[#0AC1EF] text-white rounded font-bold text-lg hover:bg-[#0999c2] transition-colors">
                                Mua ngay
                            </button>
                        </div>
                        {/* Mô tả */}
                        {product.description && (
                            <div className="mt-6">
                                <div className="font-semibold mb-2 text-lg">Mô tả sản phẩm</div>
                                <div className="text-gray-700 whitespace-pre-line">{product.description}</div>
                            </div>
                        )}
                        {/* Thông số kỹ thuật */}
                        {product.specs && product.specs.length > 0 && (
                            <div className="mt-6">
                                <div className="font-semibold mb-2 text-lg">Thông số kỹ thuật</div>
                                <table className="w-full text-left border">
                                    <tbody>
                                        {product.specs.map((spec, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="py-2 px-3 font-medium w-1/3 bg-gray-50">{spec.key}</td>
                                                <td className="py-2 px-3">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
