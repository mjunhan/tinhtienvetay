"use client";

import { useRouter } from "next/navigation";
import { useCreatePost } from "@/hooks/useBlog";
import PostForm, { PostFormValues } from "@/components/admin/PostForm";

export default function NewPostPage() {
    const router = useRouter();
    const createPost = useCreatePost();

    const handleSubmit = async (data: PostFormValues) => {
        const { tags, ...rest } = data;
        const tagsArray = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
        await createPost.mutateAsync({ ...rest, tags: tagsArray });
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
