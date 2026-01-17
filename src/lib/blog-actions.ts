"use server";

import { createClient } from "@/lib/supabase/server";
import { Post, CreatePostInput, UpdatePostInput } from "@/types/blog";
import { generateSlug } from "@/lib/utils";

/**
 * Get all posts (admin view - includes unpublished)
 */
export async function getAllPosts(): Promise<Post[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all posts:", error);
        throw new Error("Failed to fetch posts");
    }

    return data || [];
}

/**
 * Get published posts only (public view)
 */
export async function getPublishedPosts(): Promise<Post[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching published posts:", error);
        throw new Error("Failed to fetch published posts");
    }

    return data || [];
}

/**
 * Get single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            // No rows returned
            return null;
        }
        console.error("Error fetching post by slug:", error);
        throw new Error("Failed to fetch post");
    }

    return data;
}

/**
 * Get single post by ID (for editing)
 */
export async function getPostById(id: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null;
        }
        console.error("Error fetching post by ID:", error);
        throw new Error("Failed to fetch post");
    }

    return data;
}

/**
 * Create new post
 */
export async function createPost(input: CreatePostInput): Promise<Post> {
    const supabase = await createClient();

    // Auto-generate slug if not provided
    const slug = input.slug || generateSlug(input.title);

    const { data, error } = await supabase
        .from("posts")
        .insert({
            ...input,
            slug,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating post:", error);
        if (error.code === "23505") {
            throw new Error("A post with this slug already exists");
        }
        throw new Error("Failed to create post");
    }

    return data;
}

/**
 * Update existing post
 */
export async function updatePost(input: UpdatePostInput): Promise<Post> {
    const supabase = await createClient();

    const { id, ...updates } = input;

    const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating post:", error);
        if (error.code === "23505") {
            throw new Error("A post with this slug already exists");
        }
        throw new Error("Failed to update post");
    }

    return data;
}

/**
 * Delete post
 */
export async function deletePost(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
    }
}

/**
 * Toggle post publish status
 */
export async function togglePublishStatus(id: string, currentStatus: boolean): Promise<Post> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .update({ is_published: !currentStatus })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error toggling publish status:", error);
        throw new Error("Failed to toggle publish status");
    }

    return data;
}
