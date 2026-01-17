import { z } from 'zod';

/**
 * Validation schema for editing global settings
 */
export const globalSettingsSchema = z.object({
    exchange_rate: z.string()
        .min(1, "Exchange rate is required")
        .regex(/^\d+(\.\d+)?$/, "Must be a valid number"),
    hotline: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^0\d{9,10}$/, "Invalid Vietnamese phone number format"),
    zalo_link: z.string()
        .url("Invalid URL format")
        .min(1, "Zalo link is required"),
});

export type GlobalSettingsFormData = z.infer<typeof globalSettingsSchema>;

/**
 * Validation schema for editing service fee rules
 */
export const serviceFeeSchema = z.object({
    min_order_value: z.number()
        .min(0, "Minimum order value cannot be negative"),
    max_order_value: z.number()
        .min(0, "Maximum order value cannot be negative"),
    deposit_percent: z.union([z.literal(70), z.literal(80)], {
        message: "Deposit percent must be either 70 or 80",
    }),
    fee_percent: z.number()
        .min(0, "Fee percent cannot be negative")
        .max(100, "Fee percent cannot exceed 100"),
}).refine(
    (data) => data.min_order_value <= data.max_order_value,
    {
        message: "Minimum value cannot be greater than maximum value",
        path: ["max_order_value"],
    }
);

export type ServiceFeeFormData = z.infer<typeof serviceFeeSchema>;

/**
 * Validation schema for editing shipping rate rules
 */
export const shippingRateSchema = z.object({
    min_value: z.number()
        .min(0, "Minimum value cannot be negative"),
    max_value: z.number()
        .min(0, "Maximum value cannot be negative"),
    price: z.number()
        .min(0, "Price cannot be negative"),
}).refine(
    (data) => data.min_value <= data.max_value,
    {
        message: "Minimum value cannot be greater than maximum value",
        path: ["max_value"],
    }
);

export type ShippingRateFormData = z.infer<typeof shippingRateSchema>;
