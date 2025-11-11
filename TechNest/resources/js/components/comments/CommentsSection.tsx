import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { ThumbsUp } from 'lucide-react';

interface User { id: number; name: string | null; }
interface Reply { 
  id: number; 
  user_id: number; 
  user_name: string; 
  content: string; 
  created_at: string; 
  replies?: Reply[]; 
  is_product_seller?: boolean; 
  likes_count?: number;
  user?: User;
}
interface CommentItem { 
  id: number; 
  user_id: number; 
  user_name: string; 
  content: string; 
  created_at: string; 
  replies: Reply[]; 
  is_product_seller?: boolean; 
  likes_count?: number;
  user?: User;
}

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
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

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
      const fetchedComments = data.comments || [];
      
      if (append) {
        setComments(prev => [...prev, ...fetchedComments]);
      } else {
        setComments(fetchedComments);
      }

      // Check liked status for all comments if user is logged in
      if (auth?.user && fetchedComments.length > 0) {
        await checkLikedStatus(fetchedComments);
      }
    } catch (e) {
      console.error('Error fetching comments:', e);
    } finally { 
      setLoading(false); 
    }
  };

  const checkLikedStatus = async (commentsToCheck: CommentItem[]) => {
    const allCommentIds: number[] = [];
    
    const extractIds = (items: (CommentItem | Reply)[]) => {
      items.forEach(item => {
        allCommentIds.push(item.id);
        if ('replies' in item && item.replies) {
          extractIds(item.replies);
        }
      });
    };
    
    extractIds(commentsToCheck);
    
    const likedSet = new Set<number>();
    await Promise.all(
      allCommentIds.map(async (id) => {
        try {
          const res = await fetch(`/comments/${id}/check-like`, {
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
          });
          const data = await res.json();
          if (data.liked) {
            likedSet.add(id);
          }
        } catch (e) {
          console.error('Error checking like status:', e);
        }
      })
    );
    
    setLikedComments(likedSet);
  };

  useEffect(() => {
    fetchComments(offset > 0, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const handleShowMore = () => {
    setOffset(prev => prev + limit);
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return '';
  };

  const handleLike = async (commentId: number) => {
    if (!auth?.user) {
      router.visit('/login');
      return;
    }

    try {
      // Lấy CSRF token từ cookie thay vì meta tag
      const xsrfToken = getCookie('XSRF-TOKEN');
      const decodedToken = xsrfToken ? decodeURIComponent(xsrfToken) : '';
      
      const res = await fetch(`/comments/${commentId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodedToken,
        }
      });

      if (res.status === 419) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng tải lại trang.');
        setTimeout(() => window.location.reload(), 2000);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        
        // Update liked status
        setLikedComments(prev => {
          const newSet = new Set(prev);
          if (data.liked) {
            newSet.add(commentId);
          } else {
            newSet.delete(commentId);
          }
          return newSet;
        });

        // Update likes_count in comments
        const updateLikesCount = (items: (CommentItem | Reply)[]): (CommentItem | Reply)[] => {
          return items.map(item => {
            if (item.id === commentId) {
              return { ...item, likes_count: data.likes_count };
            }
            if ('replies' in item && item.replies) {
              return { ...item, replies: updateLikesCount(item.replies) as Reply[] };
            }
            return item;
          });
        };

        setComments(prev => updateLikesCount(prev) as CommentItem[]);
      } else {
        console.error('Error liking comment:', res.status);
        setError('Có lỗi xảy ra khi thích bình luận');
      }
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Không thể kết nối tới server');
    }
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
      // Lấy CSRF token từ cookie
      const xsrfToken = getCookie('XSRF-TOKEN');
      const decodedToken = xsrfToken ? decodeURIComponent(xsrfToken) : '';
      
      const res = await fetch(`/comments/${productId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-XSRF-TOKEN': decodedToken,
        },
        body: JSON.stringify({ 
          content: content.trim(), 
          parent_id: replyTo 
        })
      });
      
      const responseData = await res.json().catch(() => ({ message: 'Lỗi server' }));
      
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
                {r.user_name || r.user?.name || 'Người dùng ẩn'} 
                {r.is_product_seller && <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Người bán</span>}
              </div>
              <div className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString('vi-VN')}</div>
            </div>
            <div className="mt-2 text-sm text-gray-800 whitespace-pre-line">{r.content}</div>
            <div className="mt-2 flex gap-3 items-center">
              {auth?.user && (
                <>
                  <button 
                    className={`flex items-center gap-1 text-xs ${likedComments.has(r.id) ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                    onClick={() => handleLike(r.id)}
                  >
                    <ThumbsUp className={`w-4 h-4 ${likedComments.has(r.id) ? 'fill-current' : ''}`} />
                    <span>{r.likes_count || 0}</span>
                  </button>
                  <button 
                    className="text-xs text-blue-600" 
                    onClick={() => { 
                      setReplyTo(r.id); 
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
                    }}
                  >
                    Trả lời
                  </button>
                </>
              )}
            </div>
            {depth < 3 && renderReplies(r.replies || [], depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Bình luận ({total})</h2>

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
                {c.user_name || c.user?.name || 'Người dùng ẩn'} 
                {c.is_product_seller && <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Người bán</span>}
              </div>
              <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString('vi-VN')}</div>
            </div>
            <div className="mt-2 text-gray-800 whitespace-pre-line">{c.content}</div>
            <div className="mt-3 flex gap-3 items-center">
              {auth?.user && (
                <>
                  <button 
                    className={`flex items-center gap-1 text-sm ${likedComments.has(c.id) ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                    onClick={() => handleLike(c.id)}
                  >
                    <ThumbsUp className={`w-4 h-4 ${likedComments.has(c.id) ? 'fill-current' : ''}`} />
                    <span>{c.likes_count || 0}</span>
                  </button>
                  <button 
                    className="text-sm text-blue-600" 
                    onClick={() => { 
                      setReplyTo(c.id); 
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
                    }}
                  >
                    Trả lời
                  </button>
                </>
              )}
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
