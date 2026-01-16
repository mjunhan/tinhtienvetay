import { ShippingRate, ServiceFee } from "@/types";

export const MOCK_EXCHANGE_RATE = 3960;

export const MOCK_SHIPPING_RATES: ShippingRate[] = [
    // HN Rates
    { id: '1', warehouse_loc: 'HN', shipping_method: 'TMDT', price_per_kg: 28000 },
    { id: '2', warehouse_loc: 'HN', shipping_method: 'TieuNgach', price_per_kg: 25000 },
    { id: '3', warehouse_loc: 'HN', shipping_method: 'ChinhNgach', price_per_kg: 22000 },

    // HCM Rates
    { id: '4', warehouse_loc: 'HCM', shipping_method: 'TMDT', price_per_kg: 33000 },
    { id: '5', warehouse_loc: 'HCM', shipping_method: 'TieuNgach', price_per_kg: 30000 },
    { id: '6', warehouse_loc: 'HCM', shipping_method: 'ChinhNgach', price_per_kg: 28000 },
];

export const MOCK_SERVICE_FEES: ServiceFee[] = [
    // Min 0, Max 10M
    { id: '1', min_order_value: 0, max_order_value: 10_000_000, deposit_percent: 70, fee_percent: 5.0 },
    { id: '2', min_order_value: 0, max_order_value: 10_000_000, deposit_percent: 80, fee_percent: 4.5 },

    // 10M - 50M
    { id: '3', min_order_value: 10_000_000, max_order_value: 50_000_000, deposit_percent: 70, fee_percent: 4.0 },
    { id: '4', min_order_value: 10_000_000, max_order_value: 50_000_000, deposit_percent: 80, fee_percent: 3.5 },

    // 50M - 200M
    { id: '5', min_order_value: 50_000_000, max_order_value: 200_000_000, deposit_percent: 70, fee_percent: 3.0 },
    { id: '6', min_order_value: 50_000_000, max_order_value: 200_000_000, deposit_percent: 80, fee_percent: 2.5 },

    // 200M+
    { id: '7', min_order_value: 200_000_000, max_order_value: 999_999_999_999, deposit_percent: 70, fee_percent: 2.5 },
    { id: '8', min_order_value: 200_000_000, max_order_value: 999_999_999_999, deposit_percent: 80, fee_percent: 2.0 },
];
