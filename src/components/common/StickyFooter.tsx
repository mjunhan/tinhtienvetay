import { Phone, MessageCircle } from 'lucide-react';

export function StickyFooter() {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-2xl z-50 md:hidden pb-safe">
            <div className="flex gap-3 max-w-md mx-auto">
                <a
                    href="tel:0912345678" // Replace with real number if available
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-text-main font-bold rounded-full hover:bg-slate-200 transition-colors"
                >
                    <Phone className="w-5 h-5" />
                    <span>Gọi Ngay</span>
                </a>
                <a
                    href="https://zalo.me/your-zalo-id" // Replace with real Zalo
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat Zalo</span>
                </a>
            </div>
        </div>
    );
}
