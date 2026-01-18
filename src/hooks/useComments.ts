"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllComments,
    getApprovedComments,
    createComment,
    approveComment,
    deleteComment,
    CreateCommentInput,
} from "@/lib/comment-actions";
import { toast } from "sonner";

/**
 * Get approved comments for a post (Public)
 */
export function useApprovedComments(postId: string) {
    return useQuery({
        queryKey: ["comments", "approved", postId],
        queryFn: () => getApprovedComments(postId),
        enabled: !!postId,
    });
}

/**
 * Get all comments (Admin)
 */
export function useAllComments() {
    return useQuery({
        queryKey: ["comments", "all"],
        queryFn: getAllComments,
    });
}

/**
 * Create comment mutation (Public)
 */
export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateCommentInput) => createComment(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
            toast.success("Bình luận của bạn đã được gửi và đang chờ duyệt!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Không thể gửi bình luận");
        },
    });
}

/**
 * Approve comment mutation (Admin)
 */
export function useApproveComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => approveComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
            toast.success("Đã duyệt bình luận!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Không thể duyệt bình luận");
        },
    });
}

/**
 * Delete comment mutation (Admin)
 */
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteComment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
            toast.success("Đã xóa bình luận!");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Không thể xóa bình luận");
        },
    });
}
