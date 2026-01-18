import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Category, CategoryInsert, CategoryUpdate, Tag, TagInsert } from '@/types/database.types';
import { toast } from 'sonner';

// Categories Hooks
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            return data as Category[];
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (category: CategoryInsert) => {
            const { data, error } = await supabase
                .from('categories')
                .insert(category)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Đã tạo danh mục mới');
        },
        onError: (error) => {
            console.error('Create category error:', error);
            toast.error('Lỗi khi tạo danh mục');
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: CategoryUpdate & { id: string }) => {
            const { data, error } = await supabase
                .from('categories')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Đã cập nhật danh mục');
        },
        onError: (error) => {
            console.error('Update category error:', error);
            toast.error('Lỗi khi cập nhật danh mục');
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Đã xóa danh mục');
        },
        onError: (error) => {
            console.error('Delete category error:', error);
            toast.error('Lỗi khi xóa danh mục');
        },
    });
};

// Tags Hooks
export const useTags = () => {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tags')
                .select('*')
                .order('name');

            if (error) throw error;
            return data as Tag[];
        },
    });
};

export const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tag: TagInsert) => {
            const { data, error } = await supabase
                .from('tags')
                .insert(tag)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            // Should be silent if used in auto-create
        },
    });
};
