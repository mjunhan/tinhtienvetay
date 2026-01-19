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
        .select(`
            *,
            category:categories(*),
            tags:tags(*)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all posts:", error);
        throw new Error("Failed to fetch posts");
    }

    return (data as any) || [];
}

/**
 * Get published posts only (public view)
 */
/**
 * Get published posts with filtering
 */
export async function getPublishedPosts({
    query,
    categoryId,
    tagId,
    limit = 20
}: {
    query?: string;
    categoryId?: string;
    tagId?: string;
    limit?: number;
} = {}): Promise<Post[]> {
    const supabase = await createClient();

    let dbQuery = supabase
        .from("posts")
        .select(`
            *,
            category:categories(*),
            tags:tags(*)
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (query) {
        dbQuery = dbQuery.ilike("title", `%${query}%`);
    }

    if (categoryId) {
        dbQuery = dbQuery.eq("category_id", categoryId);
    }

    if (tagId) {
        // This requires a join on post_tags if we filter by tagId directly on posts
        // But since we selected tags via relation, we might need a different approach or filter after fetch
        // Or use !inner join to filter.
        // Supabase select with !inner on many-to-many is tricky.
        // Alternative: Fetch post_ids from post_tags first.
        const { data: taggedPosts } = await supabase
            .from("post_tags")
            .select("post_id")
            .eq("tag_id", tagId);

        if (taggedPosts) {
            const postIds = taggedPosts.map(p => p.post_id);
            dbQuery = dbQuery.in("id", postIds);
        }
    }

    const { data, error } = await dbQuery;

    if (error) {
        console.error("Error fetching published posts:", error);
        throw new Error("Failed to fetch published posts");
    }

    return (data as any) || []; // Cast to any because of join types
}

/**
 * Get single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            category:categories(*),
            tags:tags(*)
        `)
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

    return data as any;
}

/**
 * Get single post by ID (for editing)
 */
export async function getPostById(id: string): Promise<Post | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select(`
            *,
            category:categories(*),
            tags:tags(*)
        `)
        .eq("id", id)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null;
        }
        console.error("Error fetching post by ID:", error);
        throw new Error("Failed to fetch post");
    }

    return data as any;
}

/**
 * Create new post
 */
/**
 * Create new post
 */
export async function createPost(input: CreatePostInput): Promise<Post> {
    const supabase = await createClient();

    // Auto-generate slug if not provided
    const slug = input.slug || generateSlug(input.title);

    // Extract tags to handle separately
    const { tags: tagNames, ...postData } = input;

    // 1. Create Post
    const { data: post, error } = await supabase
        .from("posts")
        .insert({
            ...postData,
            slug,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating post:", error);
        if (error.code === "23505") {
            throw new Error("Một bài viết với đường dẫn (slug) này đã tồn tại. Vui lòng chọn slug khác.");
        }
        throw new Error(error.message || "Không thể tạo bài viết");
    }

    // 2. Handle Tags
    if (tagNames && tagNames.length > 0 && post) {
        const tagPromises = tagNames.map(async (tagName) => {
            const slug = generateSlug(tagName);

            // Upsert tag
            const { data: tag, error: tagError } = await supabase
                .from("tags")
                .select("id")
                .eq("slug", slug)
                .single();

            let tagId = tag?.id;

            if (!tagId) {
                const { data: newTag } = await supabase
                    .from("tags")
                    .insert({ name: tagName, slug })
                    .select("id")
                    .single();
                tagId = newTag?.id;
            }

            if (tagId) {
                await supabase.from("post_tags").insert({
                    post_id: post.id,
                    tag_id: tagId
                });
            }
        });

        await Promise.all(tagPromises);
    }

    return post;
}

/**
 * Update existing post
 */
export async function updatePost(input: UpdatePostInput): Promise<Post> {
    const supabase = await createClient();

    const { id, tags: tagNames, ...updates } = input;

    const { data: post, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating post:", error);
        if (error.code === "23505") {
            throw new Error("Một bài viết với đường dẫn (slug) này đã tồn tại.");
        }
        throw new Error(error.message || "Không thể cập nhật bài viết");
    }

    // Handle Tags Update if provided
    if (typeof tagNames !== 'undefined') { // Check if tags field was included in update
        // 1. Remove all existing tags
        await supabase.from("post_tags").delete().eq("post_id", id);

        // 2. Add new tags
        if (tagNames && tagNames.length > 0) {
            const tagPromises = tagNames.map(async (tagName) => {
                const slug = generateSlug(tagName);

                // Upsert tag
                const { data: tag } = await supabase
                    .from("tags")
                    .select("id")
                    .eq("slug", slug)
                    .single();

                let tagId = tag?.id;

                if (!tagId) {
                    const { data: newTag } = await supabase
                        .from("tags")
                        .insert({ name: tagName, slug })
                        .select("id")
                        .single();
                    tagId = newTag?.id;
                }

                if (tagId) {
                    await supabase.from("post_tags").insert({
                        post_id: id,
                        tag_id: tagId
                    });
                }
            });

            await Promise.all(tagPromises);
        }
    }

    return post;
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
