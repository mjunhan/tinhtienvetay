
export const DEFAULT_SERVICE_FEES = [
    // 0 - 2M
    { min_order_value: 0, max_order_value: 2000000, deposit_percent: 70, fee_percent: 5, method: 'TieuNgach' },
    { min_order_value: 0, max_order_value: 2000000, deposit_percent: 100, fee_percent: 3, method: 'TieuNgach' },
    // 2M - 10M
    { min_order_value: 2000000, max_order_value: 10000000, deposit_percent: 70, fee_percent: 4, method: 'TieuNgach' },
    { min_order_value: 2000000, max_order_value: 10000000, deposit_percent: 100, fee_percent: 2.5, method: 'TieuNgach' },
    // > 10M
    { min_order_value: 10000000, max_order_value: 999999999, deposit_percent: 70, fee_percent: 3, method: 'TieuNgach' },
    { min_order_value: 10000000, max_order_value: 999999999, deposit_percent: 100, fee_percent: 2, method: 'TieuNgach' },
];

export const DEFAULT_OFFICIAL_RATES = [
    // Heavy Items (Kg)
    { method: 'ChinhNgach', type: 'weight_based', subtype: 'heavy', warehouse: 'HN', min_value: 70, max_value: 500, price: 8000 },
    { method: 'ChinhNgach', type: 'weight_based', subtype: 'heavy', warehouse: 'HCM', min_value: 70, max_value: 500, price: 10000 },

    { method: 'ChinhNgach', type: 'weight_based', subtype: 'heavy', warehouse: 'HN', min_value: 500, max_value: 1000, price: 7000 },
    { method: 'ChinhNgach', type: 'weight_based', subtype: 'heavy', warehouse: 'HCM', min_value: 500, max_value: 1000, price: 9000 },

    { method: 'ChinhNgach', type: 'weight_based', subtype: 'heavy', warehouse: 'HN', min_value: 1000, max_value: 999999, price: 6000 },
    { method: 'ChinhNgach', type: 'weight_based', subtype: 'heavy', warehouse: 'HCM', min_value: 1000, max_value: 999999, price: 8000 },

    // Bulky Items (m3)
    { method: 'ChinhNgach', type: 'volume_based', subtype: 'bulky', warehouse: 'HN', min_value: 0, max_value: 10, price: 2500000 },
    { method: 'ChinhNgach', type: 'volume_based', subtype: 'bulky', warehouse: 'HCM', min_value: 0, max_value: 10, price: 2800000 },

    { method: 'ChinhNgach', type: 'volume_based', subtype: 'bulky', warehouse: 'HN', min_value: 10, max_value: 999999, price: 2300000 },
    { method: 'ChinhNgach', type: 'volume_based', subtype: 'bulky', warehouse: 'HCM', min_value: 10, max_value: 999999, price: 2600000 },
];

export const DEFAULT_TIEU_NGACH_RATES = [
    { method: 'TieuNgach', type: 'value_based', subtype: 'standard', warehouse: 'HN', min_value: 0, max_value: 2000000, price: 25000 },
    { method: 'TieuNgach', type: 'value_based', subtype: 'standard', warehouse: 'HCM', min_value: 0, max_value: 2000000, price: 30000 },

    { method: 'TieuNgach', type: 'value_based', subtype: 'standard', warehouse: 'HN', min_value: 2000000, max_value: 10000000, price: 20000 },
    { method: 'TieuNgach', type: 'value_based', subtype: 'standard', warehouse: 'HCM', min_value: 2000000, max_value: 10000000, price: 25000 },

    { method: 'TieuNgach', type: 'value_based', subtype: 'standard', warehouse: 'HN', min_value: 10000000, max_value: 999999999, price: 15000 },
    { method: 'TieuNgach', type: 'value_based', subtype: 'standard', warehouse: 'HCM', min_value: 10000000, max_value: 999999999, price: 20000 },
];

export const DEFAULT_TMDT_RATES = [
    { method: 'TMDT', type: 'value_based', subtype: 'standard', warehouse: 'HN', min_value: 0, max_value: 999999999, price: 15000 },
    { method: 'TMDT', type: 'value_based', subtype: 'standard', warehouse: 'HCM', min_value: 0, max_value: 999999999, price: 25000 },
];
