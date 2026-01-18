import { useMemo } from 'react';
import { OrderDetails, CostBreakdown, PricingConfig } from '@/types';

// Helper function to calculate dimensional weight (kg) from dimensions (cm)
// Formula: (L × W × H) / 6000
function calculateDimensionalWeight(dimensions?: { length: number; width: number; height: number }): number {
    if (!dimensions) return 0;
    const { length, width, height } = dimensions;
    if (!length || !width || !height || length <= 0 || width <= 0 || height <= 0) return 0;
    return (length * width * height) / 6000;
}

// Helper function to calculate volume (m³) from dimensions (cm)
// Formula: (L × W × H) / 1,000,000
function calculateVolume(dimensions?: { length: number; width: number; height: number }): number {
    if (!dimensions) return 0;
    const { length, width, height } = dimensions;
    if (!length || !width || !height || length <= 0 || width <= 0 || height <= 0) return 0;
    return (length * width * height) / 1_000_000;
}

export function useCostCalculator(details: OrderDetails, pricingData?: PricingConfig): CostBreakdown {
    return useMemo(() => {
        const {
            warehouse,
            method,
            deposit,
            products,
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
        let sum_dimensional_weight = 0;
        let sum_volume_m3 = 0;
        let sum_internal_ship_cny = 0;

        products.forEach((p) => {
            const price = p.price_cny || 0;

            total_product_cny += price * (p.quantity || 0);
            sum_product_weight += (p.weight_kg || 0) * (p.quantity || 0);
            total_items += (p.quantity || 0);

            // Calculate dimensional weight and volume for each product
            const dimWeight = calculateDimensionalWeight(p.dimensions);
            const volume = calculateVolume(p.dimensions);

            sum_dimensional_weight += dimWeight * (p.quantity || 0);
            sum_volume_m3 += volume * (p.quantity || 0);

            // Sum internal shipping (per product line)
            sum_internal_ship_cny += (p.internal_ship_cny || 0);
        });

        const total_weight_kg = sum_product_weight;
        const exchange_rate = pricingData.exchange_rate;
        const total_product_vnd = total_product_cny * exchange_rate;
        const internal_ship_vnd = sum_internal_ship_cny * exchange_rate;

        // 2. Pricing Logic
        let service_fee_percent = 0;
        let shipping_rate_vnd = 0;
        let int_shipping_fee_vnd = 0;

        // Optional dimensional/volume breakdown fields
        let dimensional_weight: number | undefined;
        let real_weight_cost: number | undefined;
        let dimensional_weight_cost: number | undefined;
        let volume_m3: number | undefined;
        let volume_rate_vnd: number | undefined;
        let heavy_cost: number | undefined;
        let bulky_cost: number | undefined;

        // --- GLOBAL SERVICE FEE LOGIC (Applied to ALL methods) ---
        const isHighDeposit = deposit >= 80;

        if (total_product_vnd < 2_000_000) {
            service_fee_percent = isHighDeposit ? 3 : 5;
        } else if (total_product_vnd >= 2_000_000 && total_product_vnd <= 5_000_000) {
            service_fee_percent = isHighDeposit ? 1.5 : 2;
        } else {
            service_fee_percent = isHighDeposit ? 1.2 : 1.5;
        }

        // --- SHIPPING RATE LOGIC ---
        if (method === 'TMDT') {
            // TMDT Logic: Use Actual Weight only
            const tier = pricingData.tmdt_shipping.find(
                t => total_product_vnd >= t.min_value && total_product_vnd <= t.max_value
            ) || pricingData.tmdt_shipping[pricingData.tmdt_shipping.length - 1];

            if (tier) {
                shipping_rate_vnd = warehouse === 'HN' ? tier.hn_actual : tier.hcm_actual;
            }

            int_shipping_fee_vnd = total_weight_kg * shipping_rate_vnd;

        } else if (method === 'ChinhNgach') {
            // ChinhNgach Logic: Compare Weight-based vs Volume-based

            // Get weight-based rate (heavy)
            const heavyTier = pricingData.official_shipping.heavy.find(
                t => {
                    const min = t.min_weight ?? 0;
                    const max = t.max_weight ?? Number.MAX_VALUE;
                    return total_weight_kg >= min && total_weight_kg < max;
                }
            ) || pricingData.official_shipping.heavy[pricingData.official_shipping.heavy.length - 1];

            const ratePerKg = heavyTier ? (warehouse === 'HN' ? heavyTier.price_hn : heavyTier.price_hcm) : 0;

            // Get volume-based rate (bulky)
            const bulkyTier = pricingData.official_shipping.bulky.find(
                t => {
                    const min = t.min_volume ?? 0;
                    const max = t.max_volume ?? Number.MAX_VALUE;
                    return sum_volume_m3 >= min && sum_volume_m3 < max;
                }
            ) || pricingData.official_shipping.bulky[pricingData.official_shipping.bulky.length - 1];

            const ratePerM3 = bulkyTier ? (warehouse === 'HN' ? bulkyTier.price_hn : bulkyTier.price_hcm) : 0;

            // Calculate both costs
            const costHeavy = total_weight_kg * ratePerKg;
            const costBulky = sum_volume_m3 * ratePerM3;

            // Use the higher cost
            int_shipping_fee_vnd = Math.max(costHeavy, costBulky);
            shipping_rate_vnd = int_shipping_fee_vnd > 0 ? (costHeavy > costBulky ? ratePerKg : ratePerM3) : 0;

            // Store breakdown for display
            volume_m3 = sum_volume_m3;
            volume_rate_vnd = ratePerM3;
            heavy_cost = costHeavy;
            bulky_cost = costBulky;

        } else {
            // TieuNgach Logic: Compare Real Weight vs Dimensional Weight
            const tier = pricingData.normal_shipping.find(
                t => total_product_vnd >= t.min_value && total_product_vnd <= t.max_value
            ) || pricingData.normal_shipping[pricingData.normal_shipping.length - 1];

            if (tier) {
                shipping_rate_vnd = warehouse === 'HN' ? tier.hn_actual : tier.hcm_actual;
            }

            // Calculate costs for both real and dimensional weight
            const costReal = total_weight_kg * shipping_rate_vnd;
            const costDim = sum_dimensional_weight * shipping_rate_vnd;

            // Use the higher cost
            int_shipping_fee_vnd = Math.max(costReal, costDim);

            // Store breakdown for display
            dimensional_weight = sum_dimensional_weight;
            real_weight_cost = costReal;
            dimensional_weight_cost = costDim;
        }

        let service_fee_vnd = total_product_vnd * (service_fee_percent / 100);

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
            avg_price_per_unit_vnd,
            // Optional breakdown fields
            dimensional_weight,
            real_weight_cost,
            dimensional_weight_cost,
            volume_m3,
            volume_rate_vnd,
            heavy_cost,
            bulky_cost,
        };
    }, [details, pricingData]);
}
