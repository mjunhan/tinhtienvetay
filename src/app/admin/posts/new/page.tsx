"use client";

import { useRouter } from "next/navigation";
import { useCreatePost } from "@/hooks/useBlog";
import PostForm, { PostFormValues } from "@/components/admin/PostForm";

export default function NewPostPage() {
    const router = useRouter();
    const createPost = useCreatePost();

    const handleSubmit = async (data: PostFormValues) => {
        await createPost.mutateAsync(data);
        router.push("/admin/posts");
    };

    return (
        <PostForm
            onSubmit={handleSubmit}
            isSubmitting={createPost.isPending}
            submitLabel="Tạo bài viết"
        />
    );
}
