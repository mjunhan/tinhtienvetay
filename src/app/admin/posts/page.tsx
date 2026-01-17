"use client";

import { useAllPosts, useDeletePost, useTogglePublishStatus } from "@/hooks/useBlog";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeIn } from "@/components/ui/motion-primitives";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";

export default function PostsPage() {
    const { data: posts, isLoading, error } = useAllPosts();
    const deletePost = useDeletePost();
    const togglePublish = useTogglePublishStatus();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Bạn có chắc muốn xóa bài viết "${title}"?`)) {
            setDeletingId(id);
            await deletePost.mutateAsync(id);
            setDeletingId(null);
        }
    };

    const handleTogglePublish = (id: string, currentStatus: boolean) => {
        togglePublish.mutate({ id, currentStatus });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-semibold mb-2">Lỗi khi tải bài viết</p>
                <p className="text-red-500 text-sm">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Quản lý bài viết</h1>
                    <p className="text-slate-600 mt-1">Mẹo nhập hàng & Blog</p>
                </div>
                <Link href="/admin/posts/new">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transition-all"
                    >
                        <Plus size={20} />
                        Tạo bài viết mới
                    </motion.button>
                </Link>
            </motion.div>

            {/* Posts Table */}
            {posts && posts.length > 0 ? (
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-amber-50 border-b border-amber-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Hình ảnh</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Tiêu đề</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Trạng thái</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ngày tạo</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {posts.map((post) => (
                                    <motion.tr
                                        key={post.id}
                                        variants={staggerItem}
                                        className="hover:bg-amber-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            {post.thumbnail_url ? (
                                                <img
                                                    src={post.thumbnail_url}
                                                    alt={post.title}
                                                    className="w-16 h-16 object-cover rounded-lg border border-amber-100"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-slate-400 text-xs">No image</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{post.title}</p>
                                                <p className="text-sm text-slate-500 truncate max-w-md">{post.excerpt}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleTogglePublish(post.id, post.is_published)}
                                                className="flex items-center gap-2"
                                            >
                                                {post.is_published ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                        <Eye size={14} />
                                                        Công khai
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                                                        <EyeOff size={14} />
                                                        Nháp
                                                    </span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {format(new Date(post.created_at), "dd MMM yyyy", { locale: vi })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/posts/${post.id}/edit`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Pencil size={18} />
                                                    </motion.button>
                                                </Link>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    disabled={deletingId === post.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    className="bg-white rounded-xl shadow-md border border-amber-100 p-12 text-center"
                >
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={40} className="text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có bài viết nào</h3>
                        <p className="text-slate-600 mb-6">
                            Bắt đầu tạo bài viết đầu tiên để chia sẻ mẹo nhập hàng với khách hàng
                        </p>
                        <Link href="/admin/posts/new">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Tạo bài viết đầu tiên
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
