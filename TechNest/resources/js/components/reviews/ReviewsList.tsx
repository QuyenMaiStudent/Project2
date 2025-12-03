import React, { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
    id: number;
    user_name?: string;
    rating: number;
    content?: string;
    created_at?: string;
    // ...other fields from backend
}

interface Props {
    productId: number;
}

export default function ReviewsList({ productId }: Props) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/products/${productId}/reviews`, { headers: { Accept: 'application/json' } });
            if (!res.ok) {
                setReviews([]);
            } else {
                const data = await res.json();
                setReviews(Array.isArray(data) ? data : (data.comments || []));
            }
        } catch (e) {
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        load();
        const handler = () => {
            load();
        };
        window.addEventListener('review:added', handler);
        return () => window.removeEventListener('review:added', handler);
    }, [load]);

    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : 0;
    const starsDisplay = (value: number) => {
        const full = Math.floor(value);
        const arr = [];
        for (let i = 1; i <= 5; i++) {
            arr.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${i <= full ? 'text-[#0AC1EF]' : 'text-gray-300'}`}
                    fill={i <= full ? '#0AC1EF' : 'none'}
                />
            );
        }
        return <div className="flex items-center gap-1">{arr}</div>;
    };

    if (loading) return <div className="text-sm text-gray-500">Đang tải đánh giá...</div>;
    if (reviews.length === 0) return <div className="text-sm text-gray-500">Chưa có đánh giá nào.</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Đánh giá</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-extrabold text-[#0AC1EF]">{avgRating.toFixed(1)}</div>
                            <div className="text-sm text-gray-500"> / 5</div>
                        </div>
                        <div>{starsDisplay(Math.round(avgRating))}</div>
                        <div className="text-sm text-gray-500">({reviews.length} đánh giá)</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {reviews.map(r => (
                    <div key={r.id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#e8fbff] flex items-center justify-center text-sm font-semibold text-[#0AC1EF]">
                                    { (r.user_name || 'K').charAt(0).toUpperCase() }
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium text-gray-800">{r.user_name || 'Khách'}</div>
                                        <div className="text-xs text-gray-400">{r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : ''}</div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < r.rating ? 'text-yellow-300' : 'text-gray-200'}`}
                                                    fill={i < r.rating ? '#0AC1EF' : 'none'}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-500 ml-2">{r.rating} sao</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {r.content && (
                            <div className="mt-3 text-gray-700 whitespace-pre-line">{r.content}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}