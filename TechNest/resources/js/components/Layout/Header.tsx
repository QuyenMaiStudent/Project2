import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import CartIcon from '@/components/Cart/CartIcon';
import axios from 'axios';

interface SearchProduct {
    id: number;
    name: string;
    price: number;
    brand: string;
    image: string;
    url: string;
    relevant_specs: Array<{ key: string; value: string }>;
}

export default function Header() {
    const props = usePage<SharedData>().props;
    const auth = props.auth;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const performSearch = async (query: string) => {
        setIsSearching(true);
        try {
            const response = await axios.get('/api/products/search', {
                params: { q: query, limit: 5 }
            });
            setSearchResults(response.data.products);
            setShowResults(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <header className="flex w-full items-center justify-between bg-[#0AC1EF] px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center">
                <img src="/images/logo.png" alt="TechNest Logo" className="h-12 w-auto" />
            </Link>

            {/* Thanh tìm kiếm với icon kính lúp */}
            <div className="flex flex-1 justify-center px-8">
                <div className="relative w-full max-w-2xl" ref={searchRef}>
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
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setShowResults(true)}
                        className="w-full rounded-lg border border-gray-300 px-10 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="absolute z-50 mt-2 w-full rounded-lg bg-white shadow-lg">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
                            ) : searchResults.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={product.url}
                                            className="flex items-center gap-4 border-b border-gray-200 p-4 hover:bg-gray-50"
                                            onClick={() => {
                                                setShowResults(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-16 w-16 rounded object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-600">{product.brand}</p>
                                                <p className="text-sm font-bold text-blue-600">
                                                    {formatPrice(product.price)}
                                                </p>
                                                {product.relevant_specs.length > 0 && (
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        {product.relevant_specs.map((spec, idx) => (
                                                            <span key={idx} className="mr-2">
                                                                {spec.key}: {spec.value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    Không tìm thấy sản phẩm nào
                                </div>
                            )}
                        </div>
                    )}
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
    );
}