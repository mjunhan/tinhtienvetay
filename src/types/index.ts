export type Warehouse = 'HN' | 'HCM';
export type ShippingMethod = 'TMDT' | 'TieuNgach' | 'ChinhNgach';
export type DepositPercent = 70 | 80;

export interface Product {
  id: string;
  quantity: number;
  price_cny: number;
  negotiated_price_cny?: number;
  weight_kg?: number;
  name?: string;
  image_url?: string;
  link?: string;
}

export interface OrderDetails {
  warehouse: Warehouse;
  method: ShippingMethod;
  deposit: DepositPercent;
  products: Product[];
  internal_ship_cny?: number;
  customerName?: string;
  customerPhone?: string;
}

export interface CostBreakdown {
  total_product_cny: number;
  total_product_vnd: number;
  exchange_rate: number;

  service_fee_percent: number;
  service_fee_vnd: number;

  total_weight_kg: number;
  shipping_rate_vnd: number;
  int_shipping_fee_vnd: number;

  internal_ship_vnd: number;

  total_landed_cost: number;
  deposit_amount: number;
  remaining_amount: number;

  avg_price_per_unit_vnd: number;
}

export interface NormalShippingTier {
  min_value: number;
  max_value: number;
  fee_percent: number;
  hn_actual: number;
  hn_converted: number;
  hcm_actual: number;
  hcm_converted: number;
}

export interface TMDTShippingTier {
  min_value: number;
  max_value: number;
  fee_percent: number;
  hn_actual: number;
  hcm_actual: number;
}

export interface OfficialShippingTier {
  min_weight?: number;
  max_weight?: number;
  min_volume?: number;
  max_volume?: number;
  price_hn: number;
  price_hcm: number;
}

export interface PricingConfig {
  exchange_rate: number;
  normal_shipping: NormalShippingTier[];
  tmdt_shipping: TMDTShippingTier[];
  official_shipping: {
    heavy: OfficialShippingTier[];
    bulky: OfficialShippingTier[];
  };
}
