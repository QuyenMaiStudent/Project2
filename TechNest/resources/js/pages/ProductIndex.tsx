import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useMemo, useState } from 'react';

interface Product {
    id: number;
    name: string;
    price?: number | null;
    primary_image?: { url: string } | null;
    brand?: { id: number; name: string } | null;
    seller?: { id: number; name: string } | null;
    short_description?: string | null;
    condition?: string | null;
    created_at?: string | null;
    categories?: { id: number; name: string }[];
}

interface Option { id: number; name: string; }

interface Props {
    products: Product[];
    brands: Option[];
    categories: Option[];
}

export default function ProductIndex({ products, brands, categories }: Props) {
    const { auth } = usePage<SharedData>().props;

    // Khu vực lọc
    const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [showMoreBrands, setShowMoreBrands] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showMoreSellers, setShowMoreSellers] = useState(false);

    // Sử dụng danh sách do máy chủ cung cấp (tất cả các thương hiệu/danh mục). Nếu trống, hãy chuyển sang danh sách được lấy từ danh sách gốc.
    const brandOptions = useMemo(() => {
        if (brands && brands.length) return brands;
        const map = new Map<number, string>();
        products.forEach(p => {
            if (p.brand && typeof p.brand.id === 'number') map.set(p.brand.id, p.brand.name);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [brands, products]);

    const categoryOptions = useMemo(() => {
        if (categories && categories.length) return categories;
        const map = new Map<number, string>();
        products.forEach(p => {
            (p.categories || []).forEach(c => {
                if (c && typeof c.id === 'number') map.set(c.id, c.name);
            });
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [categories, products]);

    const sellerOptions = useMemo(() => {
        const map = new Map<number, string>();
        products.forEach(p => {
            if (p.seller && typeof p.seller.id === 'number') map.set(p.seller.id, p.seller.name);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [products]);

    const conditionOptions = ['New', 'Renewed', 'Used'];

    // Client-side filtering (brand, category, price, seller, condition)
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand.id))) {
                return false;
            }
            if (selectedCategories.length > 0) {
                const catIds = (p.categories || []).map(c => c.id);
                if (!catIds.some(id => selectedCategories.includes(id))) return false;
            }
            if (minPrice !== '' && (p.price == null || Number(p.price) < Number(minPrice))) return false;
            if (maxPrice !== '' && (p.price == null || Number(p.price) > Number(maxPrice))) return false;
            if (selectedSellers.length > 0 && (!p.seller || !selectedSellers.includes(String(p.seller.id)))) {
                return false;
            }
            if (selectedConditions.length > 0 && (!p.condition || !selectedConditions.includes(p.condition))) {
                return false;
            }
            return true;
        });
    }, [products, selectedBrands, selectedCategories, minPrice, maxPrice, selectedSellers, selectedConditions]);

    const toggleBrand = (id: number) => {
        setSelectedBrands(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleSeller = (id: string) => {
        setSelectedSellers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleCategory = (id: number) => {
        setSelectedCategories(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const toggleCondition = (c: string) => {
        setSelectedConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    };

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

            {/* Main content with left sticky sidebar like Amazon */}
            <div className="bg-[#f5f5f5] min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* LEFT Sidebar - filters (bigger, sticky) */}
                    <aside className="lg:col-span-1 bg-white rounded-lg p-4 shadow-sm h-max sticky top-20">
                        <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>

                        {/* Categories (show 3 by default) */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Danh mục</h3>
                            <div className="max-h-48 overflow-auto text-sm">
                                {categoryOptions.length === 0 && <div className="text-sm text-gray-500">Không có danh mục</div>}
                                {categoryOptions.slice(0, showMoreCategories ? categoryOptions.length : 3).map(cat => (
                                    <label key={cat.id} className="flex items-center gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="h-4 w-4"
                                        />
                                        <span>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                            {categoryOptions.length > 3 && (
                                <button className="text-sm text-blue-600 mt-2" onClick={() => setShowMoreCategories(v => !v)}>
                                    {showMoreCategories ? 'Thu gọn' : 'Xem thêm'}
                                </button>
                            )}
                        </div>

                        {/* Brands (show 3 by default) */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Thương hiệu</h3>
                            <div className="max-h-48 overflow-auto text-sm">
                                {brandOptions.length === 0 && <div className="text-sm text-gray-500">Không có thương hiệu</div>}
                                {brandOptions.slice(0, showMoreBrands ? brandOptions.length : 3).map(b => (
                                    <label key={b.id} className="flex items-center gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(b.id)}
                                            onChange={() => toggleBrand(b.id)}
                                            className="h-4 w-4"
                                        />
                                        <span>{b.name}</span>
                                    </label>
                                ))}
                            </div>
                            {brandOptions.length > 3 && (
                                <button className="text-sm text-blue-600 mt-2" onClick={() => setShowMoreBrands(v => !v)}>
                                    {showMoreBrands ? 'Thu gọn' : 'Xem thêm'}
                                </button>
                            )}
                        </div>

                        {/* Price range */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Giá</h3>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Từ"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-1/2 border p-2 rounded text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Đến"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-1/2 border p-2 rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Sellers */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Người bán</h3>
                            <div className="max-h-40 overflow-auto text-sm">
                                {sellerOptions.map(s => (
                                    <label key={s.id} className="flex items-center gap-2 py-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedSellers.includes(String(s.id))}
                                            onChange={() => toggleSeller(String(s.id))}
                                            className="h-4 w-4"
                                        />
                                        <span>{s.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear filters */}
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBrands([]);
                                    setSelectedConditions([]);
                                    setSelectedSellers([]);
                                    setSelectedCategories([]);
                                    setMinPrice('');
                                    setMaxPrice('');
                                }}
                                className="text-sm text-red-600"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </aside>

                    {/* Products grid */}
                    <main className="lg:col-span-4">
                        <h1 className="text-3xl font-bold mb-6 text-[#0AC1EF] text-center lg:text-left">Danh sách sản phẩm</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6">
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full text-center text-gray-500">Không có sản phẩm phù hợp.</div>
                            )}
                            {filteredProducts.map(product => (
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
                    </main>
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
