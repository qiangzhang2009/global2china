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
    if (!message.trim()) return;

    toast.success('消息已发送！我们会尽快回复您。');
    setMessage('');
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">在线咨询</div>
                  <div className="text-white/70 text-xs">工作日 9:00-18:00</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <p className="text-sm text-gray-600">
                您好！欢迎咨询海外产品进口服务。请告诉我们您的需求。
              </p>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="请输入您的问题..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>发送消息</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center hover:scale-110"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default FloatingContact;
