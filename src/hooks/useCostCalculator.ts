import { useMemo } from 'react';
import { OrderDetails, CostBreakdown, PricingConfig } from '@/types';

export function useCostCalculator(details: OrderDetails, pricingData?: PricingConfig): CostBreakdown {
    return useMemo(() => {
        const {
            warehouse,
            method,
            deposit,
            products,
            internal_ship_cny,
        } = details;

        // Default implementation if no data loaded yet
        if (!pricingData) {
            return {
                total_product_cny: 0,
                total_product_vnd: 0,
                exchange_rate: 0,
                service_fee_percent: 0,
                service_fee_vnd: 0,
                total_weight_kg: 0,
                shipping_rate_vnd: 0,
                int_shipping_fee_vnd: 0,
                internal_ship_vnd: 0,
                total_landed_cost: 0,
                deposit_amount: 0,
                remaining_amount: 0,
                avg_price_per_unit_vnd: 0
            };
        }

        // 1. Calculate Product Totals
        let total_product_cny = 0;
        let total_items = 0;
        let sum_product_weight = 0;

        products.forEach((p) => {
            const price = (p.negotiated_price_cny && p.negotiated_price_cny > 0)
                ? p.negotiated_price_cny
                : (p.price_cny || 0);

            total_product_cny += price * (p.quantity || 0);
            sum_product_weight += (p.weight_kg || 0) * (p.quantity || 0);
            total_items += (p.quantity || 0);
        });

        const total_weight_kg = sum_product_weight;
        const exchange_rate = pricingData.exchange_rate;
        const total_product_vnd = total_product_cny * exchange_rate;
        const internal_ship_vnd = (internal_ship_cny || 0) * exchange_rate;

        // 2. Pricing Logic
        let service_fee_percent = 0;
        let shipping_rate_vnd = 0;

        // --- GLOBAL SERVICE FEE LOGIC (Applied to ALL methods) ---
        // Logic:
        // < 2M: Deposit < 80% (5%), >= 80% (3%)
        // 2M - 5M: Deposit < 80% (2%), >= 80% (1.5%)
        // > 5M: Deposit < 80% (1.5%), >= 80% (1.2%)

        const isHighDeposit = deposit >= 80;

        if (total_product_vnd < 2_000_000) {
            service_fee_percent = isHighDeposit ? 3 : 5;
        } else if (total_product_vnd >= 2_000_000 && total_product_vnd <= 5_000_000) {
            service_fee_percent = isHighDeposit ? 1.5 : 2;
        } else {
            // > 5M
            service_fee_percent = isHighDeposit ? 1.2 : 1.5;
        }

        // --- SHIPPING RATE LOGIC ---
        if (method === 'TMDT') {
            // TMDT Logic
            // STRICT: Use Actual Weight (total_weight_kg) for TMĐT
            const tier = pricingData.tmdt_shipping.find(
                t => total_product_vnd >= t.min_value && total_product_vnd <= t.max_value
            ) || pricingData.tmdt_shipping[pricingData.tmdt_shipping.length - 1];

            if (tier) {
                shipping_rate_vnd = warehouse === 'HN' ? tier.hn_actual : tier.hcm_actual;
            }
        } else if (method === 'ChinhNgach') {
            // Official Logic (Heavy)
            // Note: Official line might have specific delegate fees. 
            // If the user wants the "Global Fee" to replace the 1% fee, we stick to the calculated above.
            // If there's an Override for MIN 300k, we should check if that still applies.
            // Requirement says: "Global Service Fee Policy... applies to all shipping methods".
            // So we will use the tiered percent primarily.
            // However, typically Official Line has a "Delegate Fee" which might be distinct.
            // Given "replace method-specific logic where applicable", I will prioritize the tiered fee.
            // But I will keep the "Min 300k" rule if the calculated fee is excessively low for an Official order?
            // Actually, for Official Line, usually the "Delegate Fee" IS the service fee.
            // The previous requirement (v0.4.1) said "1% min 300k". 
            // The NEW requirement (v0.4.2) says "strictly implement a Global Service Fee Policy... replacing method-specific logic".
            // So I will apply the tiered logic.
            // BUT, if I strictly ignore the 300k min, tiny official orders might be undercharged?
            // "Task 1... ensures logic... applies regardless of selected shipping method".
            // I will strictly follow the NEW instruction. Tiered fee only.

            // Shipping Rate (Heavy Table)
            const tier = pricingData.official_shipping.heavy.find(
                t => {
                    const min = t.min_weight ?? 0;
                    const max = t.max_weight ?? Number.MAX_VALUE;
                    return total_weight_kg >= min && total_weight_kg < max;
                }
            ) || pricingData.official_shipping.heavy[pricingData.official_shipping.heavy.length - 1];

            if (tier) {
                shipping_rate_vnd = warehouse === 'HN' ? tier.price_hn : tier.price_hcm;
            }

        } else {
            // Normal Shipping (TieuNgach)
            const tier = pricingData.normal_shipping.find(
                t => total_product_vnd >= t.min_value && total_product_vnd <= t.max_value
            ) || pricingData.normal_shipping[pricingData.normal_shipping.length - 1];

            if (tier) {
                // Note: Using Actual Weight columns as default
                shipping_rate_vnd = warehouse === 'HN' ? tier.hn_actual : tier.hcm_actual;
            }
        }

        let service_fee_vnd = total_product_vnd * (service_fee_percent / 100);

        // NOTE: Commenting out the old 300k override for Official Line to strictly follow "Global Fee Policy".
        // If the user wants to bring it back, they can verify.
        /*
        if (method === 'ChinhNgach' && total_product_vnd < 30_000_000 && total_product_vnd > 0) {
            service_fee_vnd = 300_000;
            service_fee_percent = (service_fee_vnd / total_product_vnd) * 100;
        }
        */

        const int_shipping_fee_vnd = total_weight_kg * shipping_rate_vnd;

        // 3. Final Totals
        const total_landed_cost =
            total_product_vnd +
            service_fee_vnd +
            internal_ship_vnd +
            int_shipping_fee_vnd;

        const deposit_amount = total_product_vnd * (deposit / 100);
        const remaining_amount = total_landed_cost - deposit_amount;

        const avg_price_per_unit_vnd = total_items > 0 ? total_landed_cost / total_items : 0;

        return {
            total_product_cny,
            total_product_vnd,
            exchange_rate,
            service_fee_percent,
            service_fee_vnd,
            total_weight_kg,
            shipping_rate_vnd,
            int_shipping_fee_vnd,
            internal_ship_vnd,
            total_landed_cost,
            deposit_amount,
            remaining_amount,
            avg_price_per_unit_vnd
        };
    }, [details, pricingData]);
}
