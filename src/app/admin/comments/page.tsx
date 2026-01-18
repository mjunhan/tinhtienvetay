"use client";

import { useAllComments, useApproveComment, useDeleteComment } from "@/hooks/useComments";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, staggerItem } from "@/components/ui/motion-primitives";
import { MessageSquare, Check, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

export default function AdminCommentsPage() {
    const { data: comments, isLoading } = useAllComments();
    const approveComment = useApproveComment();
    const deleteComment = useDeleteComment();
    const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

    const filteredComments = comments?.filter((comment) => {
        if (filter === "pending") return !comment.is_approved;
        if (filter === "approved") return comment.is_approved;
        return true;
    });

    const handleApprove = async (id: string) => {
        await approveComment.mutateAsync(id);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc muốn xóa bình luận này?")) {
            await deleteComment.mutateAsync(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Đang tải bình luận...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <MessageSquare size={32} className="text-amber-600" />
                        Quản lý Bình luận
                    </h1>
                    <p className="text-slate-600 mt-1">Kiểm duyệt và quản lý bình luận từ người dùng</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 bg-white rounded-xl shadow-md border border-amber-100 p-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "all"
                            ? "bg-amber-600 text-white"
                            : "text-gray-600 hover:bg-amber-50"
                        }`}
                >
                    Tất cả ({comments?.length || 0})
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "pending"
                            ? "bg-amber-600 text-white"
                            : "text-gray-600 hover:bg-amber-50"
                        }`}
                >
                    Chờ duyệt ({comments?.filter((c) => !c.is_approved).length || 0})
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === "approved"
                            ? "bg-amber-600 text-white"
                            : "text-gray-600 hover:bg-amber-50"
                        }`}
                >
                    Đã duyệt ({comments?.filter((c) => c.is_approved).length || 0})
                </button>
            </div>

            {/* Comments List */}
            {filteredComments && filteredComments.length > 0 ? (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden"
                >
                    <table className="w-full">
                        <thead className="bg-amber-50 border-b border-amber-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Người dùng</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Nội dung</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Ngày tạo</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-900">Trạng thái</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-slate-900">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComments.map((comment) => (
                                <motion.tr
                                    key={comment.id}
                                    variants={staggerItem}
                                    className="border-b border-gray-100 last:border-0 hover:bg-amber-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-slate-900">{comment.user_name}</p>
                                            <p className="text-xs text-slate-500">{comment.user_email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-600 line-clamp-2">{comment.content}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {format(new Date(comment.created_at), "dd MMM yyyy, HH:mm", { locale: vi })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {comment.is_approved ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                <Check size={14} />
                                                Đã duyệt
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                <Clock size={14} />
                                                Chờ duyệt
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {!comment.is_approved && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleApprove(comment.id)}
                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                    title="Duyệt"
                                                >
                                                    <Check size={18} />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(comment.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-amber-100 p-12 text-center">
                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có bình luận nào</h3>
                    <p className="text-slate-600">
                        {filter === "pending" && "Không có bình luận nào đang chờ duyệt"}
                        {filter === "approved" && "Chưa có bình luận nào được duyệt"}
                        {filter === "all" && "Hệ thống chưa có bình luận nào"}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
