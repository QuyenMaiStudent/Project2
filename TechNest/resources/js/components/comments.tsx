import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface CommentType {
    id: number;
    content: string;
    user: { id: number; name: string; email?: string };
    created_at: string;
    status: 'published' | 'pinned' | 'hidden';
    replies?: CommentType[];
    likes_count?: number;
}

interface Props { productId: number; }

export default function Comments({ productId }: Props) {
    const props = usePage<SharedData>().props;
    const { auth } = props;

    const isAdmin = auth.user?.email === 'admin@example.com';

    const [comments, setComments] = useState<CommentType[]>([]);
    const [content, setContent] = useState('');
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [editingContent, setEditingContent] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/products/${productId}/comments`);
            const data: CommentType[] = await res.json();

            let filtered: CommentType[];
            if (isAdmin) {
                filtered = data;
            } else {
                filtered = data.filter(c => c.status === 'published');
            }

            filtered.sort((a, b) => {
                if (a.status === 'pinned' && b.status !== 'pinned') return -1;
                if (b.status === 'pinned' && a.status !== 'pinned') return 1;
                return 0;
            });

            setComments(filtered);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchComments(); }, []);

    const handleSend = async () => {
        if (!auth.user) { alert('Bạn cần đăng nhập để bình luận'); return; }
        if (!content.trim()) return;

        setLoading(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/products/${productId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
                body: JSON.stringify({ content }),
            });
            if (!res.ok) throw new Error('Gửi bình luận thất bại');
            await fetchComments();
            setContent('');
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleReplySend = async (parentId: number) => {
        const reply = replyContent[parentId];
        if (!auth.user) { alert('Bạn cần đăng nhập để trả lời'); return; }
        if (!reply?.trim()) return;

        setLoading(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/products/${productId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
                body: JSON.stringify({ content: reply, parent_id: parentId }),
            });
            if (!res.ok) throw new Error('Gửi trả lời thất bại');
            await fetchComments();
            setReplyContent(prev => ({ ...prev, [parentId]: '' }));
            setReplyingTo(null);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleEditSend = async (id: number) => {
        const newContent = editingContent[id];
        if (!auth.user) { alert('Bạn cần đăng nhập'); return; }
        if (!newContent?.trim()) return;

        setLoading(true);
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch(`/products/comments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
                body: JSON.stringify({ content: newContent }),
            });
            if (!res.ok) throw new Error('Cập nhật thất bại');
            await fetchComments();
            setEditingId(null);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleLike = async (id: number) => {
        if (!auth.user) { alert('Bạn cần đăng nhập để thích bình luận'); return; }
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch(`/products/comments/${id}/like`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
            });
            await fetchComments();
        } catch (err) { console.error(err); }
    };

    const handleReport = async (id: number) => {
        if (!auth.user) { alert('Bạn cần đăng nhập để báo cáo bình luận'); return; }
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch(`/products/comments/${id}/report`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
            });
            await fetchComments();
        } catch (err) { console.error(err); }
    };

    const handlePin = async (id: number) => {
        if (!isAdmin) return;
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch(`/products/comments/${id}/pin`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
            });
            await fetchComments();
        } catch (err) { console.error(err); }
    };

    const handleHide = async (id: number) => {
        if (!isAdmin) return;
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch(`/products/comments/${id}/hide`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token || '' },
                credentials: 'same-origin',
            });
            await fetchComments();
        } catch (err) { console.error(err); }
    };

    const renderReplies = (replies: CommentType[] | undefined, level = 1) => {
        if (!replies) return null;
        return (
            <div className={`ml-${level * 6} mt-2`}>
                {replies.map(reply => (
                    <div key={reply.id} className="border-l pl-2 mb-2">
                        <div className="text-sm font-semibold text-black">{reply.user?.name || 'Người dùng'}</div>
                        <div className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</div>
                        {isAdmin && <div className="text-xs italic text-purple-600">{reply.status.toUpperCase()}</div>}
                        <div className="text-gray-700">{reply.content}</div>
                        {auth.user && (
                            <div className="mt-1 flex gap-2 text-xs text-blue-600 items-center">
                                <button onClick={() => handleLike(reply.id)}>Thích</button>
                                <span>{reply.likes_count || 0} lượt thích</span>
                                <button onClick={() => handleReport(reply.id)}>Báo cáo</button>
                                <button onClick={() => setReplyingTo(reply.id === replyingTo ? null : reply.id)}>Trả lời</button>
                                {auth.user.id === reply.user.id && <button onClick={() => setEditingId(reply.id)} className="text-green-600">Sửa</button>}
                                {isAdmin && (
                                    <>
                                        <button onClick={() => handlePin(reply.id)} className="text-purple-600">Ghim</button>
                                        <button onClick={() => handleHide(reply.id)} className="text-red-600">Ẩn</button>
                                    </>
                                )}
                            </div>
                        )}
                        {replyingTo === reply.id && auth.user && (
                            <div className="mt-2">
                                <textarea
                                    value={replyContent[reply.id] || ''}
                                    onChange={e => setReplyContent(prev => ({ ...prev, [reply.id]: e.target.value }))}
                                    className="w-full border rounded p-2"
                                    rows={2}
                                />
                                <button onClick={() => handleReplySend(reply.id)} className="mt-1 px-3 py-1 bg-blue-500 text-white rounded text-xs">Gửi</button>
                            </div>
                        )}
                        {renderReplies(reply.replies, level + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="mt-6">
            <h2 className="font-bold text-lg mb-2">Bình luận</h2>
            {auth.user && (
                <div className="mb-4">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="Viết bình luận..."
                        rows={3}
                    />
                    <button onClick={handleSend} disabled={loading} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                        {loading ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </div>
            )}
            <div>
                {comments.map(c => (
                    <div key={c.id} className="mb-4 border-b pb-2">
                        <div className="text-sm font-semibold text-black">{c.user?.name || 'Người dùng'}</div>
                        <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
                        {isAdmin && <div className="text-xs italic text-purple-600">{c.status.toUpperCase()}</div>}
                        <div className="text-gray-700">{c.content}</div>
                        {auth.user && (
                            <div className="mt-1 flex gap-2 text-xs text-blue-600 items-center">
                                <button onClick={() => handleLike(c.id)}>Thích</button>
                                <span>{c.likes_count || 0} lượt thích</span>
                                <button onClick={() => handleReport(c.id)}>Báo cáo</button>
                                <button onClick={() => setReplyingTo(c.id === replyingTo ? null : c.id)}>Trả lời</button>
                                {auth.user.id === c.user.id && <button onClick={() => setEditingId(c.id)} className="text-green-600">Sửa</button>}
                                {isAdmin && (
                                    <>
                                        <button onClick={() => handlePin(c.id)} className="text-purple-600">Ghim</button>
                                        <button onClick={() => handleHide(c.id)} className="text-red-600">Ẩn</button>
                                    </>
                                )}
                            </div>
                        )}
                        {replyingTo === c.id && auth.user && (
                            <div className="mt-2">
                                <textarea
                                    value={replyContent[c.id] || ''}
                                    onChange={e => setReplyContent(prev => ({ ...prev, [c.id]: e.target.value }))}
                                    className="w-full border rounded p-2"
                                    rows={2}
                                />
                                <button onClick={() => handleReplySend(c.id)} className="mt-1 px-3 py-1 bg-blue-500 text-white rounded text-xs">Gửi</button>
                            </div>
                        )}
                        {renderReplies(c.replies)}
                    </div>
                ))}
            </div>
        </div>
    );
}
