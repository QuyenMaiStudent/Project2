import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { MessageCircle, Send, User, Clock, Phone, Video, MoreHorizontal, Search } from 'lucide-react';

interface Message {
    id: number;
    sender: any;
    message: string;
    created_at: string;
    read_at?: string;
}

interface Conversation {
    id: number;
    buyer: any;
    customer: any; // Thêm customer property
    seller: any;
    product: any;
    latest_message: any;
    last_message_at: string;
}

interface Props {
    conversations: Conversation[];
}

export default function ChatIndex({ conversations }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
        conversations.length > 0 ? conversations[0] : null
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load messages when conversation changes
    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    const loadMessages = async (conversationId: number) => {
        try {
            const response = await fetch(`/chat/${conversationId}/messages`, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || loading || !selectedConversation) return;

        setLoading(true);
        try {
            const response = await fetch(`/chat/${selectedConversation.id}/messages`, {
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

    const getOtherUser = (conversation: Conversation) => {
        // Sử dụng buyer (vì trong database vẫn là buyer_id)
        return conversation.buyer?.id === user?.id ? conversation.seller : conversation.buyer;
    };

    const filteredConversations = conversations.filter(conv => {
        const otherUser = getOtherUser(conv);
        return otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               conv.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays <= 7) {
            return date.toLocaleDateString('vi-VN', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <AppLayout>
            <Head title="Tin nhắn" />
            
            <div className="h-[calc(100vh-4rem)] flex bg-white">
                {/* Sidebar - Danh sách cuộc hội thoại */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col">
                    {/* Header sidebar */}
                    <div className="p-4 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-900 mb-3">Tin nhắn</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm cuộc trò chuyện..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Danh sách cuộc hội thoại */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                {searchTerm ? 'Không tìm thấy cuộc trò chuyện nào' : 'Chưa có tin nhắn nào'}
                            </div>
                        ) : (
                            filteredConversations.map(conversation => {
                                const otherUser = getOtherUser(conversation);
                                const isSelected = selectedConversation?.id === conversation.id;
                                
                                return (
                                    <div
                                        key={conversation.id}
                                        onClick={() => setSelectedConversation(conversation)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                                            isSelected ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                                {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {otherUser?.name || 'Unknown User'}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {formatTime(conversation.last_message_at)}
                                                    </span>
                                                </div>
                                                {conversation.product && (
                                                    <p className="text-xs text-blue-600 truncate mt-1">
                                                        📦 {conversation.product.name}
                                                    </p>
                                                )}
                                                {conversation.latest_message && (
                                                    <p className="text-sm text-gray-500 truncate mt-1">
                                                        {conversation.latest_message.sender?.id === user.id ? 'Bạn: ' : ''}
                                                        {conversation.latest_message.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Main chat area */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat header */}
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                            {getOtherUser(selectedConversation)?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                {getOtherUser(selectedConversation)?.name || 'Unknown User'}
                                            </h2>
                                            {selectedConversation.product && (
                                                <p className="text-sm text-gray-600">
                                                    Về: {selectedConversation.product.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                                            <Phone className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                                            <Video className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                <div className="space-y-4">
                                    {messages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender?.id === user.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                                                message.sender?.id === user.id ? 'flex-row-reverse space-x-reverse' : ''
                                            }`}>
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                                                    {message.sender?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div
                                                    className={`px-4 py-2 rounded-2xl ${
                                                        message.sender?.id === user.id
                                                            ? 'bg-blue-500 text-white rounded-br-sm'
                                                            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                                                    }`}
                                                >
                                                    <p className="text-sm">{message.message}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        message.sender?.id === user.id ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>
                                                        {new Date(message.created_at).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Message input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <form onSubmit={sendMessage} className="flex space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || !newMessage.trim()}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>Gửi</span>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn một cuộc trò chuyện</h3>
                                <p className="text-gray-500">Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}