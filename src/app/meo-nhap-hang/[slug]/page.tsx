"use client";

import { useParams, useRouter } from "next/navigation";
import { usePostBySlug } from "@/hooks/useBlog";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/ui/motion-primitives";
import { Calendar, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import CommentList from "@/components/blog/CommentList";
import CommentForm from "@/components/blog/CommentForm";

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { data: post, isLoading, error } = usePostBySlug(slug);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-600">Đang tải bài viết...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-amber-50 py-16">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-3">Không tìm thấy bài viết</h1>
                        <p className="text-red-500 mb-6">
                            Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.
                        </p>
                        <Link href="/meo-nhap-hang">
                            <button className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold">
                                Quay lại danh sách
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 py-12">
            <motion.article
                variants={fadeIn}
                initial="initial"
                animate="animate"
                className="container mx-auto px-4 max-w-4xl"
            >
                {/* Back Button */}
                <Link href="/meo-nhap-hang">
                    <motion.button
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2 text-slate-600 hover:text-amber-600 mb-8 font-semibold transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Quay lại danh sách
                    </motion.button>
                </Link>

                {/* Hero Image */}
                {post.thumbnail_url && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 rounded-2xl overflow-hidden shadow-xl border border-amber-100"
                    >
                        <img
                            src={post.thumbnail_url}
                            alt={post.title}
                            className="w-full h-[400px] object-cover"
                        />
                    </motion.div>
                )}

                {/* Content Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 md:p-12">
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-amber-600" />
                            <time>{format(new Date(post.created_at), "dd MMMM yyyy", { locale: vi })}</time>
                        </div>
                        {post.content && (
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-amber-600" />
                                <span>{Math.ceil(post.content.length / 1000)} phút đọc</span>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-slate-600 mb-8 leading-relaxed italic border-l-4 border-amber-500 pl-6">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Content with Prose Styling */}
                    {post.content && (
                        <div
                            className="prose prose-lg prose-slate max-w-none
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-ul:my-6 prose-ol:my-6
                prose-li:text-slate-600 prose-li:mb-2
                prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-amber-100
                prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                prose-code:text-amber-600 prose-code:bg-amber-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag.id} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-amber-100 hover:text-amber-700 transition-colors cursor-default">
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-center shadow-lg"
                >
                    <h3 className="text-2xl font-bold text-white mb-3">Cần hỗ trợ thêm?</h3>
                    <p className="text-amber-50 mb-6 max-w-2xl mx-auto">
                        Liên hệ với chúng tôi để được tư vấn chi tiết về dịch vụ nhập hàng và tính toán chi phí chính xác
                    </p>
                    <Link href="/lien-he">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-amber-600 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            Liên hệ ngay
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Comments Section */}
                <div className="mt-12 space-y-8">
                    <CommentList postId={post.id} />
                    <CommentForm postId={post.id} />
                </div>
            </motion.article>
        </div>
    );
}
