import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface Props {
    productId: number;
    onSaved?: (review: any) => void;
    onCancel?: () => void;
}

export default function ReviewForm({ productId, onSaved, onCancel }: Props) {
    const [rating, setRating] = useState<number>(5);
    const [hover, setHover] = useState<number | null>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const submit = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/customer/reviews', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrf(),
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ product_id: productId, rating, content }),
            });

            const json = await res.json().catch(() => ({ success: false, message: 'Lỗi JSON' }));
            if (!res.ok || json.success === false) {
                setError(json.message || 'Có lỗi xảy ra');
            } else {
                onSaved && onSaved(json.review);
                try {
                    window.dispatchEvent(new CustomEvent('review:added', { detail: json.review }));
                } catch (e) { /* ignore */ }
                setContent('');
                setRating(5);
            }
        } catch (e) {
            setError('Không thể kết nối tới server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-gray-800">Đánh giá sản phẩm</div>
                <div className="text-sm text-gray-500">Chia sẻ trải nghiệm của bạn</div>
            </div>

            <div className="mb-3">
                <label className="block text-sm mb-2">Số sao</label>
                <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const idx = i + 1;
                        const active = hover !== null ? idx <= hover : idx <= rating;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setRating(idx)}
                                onMouseEnter={() => setHover(idx)}
                                onMouseLeave={() => setHover(null)}
                                aria-label={`${idx} sao`}
                                className="p-1"
                            >
                                <Star className={`w-6 h-6 ${active ? 'text-[#0AC1EF]' : 'text-gray-200'}`} fill={active ? '#0AC1EF' : 'none'} />
                            </button>
                        );
                    })}
                    <div className="text-sm text-gray-600 ml-2">{rating} / 5</div>
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-sm mb-2">Nội dung</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0AC1EF]/40 text-sm resize-none"
                    placeholder="Viết nhận xét hữu ích cho người mua khác..."
                />
            </div>

            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

            <div className="flex gap-2">
                <button
                    onClick={submit}
                    disabled={loading}
                    className="px-4 py-2 bg-[#0AC1EF] text-white rounded-md text-sm font-medium disabled:opacity-60"
                >
                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
                <button
                    onClick={() => onCancel && onCancel()}
                    className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50"
                >
                    Hủy
                </button>
            </div>
        </div>
    );
}
