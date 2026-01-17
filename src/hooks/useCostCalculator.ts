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

        if (method === 'TMDT') {
            // TMDT Logic
            const tier = pricingData.tmdt_shipping.find(
                t => total_product_vnd >= t.min_value && total_product_vnd <= t.max_value
            ) || pricingData.tmdt_shipping[pricingData.tmdt_shipping.length - 1];

            if (tier) {
                service_fee_percent = tier.fee_percent;
                shipping_rate_vnd = warehouse === 'HN' ? tier.hn_actual : tier.hcm_actual;
            }
        } else if (method === 'ChinhNgach') {
            // Official Logic (Heavy)
            // Service fee for Official is typically different, but the image shows "Phí ủy thác: 1%..." 
            // The user request images didn't specify a service fee table for Official, only shipping.
            // However, the second image explicitly says "Phí ủy thác: 1% giá trị tổng invoice".
            // We will use 1% as the service fee for Official method as per the image text.
            // "Lưu ý: đối với invoice dưới 30tr mặc định thu ủy thác 300k/ 1 mục khai"

            // Logic for Service Fee (Delegate Fee)
            if (total_product_vnd < 30_000_000) {
                // If 1% is less than 300k, we need to handle this?
                // Text says "mặc định thu ủy thác 300k". 
                // But 1% of 30M is 300k. So for anything < 30M, 1% is < 300k.
                // So if < 30M, fee is fixed 300,000 VND (effectively).
                // Converting fixed fee to percent for display might be weird, so we might need to adjust logic.
                // For now, let's just calculate the value.
                service_fee_percent = 0; // It's a fixed fee
            } else {
                service_fee_percent = 1;
            }

            // Shipping Rate (Heavy Table)
            // Use heavy table as default since we only have weight
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
                service_fee_percent = tier.fee_percent;
                // Note: The image distinguishes Actual vs Converted for Normal.
                // Since we only have `total_weight_kg` (which is sum of product weights), 
                // we'll assume it's "Actual" for now unless we add volume fields.
                // If we want to support converted, we'd need volume inputs.
                // Using "Actual" columns:
                shipping_rate_vnd = warehouse === 'HN' ? tier.hn_actual : tier.hcm_actual;
            }
        }

        let service_fee_vnd = total_product_vnd * (service_fee_percent / 100);

        // Special override for Official Line small orders (delegate fee)
        if (method === 'ChinhNgach' && total_product_vnd < 30_000_000 && total_product_vnd > 0) {
            service_fee_vnd = 300_000;
            // Recalculate percent for display
            service_fee_percent = (service_fee_vnd / total_product_vnd) * 100;
        }

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
