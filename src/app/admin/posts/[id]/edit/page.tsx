"use client";

import { useRouter, useParams } from "next/navigation";
import { usePostById, useUpdatePost } from "@/hooks/useBlog";
import PostForm, { PostFormValues } from "@/components/admin/PostForm";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const { data: post, isLoading, error } = usePostById(postId);
    const updatePost = useUpdatePost();

    const handleSubmit = async (data: PostFormValues) => {
        const { tags, ...rest } = data;
        const tagsArray = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
        await updatePost.mutateAsync({ id: postId, ...rest, tags: tagsArray });
        router.push("/admin/posts");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto mt-12">
                <p className="text-red-600 font-semibold mb-2">Không tìm thấy bài viết</p>
                <p className="text-red-500 text-sm">Bài viết có thể đã bị xóa hoặc ID không hợp lệ</p>
                <button
                    onClick={() => router.push("/admin/posts")}
                    className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <PostForm
            post={post}
            onSubmit={handleSubmit}
            isSubmitting={updatePost.isPending}
            submitLabel="Cập nhật bài viết"
        />
    );
}
