import { z } from 'zod';

export const productSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    link: z.string().optional(),
    quantity: z.number().min(1, 'Số lượng tối thiểu là 1'),
    price_cny: z.number().min(0, 'Giá tệ không được âm'),
    internal_ship_cny: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(0).optional()
    ),
    weight_kg: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
        z.number().min(0).optional()
    ),
    dimensions: z.object({
        length: z.preprocess(
            (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
            z.number().min(0.1, 'Chiều dài phải > 0').optional()
        ),
        width: z.preprocess(
            (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
            z.number().min(0.1, 'Chiều rộng phải > 0').optional()
        ),
        height: z.preprocess(
            (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
            z.number().min(0.1, 'Chiều cao phải > 0').optional()
        ),
    }).optional(),
});

export const calculatorSchema = z.object({
    warehouse: z.enum(['HN', 'HCM']),
    method: z.enum(['TMDT', 'TieuNgach', 'ChinhNgach']),
    deposit: z.literal(70).or(z.literal(80)),
    products: z.array(productSchema).min(1, 'Cần ít nhất 1 sản phẩm'),
    customerName: z.string().min(1, 'Vui lòng nhập họ tên'),
    customerPhone: z.string().regex(/^(0|84)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
    bot_check: z.string().optional(), // Honeypot field
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;
