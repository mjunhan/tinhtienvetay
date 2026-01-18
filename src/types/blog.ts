/**
 * Blog Post Types
 * v0.3.0 - Golden Era & Blog CMS
 */

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    thumbnail_url: string | null;
    is_published: boolean;
    category_id?: string | null;
    category?: { id: string; name: string; slug: string };
    tags?: { id: string; name: string; slug: string }[];
    created_at: string;
    updated_at: string;
}

export interface CreatePostInput {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail_url?: string;
    is_published?: boolean;
    category_id?: string;
    tags?: string[];
}

export interface UpdatePostInput {
    id: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    thumbnail_url?: string;
    is_published?: boolean;
    category_id?: string;
    tags?: string[];
}

export type PostFormData = Omit<CreatePostInput, 'slug'> & {
    slug?: string; // Optional during form entry, auto-generated if empty
};
