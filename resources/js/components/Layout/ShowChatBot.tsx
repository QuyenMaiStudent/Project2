import React, { useState } from 'react';
import ChatBot from '@/pages/ChatUI/ChatBot';

export default function ShowChatBot() {
    const [showChat, setShowChat] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {showChat ? (
                <div className="bg-white rounded-lg shadow-xl p-2 mb-2 w-[480px] md:w-[575px]">
                    <div className="flex justify-end mb-1">
                        <button 
                            onClick={() => setShowChat(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <span className="sr-only">Đóng</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <ChatBot />
                </div>
            ) : (
                <button
                    onClick={() => setShowChat(true)}
                    className="bg-[#0AC1EF] text-white p-4 rounded-full shadow-lg hover:bg-[#09b0da] transition-colors flex items-center justify-center"
                    title="Chat với trợ lý"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}
