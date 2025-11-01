import React from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    fullscreen?: boolean;
};

export default function Modal({ open, onClose, children, title, fullscreen = true }: Props) {
    if (!open) return null;
    
    const modalClasses = fullscreen 
        ? "h-screen w-screen max-w-none max-h-none m-0 rounded-none"
        : "max-h-[85vh] w-full max-w-2xl mx-4 rounded-lg";
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`overflow-hidden bg-white shadow-2xl flex flex-col ${modalClasses}`}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                    <button 
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors" 
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
