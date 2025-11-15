import React, { useCallback, useEffect, useState } from 'react';

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
                // assuming backend trả array of comments/reviews
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

    if (loading) return <div>Đang tải đánh giá...</div>;
    if (reviews.length === 0) return <div className="text-sm text-gray-500">Chưa có đánh giá nào.</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Đánh giá ({reviews.length})</h2>
            {reviews.map(r => (
                <div key={r.id} className="border rounded p-3 bg-white">
                    <div className="flex justify-between items-center">
                        <div className="font-medium">{r.user_name || 'Khách'}</div>
                        <div className="text-sm text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</div>
                    </div>
                    <div className="text-yellow-500 mt-2">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <div className="mt-2 text-gray-700 whitespace-pre-line">{r.content}</div>
                </div>
            ))}
        </div>
    );
}