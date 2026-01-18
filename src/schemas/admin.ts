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
 * Controller handles number conversion, schema just validates
 */
const _serviceFeeSchema = z.object({
    min_order_value: z.number()
        .min(0, "Giá trị tối thiểu phải lớn hơn hoặc bằng 0"),
    max_order_value: z.number()
        .min(0, "Giá trị tối đa phải lớn hơn hoặc bằng 0"),
    deposit_percent: z.number()
        .refine((val) => val === 70 || val === 80, {
            message: "Deposit percent must be either 70 or 80",
        }),
    fee_percent: z.number()
        .min(0, "Phí dịch vụ không được âm")
        .max(100, "Phí dịch vụ không được vượt quá 100%"),
}).refine(
    (data) => data.min_order_value <= data.max_order_value,
    {
        message: "Giá trị tối thiểu không được lớn hơn giá trị tối đa",
        path: ["max_order_value"],
    }
);

export const serviceFeeSchema = _serviceFeeSchema as z.ZodType<{
    min_order_value: number;
    max_order_value: number;
    deposit_percent: 70 | 80;
    fee_percent: number;
}>;

export type ServiceFeeFormData = z.output<typeof _serviceFeeSchema>;

/**
 * Validation schema for editing shipping rate rules
 * Controller handles number conversion, schema just validates
 */
const _shippingRateSchema = z.object({
    min_value: z.number()
        .min(0, "Giá trị tối thiểu phải lớn hơn hoặc bằng 0"),
    max_value: z.number()
        .min(0, "Giá trị tối đa phải lớn hơn hoặc bằng 0"),
    price: z.number()
        .min(0, "Giá phải lớn hơn hoặc bằng 0"),
}).refine(
    (data) => data.min_value <= data.max_value,
    {
        message: "Giá trị tối thiểu không được lớn hơn giá trị tối đa",
        path: ["max_value"],
    }
);

export const shippingRateSchema = _shippingRateSchema as z.ZodType<{
    min_value: number;
    max_value: number;
    price: number;
}>;

export type ShippingRateFormData = z.output<typeof _shippingRateSchema>;
