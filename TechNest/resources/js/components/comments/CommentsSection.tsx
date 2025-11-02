import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

interface User { id: number; name: string | null; }
interface Reply { id: number; user_id: number; user_name: string; content: string; created_at: string; replies?: Reply[]; is_product_seller?: boolean; likes_count?: number; }
interface CommentItem { id: number; user_id: number; user_name: string; content: string; created_at: string; replies: Reply[]; is_product_seller?: boolean; likes_count?: number; }

export default function CommentsSection({ productId }: { productId: number }) {
  const { props } = usePage();
  const auth = (props as any).auth;
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [limit] = useState(3);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // fetchComments accepts explicit offset and append flag
  const fetchComments = async (append = false, useOffset = offset) => {
    setLoading(true);
    try {
      const res = await fetch(`/comments/${productId}?limit=${limit}&offset=${useOffset}`, { 
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      
      if (!res.ok) {
        console.error('Fetch comments failed', res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      setTotal(data.total ?? 0);
      if (append) {
        setComments(prev => [...prev, ...(data.comments || [])]);
      } else {
        setComments(data.comments || []);
      }
    } catch (e) {
      console.error('Error fetching comments:', e);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchComments(offset > 0, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const handleShowMore = () => {
    setOffset(prev => prev + limit);
  };

  const getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!meta) {
      console.warn('CSRF token not found in meta tag');
    }
    return meta || '';
  };

  const postComment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    
    if (!auth?.user) {
      router.visit('/login');
      return;
    }
    
    if (!content.trim()) {
      setError('Nội dung bình luận không được để trống');
      return;
    }

    setSubmitting(true);
    
    try {
      const csrfToken = getCsrfToken();
      console.log('Sending comment with CSRF token:', csrfToken ? 'Present' : 'Missing');
      
      const res = await fetch(`/comments/${productId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify({ 
          content: content.trim(), 
          parent_id: replyTo 
        })
      });

      console.log('Response status:', res.status);
      
      const responseData = await res.json().catch(() => ({ message: 'Lỗi server' }));
      console.log('Response data:', responseData);
      
      if (res.ok) {
        setContent('');
        setReplyTo(null);
        setOffset(0);
        await fetchComments(false, 0);
      } else {
        switch (res.status) {
          case 401:
            setError('Bạn cần đăng nhập để bình luận');
            router.visit('/login');
            break;
          case 419:
            setError('Phiên đăng nhập đã hết hạn. Vui lòng tải lại trang.');
            setTimeout(() => window.location.reload(), 2000);
            break;
          case 422:
            setError(responseData.message || 'Dữ liệu không hợp lệ');
            if (responseData.errors) {
              console.error('Validation errors:', responseData.errors);
            }
            break;
          default:
            setError(responseData.message || 'Có lỗi xảy ra khi gửi bình luận');
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Không thể kết nối tới server. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderReplies = (replies: Reply[] | undefined, depth = 1) => {
    if (!replies || replies.length === 0) return null;
    return (
      <div className="ml-6 mt-2">
        {replies.map(r => (
          <div key={r.id} className="mb-3 p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {r.user_name} {r.is_product_seller && <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Người bán</span>}
              </div>
              <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-sm text-gray-800 whitespace-pre-line">{r.content}</div>
            <div className="mt-2 flex gap-2">
              {auth?.user && <button className="text-xs text-blue-600" onClick={() => { setReplyTo(r.id); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>Trả lời</button>}
            </div>
            {depth < 3 && renderReplies(r.replies || [], depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Bình luận</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={postComment} className="mb-4">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder={auth?.user ? (replyTo ? 'Viết trả lời...' : 'Viết bình luận...') : 'Bạn cần đăng nhập để bình luận'}
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={!auth?.user || submitting}
        />
        <div className="flex gap-2 mt-2">
          <button 
            type="submit" 
            className="px-4 py-2 bg-[#0AC1EF] text-white rounded disabled:opacity-50" 
            disabled={!auth?.user || !content.trim() || submitting}
          >
            {submitting ? 'Đang gửi...' : 'Gửi'}
          </button>
          {replyTo && (
            <button 
              type="button" 
              onClick={() => setReplyTo(null)} 
              className="px-3 py-2 border rounded"
              disabled={submitting}
            >
              Hủy trả lời
            </button>
          )}
        </div>
      </form>

      <div>
        {comments.map(c => (
          <div key={c.id} className="mb-4 p-4 border rounded">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">
                {c.user_name} {c.is_product_seller && <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Người bán</span>}
              </div>
              <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-gray-800 whitespace-pre-line">{c.content}</div>
            <div className="mt-3 flex gap-3">
              {auth?.user && <button className="text-sm text-blue-600" onClick={() => { setReplyTo(c.id); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>Trả lời</button>}
            </div>

            {renderReplies(c.replies)}
          </div>
        ))}
      </div>

      {offset + limit < total && (
        <div className="text-center mt-4">
          <button onClick={handleShowMore} className="px-4 py-2 border rounded" disabled={loading}>
            {loading ? 'Đang tải...' : 'Xem thêm'}
          </button>
        </div>
      )}

      {loading && <div className="mt-2 text-sm text-gray-500">Đang tải...</div>}
    </div>
  );
}