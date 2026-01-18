// Database Types for Supabase Tables
// Generated for tinhtienvetay v0.2.0

export interface GlobalSetting {
    key: string;
    value: string;
    description?: string | null;
    updated_at: string;
}

export interface ServiceFeeRule {
    id: string;
    min_order_value: number;
    max_order_value: number;
    deposit_percent: 70 | 80;
    fee_percent: number;
    method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
    created_at: string;
    updated_at: string;
}

export interface ShippingRateRule {
    id: string;
    method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
    warehouse: 'HN' | 'HCM';
    type: 'value_based' | 'weight_based' | 'volume_based';
    min_value: number;
    max_value: number;
    price: number;
    subtype?: 'heavy' | 'bulky' | null;
    created_at: string;
    updated_at: string;
}

// Insert/Update types (without auto-generated fields)
export type GlobalSettingInsert = Omit<GlobalSetting, 'updated_at'>;
export type ServiceFeeRuleInsert = Omit<ServiceFeeRule, 'id' | 'created_at' | 'updated_at'>;
export type ShippingRateRuleInsert = Omit<ShippingRateRule, 'id' | 'created_at' | 'updated_at'>;

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    created_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;
export type CategoryUpdate = Partial<CategoryInsert>;

export interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export type TagInsert = Omit<Tag, 'id' | 'created_at'>;

export interface PostTag {
    post_id: string;
    tag_id: string;
}

export interface Comment {
    id: string;
    post_id: string;
    user_name: string;
    user_email?: string | null;
    content: string;
    is_approved: boolean;
    created_at: string;
}

export type CommentInsert = Omit<Comment, 'id' | 'created_at' | 'is_approved'>;

// Extended Post type with category
export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    published: boolean;
    thumbnail?: string | null;
    category_id?: string | null;
    category?: Category; // For join queries
    tags?: Tag[]; // For join queries
    created_at: string;
    updated_at: string;
}
