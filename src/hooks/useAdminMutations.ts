import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ServiceFeeRule, ShippingRateRule } from '@/types/database.types';

/**
 * Hook to update a service fee rule
 * Invalidates service-fees and pricing queries on success
 */
export function useUpdateServiceFee() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<ServiceFeeRule>;
        }) => {
            console.log('[useUpdateServiceFee] Updating service fee:', { id, data });

            const { data: result, error } = await supabase
                .from('service_fee_rules')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('[useUpdateServiceFee] Supabase error:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                });
                throw error;
            }

            console.log('[useUpdateServiceFee] Update successful:', result);
            return result;
        },
        onSuccess: () => {
            console.log('[useUpdateServiceFee] Invalidating queries...');
            // Invalidate all related queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['service-fees'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
        },
        onError: (error: any) => {
            console.error('[useUpdateServiceFee] Mutation failed:', error);
            // Don't toast here - let the component handle it for more specific messages
        },
    });
}

/**
 * Hook to update a shipping rate rule
 * Invalidates shipping-rates and pricing queries on success
 */
export function useUpdateShippingRate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<ShippingRateRule>;
        }) => {
            console.log('[useUpdateShippingRate] Updating shipping rate:', { id, data });

            const { data: result, error } = await supabase
                .from('shipping_rate_rules')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('[useUpdateShippingRate] Supabase error:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                });
                throw error;
            }

            console.log('[useUpdateShippingRate] Update successful:', result);
            return result;
        },
        onSuccess: () => {
            console.log('[useUpdateShippingRate] Invalidating queries...');
            // Invalidate all related queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
        },
        onError: (error: any) => {
            console.error('[useUpdateShippingRate] Mutation failed:', error);
            // Don't toast here - let the component handle it for more specific messages
        },
    });
}

/**
 * Hook to create a new shipping rate rule
 * Invalidates shipping-rates and pricing queries on success
 */
export function useCreateShippingRate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<ShippingRateRule, 'id' | 'created_at' | 'updated_at'>) => {
            console.log('[useCreateShippingRate] Creating shipping rate:', data);

            const { data: result, error } = await supabase
                .from('shipping_rate_rules')
                .insert(data)
                .select()
                .single();

            if (error) {
                console.error('[useCreateShippingRate] Supabase error:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                });
                throw error;
            }

            console.log('[useCreateShippingRate] Create successful:', result);
            return result;
        },
        onSuccess: () => {
            console.log('[useCreateShippingRate] Invalidating queries...');
            queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
        },
        onError: (error: any) => {
            console.error('[useCreateShippingRate] Mutation failed:', error);
        },
    });
}

