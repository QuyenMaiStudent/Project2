import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useMemo, useState, useEffect } from 'react';
import CartIcon from '@/components/Cart/CartIcon';
import PublicLayout from '@/layouts/public-layout';

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
    filters?: { search?: string };
}

export default function ProductIndex({ products, brands, categories, filters }: Props) {
    const props = usePage<SharedData>().props;
    const { auth } = props;
    const cartCount: number = (props.cartCount ?? 0) as number;
    const isCustomer: boolean = (props.isCustomer ?? false) as boolean;

    // Lấy search query từ props.filters (được Header gửi ?search=...)
    const searchQuery = filters?.search ? String(filters.search).trim() : '';

    const [showNoResult, setShowNoResult] = useState(false);

    useEffect(() => {
        // Nếu có searchQuery và kết quả filtered rỗng -> show popup
        if (searchQuery && products.length === 0) {
            setShowNoResult(true);
            const timer = setTimeout(() => setShowNoResult(false), 3000);
            return () => clearTimeout(timer);
        }
        // nếu không có searchQuery thì ẩn popup
        if (!searchQuery) {
            setShowNoResult(false);
        }
    }, [products, searchQuery]);

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

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Lọc theo searchQuery (tên sản phẩm) nếu có
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

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
    }, [products, searchQuery, selectedBrands, selectedCategories, minPrice, maxPrice, selectedSellers, selectedConditions]);

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
        <PublicLayout>
            <Head title="Sản phẩm" />

            {showNoResult && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50">
                    Không có sản phẩm trùng khớp
                </div>
            )}

            <div className="bg-[#f5f5f5] min-h-screen py-8">
                <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <aside className="lg:col-span-1 bg-white rounded-lg p-4 shadow-sm h-max sticky top-20 ml-0 lg:ml-6">
                        <h2 className="text-lg font-semibold mb-3">Bộ lọc</h2>

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

                    <div className="lg:col-span-4">
                        <div className="max-w-7xl mx-auto px-6">
                            <h1 className="text-3xl font-bold mb-6 text-[#0AC1EF] text-center lg:text-left">Danh sách sản phẩm</h1>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filteredProducts.length === 0 && (
                                    <div className="col-span-full text-center text-gray-500">Không có sản phẩm phù hợp.</div>
                                )}
                                {filteredProducts.map(product => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col border border-gray-100 group overflow-hidden"
                                    >
                                        <Link href={`/products/${product.id}`}>
                                            <div className="bg-gray-50 flex items-center justify-center rounded-t-lg overflow-hidden h-40">
                                                <img
                                                    src={product.primary_image?.url || '/images/logo.png'}
                                                    alt={product.name}
                                                    className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                                                    loading="lazy"
                                                    onError={e => (e.currentTarget.src = '/images/logo.png')}
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex-1 flex flex-col px-2 py-2 text-sm">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="font-semibold text-sm text-gray-900 hover:text-[#0AC1EF] line-clamp-2 min-h-[44px]"
                                            >
                                                {product.name}
                                            </Link>
                                            {product.brand && (
                                                <div className="text-xs text-gray-500 mt-1">{product.brand.name}</div>
                                            )}
                                            <div className="mt-2 font-bold text-base text-[#ee4d2d]">
                                                {product.price != null
                                                    ? Number(product.price).toLocaleString() + '₫'
                                                    : 'Liên hệ'}
                                            </div>
                                            {product.short_description && (
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{product.short_description}</div>
                                            )}
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="mt-3 mb-1 px-2 py-1 bg-[#0AC1EF] text-white rounded text-sm text-center hover:bg-[#0999c2] transition-colors"
                                            >
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
