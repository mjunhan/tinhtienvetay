export type Warehouse = 'HN' | 'HCM';
export type ShippingMethod = 'TMDT' | 'TieuNgach' | 'ChinhNgach';
export type DepositPercent = 70 | 80; // 70% or 80%

export interface Product {
  id: string; // generated uuid for list key
  quantity: number;
  price_cny: number; // Web price
  negotiated_price_cny?: number; // Optional deal price
  weight_kg?: number; // Estimated weight per unit (optional if total is used)
  name?: string;
  image_url?: string;
  link?: string;
}

export interface OrderDetails {
  warehouse: Warehouse;
  method: ShippingMethod;
  deposit: DepositPercent;
  products: Product[];
  internal_ship_cny: number; // default 0
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
  shipping_rate_vnd: number; // price per kg
  int_shipping_fee_vnd: number;

  internal_ship_vnd: number; // converted from cny

  total_landed_cost: number; // Final total
  deposit_amount: number; // Amount to deposit
  remaining_amount: number; // Total - Deposit

  avg_price_per_unit_vnd: number; // Helper for display
}

// For DB/Supabase later
export interface GlobalSettings {
  key: string;
  value: number;
  description?: string;
}

export interface ShippingRate {
  id: string;
  warehouse_loc: Warehouse;
  shipping_method: ShippingMethod;
  price_per_kg: number;
}

export interface ServiceFee {
  id: string;
  min_order_value: number;
  max_order_value: number;
  deposit_percent: number;
  fee_percent: number;
}
