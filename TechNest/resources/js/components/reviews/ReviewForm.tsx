import React, { useState } from 'react';

interface Props {
    productId: number;
    onSaved?: (review: any) => void;
    onCancel?: () => void;
}

export default function ReviewForm({ productId, onSaved, onCancel }: Props) {
    const [rating, setRating] = useState<number>(5);
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
                // phát event để ProductDetail / CommentsSection có thể cập nhật ngay
                try {
                    window.dispatchEvent(new CustomEvent('review:added', { detail: json.review }));
                } catch (e) { /* ignore */ }
            }
        } catch (e) {
            setError('Không thể kết nối tới server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded p-4 bg-white">
            <div className="mb-2 font-semibold">Đánh giá sản phẩm</div>

            <div className="mb-2">
                <label className="block text-sm">Số sao</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded p-2">
                    {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} sao</option>)}
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-sm">Nội dung</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full border rounded p-2" />
            </div>

            {error && <div className="text-red-600 mb-2">{error}</div>}

            <div className="flex gap-2">
                <button onClick={submit} disabled={loading} className="px-4 py-2 bg-[#ee4d2d] text-white rounded">
                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
                <button onClick={() => onCancel && onCancel()} className="px-4 py-2 border rounded">Hủy</button>
            </div>
        </div>
    );
}
