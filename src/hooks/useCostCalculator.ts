import { useState, useMemo } from 'react';
import { OrderDetails, CostBreakdown } from '@/types';
import { MOCK_EXCHANGE_RATE, MOCK_SHIPPING_RATES, MOCK_SERVICE_FEES } from '@/lib/constants';

export function useCostCalculator(details: OrderDetails): CostBreakdown {
    return useMemo(() => {
        const {
            warehouse,
            method,
            deposit,
            products,
            internal_ship_cny,
        } = details;

        // 1. Calculate Product Totals
        let total_product_cny = 0;
        let total_items = 0;
        let sum_product_weight = 0;

        products.forEach((p) => {
            // Use negotiated price if available, otherwise web price
            const price = (p.negotiated_price_cny && p.negotiated_price_cny > 0)
                ? p.negotiated_price_cny
                : (p.price_cny || 0);

            total_product_cny += price * (p.quantity || 0);
            sum_product_weight += (p.weight_kg || 0) * (p.quantity || 0);
            total_items += (p.quantity || 0);
        });

        // Use manually entered total weight if valid (>0), else sum of products
        const total_weight_kg = sum_product_weight;

        const exchange_rate = MOCK_EXCHANGE_RATE;
        const total_product_vnd = total_product_cny * exchange_rate;
        const internal_ship_vnd = (internal_ship_cny || 0) * exchange_rate;

        // 2. Calculate Service Fee
        const feeConfig = MOCK_SERVICE_FEES.find(
            (f) =>
                total_product_vnd >= f.min_order_value &&
                total_product_vnd < f.max_order_value &&
                f.deposit_percent === deposit
        );

        const service_fee_percent = feeConfig ? feeConfig.fee_percent : 3.0;
        const service_fee_vnd = total_product_vnd * (service_fee_percent / 100);

        // 3. Calculate International Shipping
        const shippingRateConfig = MOCK_SHIPPING_RATES.find(
            (r) => r.warehouse_loc === warehouse && r.shipping_method === method
        );

        // Default fallback
        const shipping_rate_vnd = shippingRateConfig ? shippingRateConfig.price_per_kg : 30000;
        const int_shipping_fee_vnd = total_weight_kg * shipping_rate_vnd;

        // 4. Final Totals
        const total_landed_cost =
            total_product_vnd +
            service_fee_vnd +
            internal_ship_vnd +
            int_shipping_fee_vnd;

        const deposit_amount = total_product_vnd * (deposit / 100);
        const remaining_amount = total_landed_cost - deposit_amount;

        // Calculate Average Price Per Unit
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
    }, [details]);
}
