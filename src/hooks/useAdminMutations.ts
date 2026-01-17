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
            const { data: result, error } = await supabase
                .from('service_fee_rules')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            // Invalidate all related queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['service-fees'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
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
            const { data: result, error } = await supabase
                .from('shipping_rate_rules')
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            // Invalidate all related queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
        },
    });
}
