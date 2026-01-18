"use client";

import { useApprovedComments } from "@/hooks/useComments";
import { motion } from "framer-motion";
import { MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface CommentListProps {
    postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
    const { data: comments, isLoading } = useApprovedComments(postId);

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6">
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-amber-100 p-8 text-center">
                <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md border border-amber-100 p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MessageSquare size={24} className="text-amber-600" />
                Bình luận ({comments.length})
            </h3>
            <div className="space-y-4">
                {comments.map((comment, index) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User size={20} className="text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-900">{comment.user_name}</span>
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(comment.created_at), "dd MMM yyyy, HH:mm", { locale: vi })}
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
