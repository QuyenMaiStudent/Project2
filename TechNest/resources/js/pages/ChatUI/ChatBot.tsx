import { DEFAULT_MODEL, MODELS } from "@/Models";
import { useState } from "react";

type Message = { role: 'user' | 'assistant'; content: string };

function ChatBot() {
    const [model, setModel] = useState<string>(DEFAULT_MODEL);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    // API controller expects `message` (singular). Send both if you prefer:
                    message: [{ role: 'user', content: userMsg.content }],
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const content = data.content ?? '[No content]';
            setMessages(prev => [...prev, { role: 'assistant', content }]);
        } catch (err: any) {
            setError(err.message || 'Error');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-3">ChatBot</h2>

        <div className="mb-3 flex gap-2">
            <select value={model} onChange={e => setModel(e.target.value)} className="border px-2 py-1">
                {MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                        {m.label}
                    </option>
                ))}
            </select>
            <button onClick={() => { setMessages([]); setError(null); }} className="px-3 py-1 border">Reset</button>
        </div>

        <div className="mb-3 h-64 overflow-auto rounded border p-3 bg-white">
            {messages.length === 0 && <div className="text-sm text-gray-500">No messages yet</div>}
            {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block rounded px-3 py-2 ${m.role === 'user' ? 'bg-[#0AC1EF] text-white' : 'bg-gray-100'}`}>
                        {m.content}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex gap-2">
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                className="flex-1 border px-3 py-2"
                placeholder="Nhập tin nhắn..."
            />
            <button onClick={send} disabled={loading} className="px-4 py-2 bg-[#0AC1EF] text-white rounded">
                {loading ? 'Đang gửi...' : 'Gửi'}
            </button>
        </div>

        {error && <div className="mt-2 text-red-600">Error: {error}</div>}
    </div>
  )
}

export default ChatBot