import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PricingConfig } from '@/types';
import type { GlobalSetting, ServiceFeeRule, ShippingRateRule } from '@/types/database.types';

/**
 * Fetches all pricing data from Supabase and transforms it into PricingConfig format
 * This hook is used by the Calculator to get real-time pricing
 */
export function usePricingRules() {
    return useQuery<PricingConfig>({
        queryKey: ['pricing'],
        queryFn: async () => {
            // If Supabase is not configured, return empty/default values
            if (!isSupabaseConfigured) {
                console.warn(
                    'Supabase is not configured. Please add your credentials to .env.local and follow SUPABASE_SETUP.md'
                );
                // Return default fallback data
                return {
                    exchange_rate: 3960,
                    normal_shipping: [],
                    tmdt_shipping: [],
                    official_shipping: {
                        heavy: [],
                        bulky: [],
                    },
                };
            }

            // Fetch all pricing data in parallel
            const [
                { data: settings, error: settingsError },
                { data: serviceFees, error: serviceFeesError },
                { data: shippingRates, error: shippingRatesError },
            ] = await Promise.all([
                supabase.from('global_settings').select('*'),
                supabase.from('service_fee_rules').select('*'),
                supabase.from('shipping_rate_rules').select('*'),
            ]);

            if (settingsError) throw settingsError;
            if (serviceFeesError) throw serviceFeesError;
            if (shippingRatesError) throw shippingRatesError;

            // Extract exchange rate
            const exchangeRateSetting = (settings as GlobalSetting[] || []).find(
                (s) => s.key === 'exchange_rate'
            );
            const exchangeRate = exchangeRateSetting
                ? parseFloat(exchangeRateSetting.value)
                : 3960;

            // Transform shipping data to legacy PricingConfig format
            const shippingRulesTyped = shippingRates as ShippingRateRule[] || [];

            // Build normal_shipping (TieuNgach value-based)
            const normalShipping = shippingRulesTyped
                .filter((r) => r.method === 'TieuNgach' && r.type === 'value_based')
                .reduce((acc, rule) => {
                    const existing = acc.find(
                        (tier) =>
                            tier.min_value === rule.min_value &&
                            tier.max_value === rule.max_value
                    );

                    if (existing) {
                        // Add warehouse-specific rates to existing tier
                        if (rule.warehouse === 'HN') {
                            existing.hn_actual = rule.price;
                            existing.hn_converted = rule.price; // Simplified - same for now
                            existing.hn_rule_id = rule.id;
                        } else {
                            existing.hcm_actual = rule.price;
                            existing.hcm_converted = rule.price;
                            existing.hcm_rule_id = rule.id;
                        }
                    } else {
                        // Create new tier
                        acc.push({
                            min_value: rule.min_value,
                            max_value: rule.max_value,
                            fee_percent: 0, // Will be filled from service_fee_rules
                            hn_actual: rule.warehouse === 'HN' ? rule.price : 0,
                            hn_converted: rule.warehouse === 'HN' ? rule.price : 0,
                            hcm_actual: rule.warehouse === 'HCM' ? rule.price : 0,
                            hcm_converted: rule.warehouse === 'HCM' ? rule.price : 0,
                            hn_rule_id: rule.warehouse === 'HN' ? rule.id : undefined,
                            hcm_rule_id: rule.warehouse === 'HCM' ? rule.id : undefined,
                        });
                    }

                    return acc;
                }, [] as any[]);

            // Add service fees to normal_shipping tiers (use 70% deposit as default)
            const serviceFeesTyped = serviceFees as ServiceFeeRule[] || [];
            normalShipping.forEach((tier: any) => {
                const matchingFee = serviceFeesTyped.find(
                    (sf) =>
                        sf.method === 'TieuNgach' &&
                        sf.deposit_percent === 80 &&
                        tier.min_value >= sf.min_order_value &&
                        tier.max_value <= sf.max_order_value
                );
                if (matchingFee) {
                    tier.fee_percent = matchingFee.fee_percent;
                    tier.fee_rule_id = matchingFee.id;
                }
            });

            // Build tmdt_shipping (same logic as normal_shipping)
            const tmdtShipping = shippingRulesTyped
                .filter((r) => r.method === 'TMDT' && r.type === 'value_based')
                .reduce((acc, rule) => {
                    const existing = acc.find(
                        (tier) =>
                            tier.min_value === rule.min_value &&
                            tier.max_value === rule.max_value
                    );

                    if (existing) {
                        if (rule.warehouse === 'HN') {
                            existing.hn_actual = rule.price;
                            existing.hn_rule_id = rule.id;
                        } else {
                            existing.hcm_actual = rule.price;
                            existing.hcm_rule_id = rule.id;
                        }
                    } else {
                        acc.push({
                            min_value: rule.min_value,
                            max_value: rule.max_value,
                            fee_percent: 0,
                            hn_actual: rule.warehouse === 'HN' ? rule.price : 0,
                            hcm_actual: rule.warehouse === 'HCM' ? rule.price : 0,
                            hn_rule_id: rule.warehouse === 'HN' ? rule.id : undefined,
                            hcm_rule_id: rule.warehouse === 'HCM' ? rule.id : undefined,
                        });
                    }

                    return acc;
                }, [] as any[]); // Using any for temp flexibility, should be PricingConfig['tmdt_shipping'] enhanced

            // Add service fees to TMDT tiers
            tmdtShipping.forEach((tier: any) => {
                const matchingFee = serviceFeesTyped.find(
                    (sf) =>
                        sf.method === 'TMDT' &&
                        sf.deposit_percent === 80 &&
                        tier.min_value >= sf.min_order_value &&
                        tier.max_value <= sf.max_order_value
                );
                if (matchingFee) {
                    tier.fee_percent = matchingFee.fee_percent;
                    tier.fee_rule_id = matchingFee.id;
                }
            });

            // Build official_shipping (ChinhNgach heavy and bulky)
            const heavyTiers = shippingRulesTyped
                .filter(
                    (r) =>
                        r.method === 'ChinhNgach' &&
                        r.type === 'weight_based' &&
                        r.subtype === 'heavy'
                )
                .reduce((acc, rule) => {
                    const existing = acc.find(
                        (tier) =>
                            tier.min_weight === rule.min_value &&
                            tier.max_weight === rule.max_value
                    );

                    if (existing) {
                        if (rule.warehouse === 'HN') {
                            existing.price_hn = rule.price;
                        } else {
                            existing.price_hcm = rule.price;
                        }
                    } else {
                        acc.push({
                            min_weight: rule.min_value,
                            max_weight: rule.max_value,
                            price_hn: rule.warehouse === 'HN' ? rule.price : 0,
                            price_hcm: rule.warehouse === 'HCM' ? rule.price : 0,
                        });
                    }

                    return acc;
                }, [] as PricingConfig['official_shipping']['heavy']);

            const bulkyTiers = shippingRulesTyped
                .filter(
                    (r) =>
                        r.method === 'ChinhNgach' &&
                        r.type === 'volume_based' &&
                        r.subtype === 'bulky'
                )
                .reduce((acc, rule) => {
                    const existing = acc.find(
                        (tier) =>
                            tier.min_volume === rule.min_value &&
                            tier.max_volume === rule.max_value
                    );

                    if (existing) {
                        if (rule.warehouse === 'HN') {
                            existing.price_hn = rule.price;
                        } else {
                            existing.price_hcm = rule.price;
                        }
                    } else {
                        acc.push({
                            min_volume: rule.min_value,
                            max_volume: rule.max_value,
                            price_hn: rule.warehouse === 'HN' ? rule.price : 0,
                            price_hcm: rule.warehouse === 'HCM' ? rule.price : 0,
                        });
                    }

                    return acc;
                }, [] as PricingConfig['official_shipping']['bulky']);

            return {
                exchange_rate: exchangeRate,
                normal_shipping: normalShipping.sort((a, b) => a.min_value - b.min_value),
                tmdt_shipping: tmdtShipping.sort((a, b) => a.min_value - b.min_value),
                official_shipping: {
                    heavy: heavyTiers.sort((a, b) => (a.min_weight || 0) - (b.min_weight || 0)),
                    bulky: bulkyTiers.sort((a, b) => (a.min_volume || 0) - (b.min_volume || 0)),
                },
            };
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnMount: true,
    });
}

/**
 * Fetches global settings (exchange rate, hotline, etc.)
 */
export function useGlobalSettings() {
    return useQuery<GlobalSetting[]>({
        queryKey: ['global-settings'],
        queryFn: async () => {
            if (!isSupabaseConfigured) {
                console.warn('Supabase not configured');
                return [];
            }

            const { data, error } = await supabase
                .from('global_settings')
                .select('*');

            if (error) throw error;
            return data as GlobalSetting[];
        },
    });
}

/**
 * Updates a global setting
 */
export function useUpdateGlobalSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ key, value }: { key: string; value: string }) => {
            const { data, error } = await supabase
                .from('global_settings')
                .update({ value })
                .eq('key', key)
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['global-settings'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
        },
    });
}

/**
 * Fetches all shipping rate rules
 */
export function useShippingRateRules() {
    return useQuery<ShippingRateRule[]>({
        queryKey: ['shipping-rates'],
        queryFn: async () => {
            if (!isSupabaseConfigured) {
                console.warn('Supabase not configured');
                return [];
            }

            const { data, error } = await supabase
                .from('shipping_rate_rules')
                .select('*')
                .order('method')
                .order('warehouse')
                .order('min_value');

            if (error) throw error;
            return data as ShippingRateRule[];
        },
    });
}

/**
 * Fetches all service fee rules
 */
export function useServiceFeeRules() {
    return useQuery<ServiceFeeRule[]>({
        queryKey: ['service-fees'],
        queryFn: async () => {
            if (!isSupabaseConfigured) {
                console.warn('Supabase not configured');
                return [];
            }

            const { data, error } = await supabase
                .from('service_fee_rules')
                .select('*')
                .order('method')
                .order('min_order_value');

            if (error) throw error;
            return data as ServiceFeeRule[];
        },
    });
}
