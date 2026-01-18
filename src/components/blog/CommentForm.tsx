"use client";

import { useState } from "react";
import { useCreateComment } from "@/hooks/useComments";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface CommentFormProps {
    postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [content, setContent] = useState("");

    const createComment = useCreateComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userName.trim() || !userEmail.trim() || !content.trim()) {
            return;
        }

        await createComment.mutateAsync({
            post_id: postId,
            user_name: userName.trim(),
            user_email: userEmail.trim(),
            content: content.trim(),
        });

        // Reset form
        setUserName("");
        setUserEmail("");
        setContent("");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md border border-amber-100 p-6"
        >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Để lại bình luận</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="user_name" className="block text-sm font-semibold text-slate-900 mb-2">
                            Tên của bạn <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="Nguyễn Văn A"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="user_email" className="block text-sm font-semibold text-slate-900 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="user_email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="email@example.com"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-slate-900 mb-2">
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
                        placeholder="Viết bình luận của bạn..."
                        required
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={createComment.isPending}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Send size={18} />
                    {createComment.isPending ? "Đang gửi..." : "Gửi bình luận"}
                </motion.button>
                <p className="text-xs text-slate-500 mt-2">
                    Bình luận của bạn sẽ được kiểm duyệt trước khi hiển thị.
                </p>
            </form>
        </motion.div>
    );
}
