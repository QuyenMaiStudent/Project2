import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Package, Eye, Edit, Trash2, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Giao diện người bán',
        href: '/seller/dashboard',
    },
    {
        title: 'Xem sản phẩm',
        href: '/seller/products',
    },
];

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    is_active: boolean;
    status: string; // draft, approved, rejected
    brand: {
        name: string;
    };
    primary_image?: {
        url: string;
        alt_text: string;
    };
    seller: {
        name: string;
    };
}

interface Props {
    products: {
        data: Product[];
        links: any[];
        meta: any;
    };
}

function Pagination({ links }: { links: any[] }) {
    return (
        <nav className="flex gap-2">
            {links.map((link, idx) => (
                link.url ? (
                    <Link
                        key={idx}
                        href={link.url}
                        className={`px-3 py-1 rounded transition-colors ${link.active ? 'bg-[#0AC1EF] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={idx}
                        className="px-3 py-1 rounded bg-gray-100 text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </nav>
    );
}

export default function ViewProduct({ products }: Props) {
    const [localProducts, setLocalProducts] = useState(products.data);
    const [loadingToggle, setLoadingToggle] = useState<number | null>(null);
    const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
    const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

    // auto-dismiss notice after 4s
    useEffect(() => {
        if (!notice) return;
        const t = setTimeout(() => setNotice(null), 4000);
        return () => clearTimeout(t);
    }, [notice]);

    // Kiểm tra sản phẩm có trong giỏ hàng trước khi edit
    const handleEditClick = async (product: Product) => {
        try {
            const response = await fetch(`/seller/products/${product.id}/check-cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.has_cart_items) {
                setSelectedProductForEdit(product);
                setShowEditConfirmModal(true);
            } else {
                // Chuyển đến trang edit
                router.visit(`/seller/products/${product.id}/edit`);
            }
        } catch (error) {
            console.error('Error checking cart items:', error);
            // Nếu lỗi, vẫn cho phép edit
            router.visit(`/seller/products/${product.id}/edit`);
        }
    };

    const confirmEdit = async () => {
        if (!selectedProductForEdit) return;

        try {
            // Xóa cart items trước khi chuyển đến edit
            const response = await fetch(`/seller/products/${selectedProductForEdit.id}/clear-cart-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                setNotice({ type: 'success', message: 'Đã xóa sản phẩm khỏi giỏ hàng của khách hàng.' });
                setShowEditConfirmModal(false);
                setSelectedProductForEdit(null);
                // Chuyển đến trang edit
                router.visit(`/seller/products/${selectedProductForEdit.id}/edit`);
            } else {
                setNotice({ type: 'error', message: data.message || 'Có lỗi xảy ra' });
            }
        } catch (error) {
            console.error('Error clearing cart items:', error);
            setNotice({ type: 'error', message: 'Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng' });
        }
    };

    const cancelEdit = () => {
        setShowEditConfirmModal(false);
        setSelectedProductForEdit(null);
    };

    const handleToggleVisibility = async (productId: number) => {
        setLoadingToggle(productId);
        
        try {
            const response = await fetch(`/seller/products/${productId}/toggle-visibility`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();

            if (data.success) {
                // Cập nhật state local
                setLocalProducts(prev => 
                    prev.map(product => 
                        product.id === productId 
                            ? { ...product, is_active: data.is_active }
                            : product
                    )
                );
                
                // Hiển thị thông báo bằng giao diện
                setNotice({ type: 'success', message: data.message || 'Cập nhật trạng thái thành công.' });
            } else {
                setNotice({ type: 'error', message: data.message || 'Có lỗi xảy ra' });
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
            setNotice({ type: 'error', message: 'Có lỗi xảy ra khi thay đổi trạng thái sản phẩm' });
        } finally {
            setLoadingToggle(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Xem sản phẩm" />
            <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0AC1EF]">
                    <h1 className="text-2xl font-semibold text-gray-800">Sản phẩm của tôi</h1>
                    <Link
                        href="/seller/products/create"
                        className="px-4 py-2 bg-[#0AC1EF] text-white rounded-md hover:bg-[#09b3db] transition-colors flex items-center space-x-2"
                    >
                        <Package className="h-4 w-4" />
                        <span>Thêm sản phẩm</span>
                    </Link>
                </div>

                {/* Inline notification */}
                {notice && (
                    <div className={`mb-4 rounded p-3 text-sm ${
                        notice.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                        notice.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                        'bg-blue-50 border border-blue-200 text-blue-800'
                    }`}>
                        <div className="flex justify-between items-start">
                            <div>{notice.message}</div>
                            <button onClick={() => setNotice(null)} className="ml-4 text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                    </div>
                )}

                {localProducts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
                        <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn</p>
                        <Link
                            href="/seller/products/create"
                            className="px-4 py-2 bg-[#0AC1EF] text-white rounded-md hover:bg-[#09b3db] transition-colors"
                        >
                            Thêm sản phẩm đầu tiên
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {localProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
                                <div className="relative">
                                    <div className="aspect-w-16 aspect-h-9">
                                        {product.primary_image ? (
                                            <img
                                                src={product.primary_image.url || '/images/no-image.png'}
                                                alt={product.primary_image.alt_text || product.name}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/no-image.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <div className="text-center text-gray-400">
                                                    <Package className="h-12 w-12 mx-auto mb-2" />
                                                    <p className="text-sm">Chưa có ảnh</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Status badges - Updated positioning */}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        {/* Visibility toggle button for approved products */}
                                        {product.status === 'approved' && (
                                            <button
                                                onClick={() => handleToggleVisibility(product.id)}
                                                disabled={loadingToggle === product.id}
                                                className={`p-1.5 rounded-full transition-all duration-200 ${
                                                    product.is_active
                                                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                                                        : 'bg-gray-500 hover:bg-gray-600 text-white shadow-md'
                                                } ${loadingToggle === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                title={product.is_active ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                                            >
                                                {loadingToggle === product.id ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : product.is_active ? (
                                                    <Eye className="h-4 w-4" />
                                                ) : (
                                                    <EyeOff className="h-4 w-4" />
                                                )}
                                            </button>
                                        )}

                                        {/* Status badge */}
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            product.status === 'approved'
                                                ? product.is_active 
                                                    ? 'bg-green-100 text-green-800 shadow-sm' 
                                                    : 'bg-yellow-100 text-yellow-800 shadow-sm'
                                                : product.status === 'draft'
                                                ? 'bg-gray-100 text-gray-800 shadow-sm'
                                                : 'bg-red-100 text-red-800 shadow-sm'
                                        }`}>
                                            {product.status === 'approved'
                                                ? product.is_active ? 'Đang bán' : 'Đã ẩn'
                                                : product.status === 'draft'
                                                ? 'Bản nháp'
                                                : 'Bị từ chối'
                                            }
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate mb-2" title={product.name}>
                                        {product.name}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-600 mb-3">
                                        Thương hiệu: <span className="font-medium">{product.brand?.name || 'Chưa rõ'}</span>
                                    </p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold text-[#0AC1EF]">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(Number(product.price))}
                                        </span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${
                                            product.stock > 0 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-red-50 text-red-700'
                                        }`}>
                                            Kho: {product.stock}
                                        </span>
                                    </div>
                                    
                                    {/* Action buttons */}
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/seller/products/${product.id}/preview`}
                                                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Xem trước</span>
                                            </Link>
                                            
                                            {/* Thay Link bằng button để kiểm tra cart */}
                                            <button
                                                onClick={() => handleEditClick(product)}
                                                className="flex-1 px-3 py-2 bg-[#E6F9FF] text-[#0AC1EF] rounded-md hover:bg-[#dff6fb] transition-colors inline-flex items-center justify-center gap-2"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span>Sửa</span>
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href={`/seller/products/${product.id}/specs`}
                                                className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors text-center text-sm"
                                            >
                                                Thông số
                                            </Link>
                                            <Link
                                                href={`/seller/products/${product.id}/variants`}
                                                className="px-3 py-2 bg-[#E6F9FF] text-[#0AC1EF] rounded-md hover:bg-[#dff6fb] transition-colors inline-flex items-center justify-center gap-1 text-sm"
                                            >
                                                <Package className="h-3 w-3" />
                                                <span>Biến thể</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {localProducts.length > 0 && (
                    <div className="mt-8 flex justify-center bg-white p-4 rounded-lg shadow-md">
                        <Pagination links={products.links} />
                    </div>
                )}

                {/* Modal xác nhận edit */}
                {showEditConfirmModal && selectedProductForEdit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-t-4 border-[#0AC1EF]">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận chỉnh sửa</h2>
                            <p className="mb-4 text-gray-700">
                                Sản phẩm "{selectedProductForEdit.name}" hiện tại có trong giỏ hàng của một số khách hàng. 
                                Nếu tiếp tục thao tác này sẽ xóa sản phẩm khỏi giỏ hàng của khách hàng. 
                                Bạn có chắc muốn tiếp tục?
                            </p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={cancelEdit}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmEdit}
                                    className="bg-[#0AC1EF] text-white px-4 py-2 rounded hover:bg-[#09b3db] transition-colors"
                                >
                                    Tiếp tục
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}