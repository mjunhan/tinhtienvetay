// Database Types for Supabase Tables
// Generated for tinhtienvetay v0.2.0

export interface GlobalSetting {
    key: string;
    value: string;
    description?: string | null;
    updated_at: string;
}

export interface ServiceFeeRule {
    id: string;
    min_order_value: number;
    max_order_value: number;
    deposit_percent: 70 | 80;
    fee_percent: number;
    method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
    created_at: string;
    updated_at: string;
}

export interface ShippingRateRule {
    id: string;
    method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
    warehouse: 'HN' | 'HCM';
    type: 'value_based' | 'weight_based' | 'volume_based';
    min_value: number;
    max_value: number;
    price: number;
    subtype?: 'heavy' | 'bulky' | null;
    created_at: string;
    updated_at: string;
}

// Insert/Update types (without auto-generated fields)
export type GlobalSettingInsert = Omit<GlobalSetting, 'updated_at'>;
export type ServiceFeeRuleInsert = Omit<ServiceFeeRule, 'id' | 'created_at' | 'updated_at'>;
export type ShippingRateRuleInsert = Omit<ShippingRateRule, 'id' | 'created_at' | 'updated_at'>;
