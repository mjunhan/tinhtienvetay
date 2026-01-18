"use client";

import { Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function StickyFooter() {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-amber-200 shadow-2xl z-50 md:hidden pb-safe"
        >
            <div className="max-w-md mx-auto">
                {/* Zalo Button - Full Width */}
                <motion.a
                    href="https://zalo.me/your-zalo-id"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 active:shadow-xl transition-all"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat Zalo</span>
                </motion.a>
            </div>
        </motion.div>
    );
}
