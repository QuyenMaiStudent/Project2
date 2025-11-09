import { useState, useRef, useEffect } from "react";
import { MODELS, DEFAULT_MODEL } from '@/Models';

type Message = { role: 'user' | 'assistant'; content: string };

function ChatBot() {
    const [model, setModel] = useState<string>(DEFAULT_MODEL);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Welcome message when component mounts
    useEffect(() => {
        setMessages([
            { 
                role: 'assistant', 
                content: 'Chào bạn! Tôi là trợ lý ảo của TechNest. Tôi có thể giúp bạn:\n\n• Tìm kiếm sản phẩm công nghệ\n• Tư vấn mua sắm\n• Giải đáp thắc mắc về đơn hàng và chính sách\n\nVí dụ: "Tìm iPhone" hoặc "Laptop Dell giá rẻ"\n\nBạn cần hỗ trợ gì?' 
            }
        ]);
    }, []);

    // Function to render message content with clickable links
    const renderMessageContent = (content: string) => {
        // Replace markdown-style links [text](url) with clickable links
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = content.split(linkRegex);
        
        const result = [];
        for (let i = 0; i < parts.length; i += 3) {
            if (parts[i]) {
                result.push(parts[i]);
            }
            if (parts[i + 1] && parts[i + 2]) {
                result.push(
                    <a 
                        key={i} 
                        href={parts[i + 2]} 
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = parts[i + 2];
                        }}
                    >
                        {parts[i + 1]}
                    </a>
                );
            }
        }
        
        return result;
    };

    async function send() {
        if (!input.trim()) return;
        const userMsg: Message = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/chat/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    message: [
                        { role: 'user', content: userMsg.content }
                    ],
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const content = data.content ?? '[Không có phản hồi]';
            setMessages(prev => [...prev, { role: 'assistant', content }]);
        } catch (err: any) {
            setError(err.message || 'Lỗi');
        } finally {
            setLoading(false);
        }
    }

    // Updated quick suggestions
    const quickSuggestions = [
        "Tìm iPhone mới nhất",
        "Laptop 16GB RAM",
        "Điện thoại camera 64MP",
        "Máy tính SSD 512GB",
        "Tablet màn hình 10 inch",
        "Chính sách bảo hành"
    ];

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
                <img 
                    src="/images/chatbot-icon.png" 
                    alt="TechBot" 
                    className="w-8 h-8" 
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/32?text=Bot")} 
                />
                <h2 className="text-xl font-bold text-[#0AC1EF]">TechBot - Trợ lý mua sắm</h2>
            </div>

            {/* Ẩn phần chọn model khỏi người dùng thông thường - chỉ hiển thị trong môi trường dev */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mb-3 flex gap-2">
                    <select value={model} onChange={e => setModel(e.target.value)} 
                            className="border px-2 py-1 text-sm rounded"
                            title="Chọn model AI (chỉ dành cho developer)">
                        {MODELS.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => { 
                        setMessages([{ 
                            role: 'assistant', 
                            content: 'Chào bạn! Tôi là trợ lý ảo của TechNest. Tôi có thể giúp bạn:\n\n• Tìm kiếm sản phẩm công nghệ\n• Tư vấn mua sắm\n• Giải đáp thắc mắc về đơn hàng và chính sách\n\nVí dụ: "Tìm iPhone" hoặc "Laptop Dell giá rẻ"\n\nBạn cần hỗ trợ gì?' 
                        }]); 
                        setError(null); 
                    }} 
                    className="px-3 py-1 border rounded text-sm hover:bg-gray-100">
                        Bắt đầu lại
                    </button>
                </div>
            )}

            {/* Messages container */}
            <div className="mb-3 h-[360px] overflow-auto rounded border p-3 bg-gray-50">
                {messages.length === 0 && <div className="text-sm text-gray-500">Không có tin nhắn</div>}
                {messages.map((m, i) => (
                    <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block rounded-lg px-3 py-2 max-w-[85%] ${
                            m.role === 'user' 
                                ? 'bg-[#0AC1EF] text-white' 
                                : 'bg-gray-200 text-gray-800'
                        }`}>
                            <div className="whitespace-pre-wrap">
                                {m.role === 'assistant' ? renderMessageContent(m.content) : m.content}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 2 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {quickSuggestions.map((suggestion, idx) => (
                        <button 
                            key={idx}
                            className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
                            onClick={() => {
                                setInput(suggestion);
                            }}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Input area */}
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0AC1EF] focus:border-transparent"
                    placeholder="Hỏi về sản phẩm hoặc 'Tìm iPhone'..."
                />
                <button 
                    onClick={send} 
                    disabled={loading} 
                    className="px-4 py-2 bg-[#0AC1EF] text-white rounded-full hover:bg-[#09b0da] transition-colors disabled:bg-gray-300"
                >
                    {loading ? 'Đang gửi...' : 'Gửi'}
                </button>
            </div>

            {error && <div className="mt-2 text-red-600">Lỗi: {error}</div>}
        </div>
    );
}

export default ChatBot;