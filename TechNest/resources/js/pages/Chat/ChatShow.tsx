import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';

interface Message {
    id: number;
    sender: any;
    message: string;
    created_at: string;
}

interface Props {
    conversation: any;
    messages: Message[];
}

export default function ChatShow({ conversation, messages: initialMessages }: Props) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Sử dụng usePage để lấy user data
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || loading) return;

        setLoading(true);
        try {
            const response = await fetch(`/chat/${conversation.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ message: newMessage })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    // Robust resolver for other participant
    const resolveOtherUser = (conv: any) => {
        const buyer = conv.buyer ?? conv.customer;
        const seller = conv.seller;
        if (!buyer && !seller) return null;
        if (buyer && user && buyer.id === user.id) return seller ?? buyer;
        return buyer ?? seller;
    };

    const otherUser = resolveOtherUser(conversation);
    const otherName = otherUser?.name ?? otherUser?.email ?? 'Người dùng';

    return (
        <AppLayout breadcrumbs={[
            { title: 'Tin nhắn', href: '/chat' },
            { title: otherName, href: `/chat/${conversation.id}` }
        ]}>
            <Head title={`Chat với ${otherName}`} />
            
            <div className="max-w-5xl mx-auto p-8">
                <div className="bg-white rounded-lg shadow-lg h-[760px] flex flex-col">
                     {/* Header */}
                    <div className="p-6 border-b bg-white border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                {otherName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg md:text-xl text-gray-900">{otherName}</h2>
                                {conversation.product && (
                                    <p className="text-sm md:text-base text-gray-600">
                                        Về: {conversation.product.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
 
                     {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                        <div className="space-y-6">
                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender?.id === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-md lg:max-w-2xl px-6 py-4 rounded-2xl text-base leading-snug ${
                                            message.sender?.id === user.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-gray-800 shadow-sm'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.message}</p>
                                        <p className={`text-sm mt-2 ${message.sender?.id === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {new Date(message.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
 
                     {/* Message Input */}
                    <div className="p-6 border-t bg-white">
                        <form onSubmit={sendMessage} className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !newMessage.trim()}
                                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 text-base"
                            >
                                Gửi
                            </button>
                        </form>
                    </div>
                 </div>
             </div>
         </AppLayout>
     );
}