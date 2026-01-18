"use server";

import { createClient } from "@/lib/supabase/server";

export interface Comment {
    id: string;
    post_id: string;
    user_name: string;
    user_email: string;
    content: string;
    is_approved: boolean;
    created_at: string;
}

export interface CreateCommentInput {
    post_id: string;
    user_name: string;
    user_email: string;
    content: string;
}

/**
 * Submit a new comment (Public - auto-pending)
 */
export async function createComment(input: CreateCommentInput): Promise<Comment> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("comments")
        .insert({
            ...input,
            is_approved: false, // Comments start as pending
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating comment:", error);
        throw new Error("Failed to submit comment");
    }

    return data;
}

/**
 * Get approved comments for a post (Public)
 */
export async function getApprovedComments(postId: string): Promise<Comment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .eq("is_approved", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching approved comments:", error);
        throw new Error("Failed to fetch comments");
    }

    return data || [];
}

/**
 * Get all comments (Admin)
 */
export async function getAllComments(): Promise<Comment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all comments:", error);
        throw new Error("Failed to fetch comments");
    }

    return data || [];
}

/**
 * Approve a comment (Admin)
 */
export async function approveComment(id: string): Promise<Comment> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("comments")
        .update({ is_approved: true })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error approving comment:", error);
        throw new Error("Failed to approve comment");
    }

    return data;
}

/**
 * Delete a comment (Admin)
 */
export async function deleteComment(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }
}
