"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllPosts,
    getPublishedPosts,
    getPostBySlug,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    togglePublishStatus,
} from "@/lib/blog-actions";
import { CreatePostInput, UpdatePostInput } from "@/types/blog";
import { toast } from "sonner";

/**
 * Fetch all posts (admin)
 */
export function useAllPosts() {
    return useQuery({
        queryKey: ["posts", "all"],
        queryFn: getAllPosts,
    });
}

/**
 * Fetch published posts only (public)
 */
export function usePublishedPosts(filters: { query?: string; categoryId?: string; tagId?: string } = {}) {
    return useQuery({
        queryKey: ["posts", "published", filters],
        queryFn: () => getPublishedPosts(filters),
    });
}

/**
 * Fetch single post by slug
 */
export function usePostBySlug(slug: string) {
    return useQuery({
        queryKey: ["posts", "slug", slug],
        queryFn: () => getPostBySlug(slug),
        enabled: !!slug,
    });
}

/**
 * Fetch single post by ID (for editing)
 */
export function usePostById(id: string) {
    return useQuery({
        queryKey: ["posts", "id", id],
        queryFn: () => getPostById(id),
        enabled: !!id,
    });
}

/**
 * Create new post mutation
 */
export function useCreatePost() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (input: CreatePostInput) => createPost(input),
        onMutate: () => {
            console.log("🚀 Starting Post Creation...");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Bài viết đã được tạo thành công!");
            router.push("/admin/posts");
        },
        onError: (error: Error) => {
            console.error("❌ Post Creation Failed:", error);
            toast.error(error.message || "Không thể tạo bài viết");
        },
    });
}

/**
 * Update post mutation
 */
export function useUpdatePost() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (input: UpdatePostInput) => updatePost(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Bài viết đã được cập nhật!");
            router.push("/admin/posts");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Không thể cập nhật bài viết");
        },
    });
}

/**
 * Delete post mutation
 */
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Bài viết đã được xóa!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Không thể xóa bài viết");
        },
    });
}

/**
 * Toggle publish status mutation
 */
export function useTogglePublishStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, currentStatus }: { id: string; currentStatus: boolean }) =>
            togglePublishStatus(id, currentStatus),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            const status = data.is_published ? "đã xuất bản" : "đã ẩn";
            toast.success(`Bài viết ${status}!`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Không thể thay đổi trạng thái");
        },
    });
}
