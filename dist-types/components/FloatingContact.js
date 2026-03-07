import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { toast } from 'sonner';
const FloatingContact = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleSend = () => {
        if (!message.trim())
            return;
        toast.success('消息已发送！我们会尽快回复您。');
        setMessage('');
        setIsOpen(false);
    };
    if (!isVisible)
        return null;
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50", children: [isOpen && (_jsxs("div", { className: "absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4", children: [_jsx("div", { className: "bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center", children: _jsx(MessageCircle, { className: "w-4 h-4 text-white" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-white font-medium text-sm", children: "\u5728\u7EBF\u54A8\u8BE2" }), _jsx("div", { className: "text-white/70 text-xs", children: "\u5DE5\u4F5C\u65E5 9:00-18:00" })] })] }), _jsx("button", { onClick: () => setIsOpen(false), className: "text-white/80 hover:text-white transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }) }), _jsxs("div", { className: "p-4", children: [_jsx("div", { className: "bg-gray-50 rounded-xl p-3 mb-4", children: _jsx("p", { className: "text-sm text-gray-600", children: "\u60A8\u597D\uFF01\u6B22\u8FCE\u54A8\u8BE2\u6D77\u5916\u4EA7\u54C1\u8FDB\u53E3\u670D\u52A1\u3002\u8BF7\u544A\u8BC9\u6211\u4EEC\u60A8\u7684\u9700\u6C42\u3002" }) }), _jsx("textarea", { value: message, onChange: (e) => setMessage(e.target.value), placeholder: "\u8BF7\u8F93\u5165\u60A8\u7684\u95EE\u9898...", rows: 3, className: "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none" }), _jsxs("button", { onClick: handleSend, disabled: !message.trim(), className: "w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Send, { className: "w-4 h-4" }), _jsx("span", { children: "\u53D1\u9001\u6D88\u606F" })] })] })] })), _jsx("button", { onClick: () => setIsOpen(!isOpen), className: "w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center hover:scale-110", children: isOpen ? (_jsx(X, { className: "w-6 h-6" })) : (_jsx(MessageCircle, { className: "w-6 h-6" })) })] }));
};
export default FloatingContact;
