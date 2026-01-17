"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/ui/motion-primitives";
import { generateSlug } from "@/lib/utils";
import { Post } from "@/types/blog";
import { useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const postFormSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
    slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    thumbnail_url: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
    is_published: z.boolean(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
    post?: Post;
    onSubmit: (data: PostFormValues) => void;
    isSubmitting: boolean;
    submitLabel: string;
}

export default function PostForm({ post, onSubmit, isSubmitting, submitLabel }: PostFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PostFormValues>({
        resolver: zodResolver(postFormSchema),
        defaultValues: post
            ? {
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || "",
                content: post.content || "",
                thumbnail_url: post.thumbnail_url || "",
                is_published: post.is_published,
            }
            : {
                title: "",
                slug: "",
                excerpt: "",
                content: "",
                thumbnail_url: "",
                is_published: false,
            },
    });

    const titleValue = watch("title");
    const slugValue = watch("slug");

    // Auto-generate slug from title if slug is empty
    useEffect(() => {
        if (titleValue && !slugValue && !post) {
            const newSlug = generateSlug(titleValue);
            setValue("slug", newSlug);
        }
    }, [titleValue, slugValue, setValue, post]);

    return (
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/posts">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </motion.button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {post ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                        </h1>
                        {post && (
                            <p className="text-sm text-slate-500 mt-1">
                                Cập nhật lần cuối: {new Date(post.updated_at).toLocaleString("vi-VN")}
                            </p>
                        )}
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={20} />
                    {isSubmitting ? "Đang lưu..." : submitLabel}
                </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-md border border-amber-100 p-8 space-y-6">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("title")}
                        type="text"
                        id="title"
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="VD: 5 Mẹo Tiết Kiệm Chi Phí Khi Nhập Hàng Từ Trung Quốc"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                </div>

                {/* Slug */}
                <div>
                    <label htmlFor="slug" className="block text-sm font-semibold text-slate-900 mb-2">
                        Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("slug")}
                        type="text"
                        id="slug"
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono text-sm"
                        placeholder="5-meo-tiet-kiem-chi-phi-khi-nhap-hang-tu-trung-quoc"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                        URL: /meo-nhap-hang/<span className="font-semibold text-amber-600">{slugValue || "slug"}</span>
                    </p>
                    {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
                </div>

                {/* Excerpt */}
                <div>
                    <label htmlFor="excerpt" className="block text-sm font-semibold text-slate-900 mb-2">
                        Mô tả ngắn
                    </label>
                    <textarea
                        {...register("excerpt")}
                        id="excerpt"
                        rows={3}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-y"
                        placeholder="Mô tả ngắn gọn về bài viết (hiển thị trên thẻ blog)"
                    />
                    {errors.excerpt && <p className="mt-1 text-sm text-red-500">{errors.excerpt.message}</p>}
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-slate-900 mb-2">
                        Nội dung
                    </label>
                    <textarea
                        {...register("content")}
                        id="content"
                        rows={12}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-y font-mono text-sm"
                        placeholder="Nội dung bài viết (hỗ trợ HTML hoặc Markdown)"
                    />
                    {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>}
                    <p className="mt-1 text-xs text-slate-500">
                        Bạn có thể sử dụng HTML hoặc Markdown để định dạng nội dung
                    </p>
                </div>

                {/* Thumbnail URL */}
                <div>
                    <label htmlFor="thumbnail_url" className="block text-sm font-semibold text-slate-900 mb-2">
                        URL Hình ảnh
                    </label>
                    <input
                        {...register("thumbnail_url")}
                        type="url"
                        id="thumbnail_url"
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="https://example.com/image.jpg"
                    />
                    {errors.thumbnail_url && <p className="mt-1 text-sm text-red-500">{errors.thumbnail_url.message}</p>}
                    {watch("thumbnail_url") && (
                        <div className="mt-3">
                            <img
                                src={watch("thumbnail_url")}
                                alt="Preview"
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-amber-200"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <input
                        {...register("is_published")}
                        type="checkbox"
                        id="is_published"
                        className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
                    />
                    <label htmlFor="is_published" className="text-sm font-semibold text-slate-900 cursor-pointer flex-1">
                        Xuất bản bài viết
                    </label>
                    <p className="text-xs text-slate-600">Bài viết sẽ hiển thị công khai trên /meo-nhap-hang</p>
                </div>
            </form>
        </motion.div>
    );
}
