"use client";

import { usePublishedPosts } from "@/hooks/useBlog";
import { useCategories } from "@/hooks/useCMS";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, liftWithGlow } from "@/components/ui/motion-primitives";
import { Calendar, ArrowRight, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function BlogIndexContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const currentCategory = searchParams.get("cat");

    const { data: posts, isLoading, error } = usePublishedPosts({
        query: searchParams.get("q") || undefined,
        categoryId: currentCategory || undefined,
        tagId: searchParams.get("tag") || undefined,
    });

    const { data: categories } = useCategories();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
            params.set("q", searchQuery);
        } else {
            params.delete("q");
        }
        router.push(`/meo-nhap-hang?${params.toString()}`);
    };

    const handleCategoryClick = (catId: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (catId) {
            params.set("cat", catId);
        } else {
            params.delete("cat");
        }
        router.push(`/meo-nhap-hang?${params.toString()}`);
    };

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

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
                        <p className="text-red-600 font-semibold mb-2">Lỗi khi tải bài viết</p>
                        <p className="text-red-500 text-sm">{error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-semibold text-sm mb-6">
                        <BookOpen size={18} />
                        Mẹo nhập hàng
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">
                        Mẹo nhập hàng & Kiến thức hữu ích
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                        Chia sẻ kinh nghiệm, mẹo hay và hướng dẫn chi tiết để giúp bạn tiết kiệm chi phí khi nhập hàng từ Trung Quốc
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-md mx-auto relative mb-8">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm bài viết..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none shadow-sm"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-500">
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!currentCategory
                                ? "bg-amber-600 text-white"
                                : "bg-white text-gray-600 hover:bg-amber-50"
                                }`}
                        >
                            Tất cả
                        </button>
                        {categories?.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${currentCategory === cat.id
                                    ? "bg-amber-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-amber-50"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Posts Grid */}
                {posts && posts.length > 0 ? (
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {posts.map((post) => (
                            <motion.article
                                key={post.id}
                                variants={staggerItem}
                                {...liftWithGlow}
                                className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden group cursor-pointer"
                            >
                                <Link href={`/meo-nhap-hang/${post.slug}`}>
                                    {/* Thumbnail */}
                                    {post.thumbnail_url ? (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={post.thumbnail_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                            <BookOpen size={48} className="text-amber-500 opacity-50" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                            <Calendar size={14} />
                                            <time>{format(new Date(post.created_at), "dd MMM yyyy", { locale: vi })}</time>
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                                        )}

                                        {/* Read More */}
                                        <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:gap-3 transition-all">
                                            <span>Đọc thêm</span>
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-md border border-amber-100 p-12 text-center max-w-2xl mx-auto"
                    >
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={40} className="text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Chưa có bài viết nào</h3>
                        <p className="text-slate-600">
                            {searchQuery || currentCategory
                                ? "Không tìm thấy bài viết phù hợp với điều kiện tìm kiếm."
                                : "Hiện tại chưa có bài viết nào được xuất bản. Vui lòng quay lại sau!"}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function BlogIndexPage() {
    return (
        <Suspense fallback={
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
        }>
            <BlogIndexContent />
        </Suspense>
    );
}
