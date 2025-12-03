import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { type SharedData } from '@/types';
import CartIcon from '@/components/Cart/CartIcon';
import PublicLayout from '@/layouts/public-layout';
import CommentsSection from '@/components/comments/CommentsSection';
import ReviewsList from '@/components/reviews/ReviewsList';
import { MessageCircle, ChevronRight } from 'lucide-react';
import ReviewForm from '@/components/reviews/ReviewForm';

interface Image { url: string; alt_text?: string; is_primary?: boolean; }
interface Variant { id: number; variant_name: string; price: number; stock: number; image_url?: string | null; }
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
    created_by: number; // seller id
}

interface Props { product: Product; }

export default function ProductDetail({ product }: Props) {
    const props = usePage<SharedData>().props;
    const { auth } = props;
    // cartCount và isCustomer được CartIcon lấy từ shared props, không cần quản lý ở đây

    // Khởi tạo biến thể được chọn (nếu có)
    const initialVariant: Variant | null = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariant);
    // Ảnh chính ban đầu: ưu tiên ảnh của biến thể nếu có, ngược lại dùng ảnh đầu tiên của product
    const initialMain = selectedVariant?.image_url ?? (product.images && product.images.length > 0 ? product.images[0].url : '/images/logo.png');
    const [mainImg, setMainImg] = useState<string>(initialMain);
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [canReview, setCanReview] = useState<{ eligible: boolean; message?: string } | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // nếu URL có ?openReview=1 thì đặt flag để tự động mở form khi eligibility xác nhận
    const [openReviewRequested, setOpenReviewRequested] = useState(false);

    React.useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('openReview') === '1') {
                setOpenReviewRequested(true);
            }
        } catch (e) {
            // ignore
        }
    }, []);

    // Khi eligibility được kiểm tra và user đã yêu cầu mở form, xử lý:
    React.useEffect(() => {
        if (!openReviewRequested) return;

        // nếu chưa login, chuyển tới login
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        if (canReview && canReview.eligible) {
            setShowReviewForm(true);
            // xóa param để tránh mở lại khi reload
            try {
                const url = new URL(window.location.href);
                url.searchParams.delete('openReview');
                window.history.replaceState({}, '', url.toString());
            } catch (e) { /* ignore */ }
            setOpenReviewRequested(false);
        } else if (canReview && !canReview.eligible) {
            // cuộn tới phần comments để hiển thị thông báo eligibility
            const el = document.querySelector('[data-comments-section]');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            setOpenReviewRequested(false);
        }
    }, [openReviewRequested, canReview, auth.user]);

    const price = selectedVariant ? selectedVariant.price : product.price;
    const maxStock = selectedVariant ? selectedVariant.stock : product.stock;

    // Khi người dùng chọn biến thể, cập nhật ảnh chính nếu biến thể có ảnh
    React.useEffect(() => {
        if (selectedVariant) {
            if (selectedVariant.image_url) {
                setMainImg(selectedVariant.image_url);
                return;
            }
        }
        // Nếu không có thì fallback về ảnh đầu tiên của sản phẩm (hoặc ảnh mặc định)
        setMainImg(product.images && product.images.length > 0 ? product.images[0].url : '/images/logo.png');
    }, [selectedVariant, product.images]);

    // Kiểm tra eligibility khi user đã login
    React.useEffect(() => {
        if (!auth.user) {
            setCanReview(null);
            return;
        }
        let mounted = true;
        (async () => {
            try {
                const res = await fetch(`/customer/reviews/can-review/${product.id}`, {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' },
                });
                const json = await res.json();
                if (!mounted) return;
                setCanReview({ eligible: !!json.eligible, message: json.message });
            } catch (e) {
                // ignore
                setCanReview({ eligible: false, message: 'Không thể kiểm tra quyền đánh giá.' });
            }
        })();
        return () => { mounted = false; };
    }, [auth.user, product.id]);

    // Hàm hiển thị toast
    const showToast = (type: 'success' | 'error', message: string, ms = 3000) => {
        setToast({ type, message });
        window.setTimeout(() => setToast(null), ms);
    };

    const handleAddToCart = async () => {
        if (!auth.user) {
            showToast('error', 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
            router.visit('/login');
            return;
        }

        try {
            const getCookie = (name: string) => {
                const v = `; ${document.cookie}`;
                const parts = v.split(`; ${name}=`);

                if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
                return '';
            };
            const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const xsrfCookie = getCookie('XSRF-TOKEN') || '';

            const res = await fetch('/cart/add', {
                method: 'POST',
                // sử dụng 'include' nếu backend khác origin; dùng 'same-origin' nếu cùng origin
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(metaToken ? { 'X-CSRF-TOKEN': metaToken } : {}),
                    ...(xsrfCookie ? { 'X-XSRF-TOKEN': xsrfCookie } : {}),
                },
                body: JSON.stringify({
                    product_id: product.id,
                    product_variant_id: selectedVariant ? selectedVariant.id : null,
                    quantity,
                }),
            });

            if (res.status === 401) {
                showToast('error', 'Bạn cần đăng nhập.');
                router.visit('/login');
                return;
            }

            if (res.status === 419) {
                showToast('error', 'CSRF token mismatch (419). Kiểm tra cookie/session và meta csrf-token.');
                return;
            }

            const data = await res.json().catch(() => ({ success: false, message: 'Có lỗi xảy ra!' }));

            if (!res.ok || data.success === false) {
                showToast('error', data.message || 'Có lỗi xảy ra!');
                return;
            }

            // Hiển thị thông báo thành công, phát sự kiện để cập nhật CartIcon ngay lập tức,
            // rồi reload một phần (chỉ cartCount) để đồng bộ shared props của Inertia
            showToast('success', 'Đã thêm vào giỏ hàng!');
            window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cartCount: data.cartCount } }));
            router.reload({ only: ['cartCount'] });
        } catch (e) {
            showToast('error', 'Không thể kết nối tới server.');
        }
    };

    const startChat = async () => {
        if (!auth.user) {
            showToast('error', 'Bạn cần đăng nhập để liên hệ người bán!');
            router.visit('/login');
            return;
        }

        //Kiểm tra nếu người dùng là người bán
        if (auth.user.id === product.created_by) {
            showToast('error', "Bạn không thể liên hệ với chính mình!");
            return;
        }

        const message = 'Xin chào, tôi quan tâm đến sản phẩm này.';

        try {
            const response = await fetch('/chat/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    product_id: product.id,
                    message: message
                })
            });

            if (response.ok) {
                const data = await response.json();
                router.visit(`/chat/${data.conversation_id}`);
            } else {
                const errorData = await response.json();
                showToast('error', errorData.message || 'Có lỗi xảy ra khi tạo cuộc hội thoại này.');
            }
        } catch (error) {
            console.error('Error starting chat:', error);
            showToast('error', 'Không thể kết nối tới server.');
        }
    };

    return (
        <PublicLayout>
            <Head title={product.name} />

            {/* Breadcrumbs */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3 text-sm text-gray-600">
                    <Link href="/" className="hover:underline text-gray-500">Trang chủ</Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <Link href="/products" className="hover:underline text-[#0AC1EF] font-medium">Sản phẩm</Link>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 truncate max-w-[50%]">{product.name}</span>
                </div>
            </div>

            {/* toast UI */}
            {toast && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div
                        className={`w-full max-w-lg mx-4 transform transition-all duration-200 pointer-events-auto rounded-xl shadow-2xl flex items-start gap-4 p-4 ${toast.type === 'success' ? 'border-2 border-green-600 bg-white' : 'border-2 border-red-600 bg-white'}`}
                        role="status"
                        aria-live="polite"
                    >
                        <div className={`flex-shrink-0 rounded-full p-3 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                            {toast.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414-1.414L8 11.172 4.707 7.879a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 102 0V7zm-1 7a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-sm font-semibold text-gray-900">{toast.type === 'success' ? 'Thành công' : 'Lỗi'}</div>
                                <button
                                    type="button"
                                    onClick={() => setToast(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                    aria-label="Đóng thông báo"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mt-1 text-sm text-gray-700">
                                {toast.message}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="bg-[#f5f7f8] min-h-screen py-8">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Ảnh sản phẩm */}
                    <div className="md:w-2/5 flex flex-col items-center">
                        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center rounded-lg border mb-4 overflow-hidden">
                            <img src={mainImg} alt={product.name} className="object-contain w-full h-full p-4" />
                        </div>
                        <div className="flex gap-3 mt-2">
                            {(product.images && product.images.length > 0 ? product.images : [{ url: '/images/logo.png', alt_text: 'No image' }]).map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`h-16 w-16 rounded-lg overflow-hidden flex items-center justify-center p-1 transition-shadow ${mainImg === img.url ? 'ring-2 ring-offset-1 ring-[#0AC1EF]' : 'shadow-sm'}`}
                                    onClick={() => setMainImg(img.url)}
                                >
                                    <img
                                        src={img.url}
                                        alt={img.alt_text || product.name}
                                        className="object-contain h-full w-full"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="md:w-3/5 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-extrabold text-gray-900">{product.name}</h1>
                                {product.brand && (
                                    <div className="text-sm text-gray-500 mt-1">Thương hiệu: <span className="font-semibold text-gray-700">{product.brand}</span></div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-[#0AC1EF] text-3xl font-extrabold mb-1">
                                    {price.toLocaleString()}₫
                                </div>
                                <div className="text-sm text-gray-500">Tình trạng: <span className="font-medium text-gray-700">{maxStock > 0 ? `${maxStock} có sẵn` : 'Hết hàng'}</span></div>
                            </div>
                        </div>

                        {/* Variant */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-2">
                                <div className="font-semibold mb-2 text-sm">Phân loại</div>
                                <div className="flex gap-2 flex-wrap">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            type="button"
                                            className={`px-4 py-2 rounded-lg border font-medium transition ${selectedVariant?.id === variant.id ? 'bg-[#0AC1EF] text-white border-[#0AC1EF]' : 'bg-white border-gray-200 text-gray-800 hover:shadow-sm'}`}
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
                                className="w-9 h-9 rounded-lg border border-gray-300 text-lg bg-white"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                            >−</button>
                            <input
                                type="number"
                                min={1}
                                max={maxStock}
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, Math.min(maxStock, Number(e.target.value))))}
                                className="w-16 text-center border rounded-lg py-2"
                            />
                            <button
                                type="button"
                                className="w-9 h-9 rounded-lg border border-gray-300 text-lg bg-white"
                                onClick={() => setQuantity(q => Math.min(maxStock, q + 1))}
                                disabled={quantity >= maxStock}
                            >+</button>
                            <span className="text-sm text-gray-500 ml-2">({maxStock} có sẵn)</span>
                        </div>

                        {/* Nút mua */}
                        <div className="flex gap-4 mt-2">
                            <button
                                className="px-8 py-3 bg-[#0AC1EF] text-white rounded-lg font-bold text-lg hover:bg-[#089fcf] transition-colors shadow"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </button>

                            {auth.user && auth.user.id !== product.created_by ? (
                                <button
                                    onClick={startChat}
                                    className="flex items-center space-x-2 px-6 py-3 border-2 border-[#0AC1EF] text-[#0AC1EF] rounded-lg font-bold text-lg hover:bg-[#e8fbff] transition-colors"
                                >
                                    <MessageCircle className='w-5 h-5' />
                                    <span>Chat với người bán</span>
                                </button>
                            ) : (
                                !auth.user && (
                                    <button
                                        onClick={() => { showToast('error', 'Bạn cần đăng nhập để liên hệ người bán!'); router.visit('/login'); }}
                                        className="flex items-center space-x-2 px-6 py-3 border-2 border-[#0AC1EF] text-[#0AC1EF] rounded-lg font-bold text-lg hover:bg-[#e8fbff] transition-colors"
                                    >
                                        <MessageCircle className='w-5 h-5' />
                                        <span>Chat với người bán</span>
                                    </button>
                                )
                            )}
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
                                <table className="w-full text-left border rounded-lg overflow-hidden">
                                    <tbody>
                                        {product.specs.map((spec, idx) => (
                                            <tr key={idx} className="border-b last:border-b-0">
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

            {/* COMMENTS */}
            <div className='max-w-6xl mx-auto mt-6'>
                <div data-comments-section>
                 {/* Reviews summary & list (hiển thị ngôi sao vàng) */}
                 <ReviewsList productId={product.id} />

                 {/* Nếu được phép đánh giá thì show button/form ở trên comments */}
                 {auth.user && canReview && canReview.eligible && (
                     <div className="mb-4">
                         {!showReviewForm ? (
                             <button
                                 onClick={() => setShowReviewForm(true)}
                                 className="px-4 py-2 bg-[#0AC1EF] text-white rounded-lg font-medium"
                             >
                                 Viết đánh giá cho sản phẩm này
                             </button>
                         ) : (
                             <div className="mt-3">
                                 <ReviewForm
                                     productId={product.id}
                                     onSaved={() => {
                                         setShowReviewForm(false);
                                         // ReviewsList sẽ lắng nghe event 'review:added' và append review
                                     }}
                                     onCancel={() => setShowReviewForm(false)}
                                 />
                             </div>
                         )}
                     </div>
                 )}

                 {/* Nếu không đủ điều kiện, có thể hiển thị message ngắn */}
                 {auth.user && canReview && !canReview.eligible && (
                     <div className="mb-4 text-sm text-gray-500">{canReview.message}</div>
                 )}

                 <CommentsSection productId={product.id} />
                </div>
            </div>
        </PublicLayout>
    );
}
