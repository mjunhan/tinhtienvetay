'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useUpdateShippingRate } from '@/hooks/useAdminMutations';
import { shippingRateSchema, type ShippingRateFormData } from '@/schemas/admin';
import type { ShippingRateRule } from '@/types/database.types';
import { SHIPPING_METHOD_LABELS } from '@/types';

interface EditShippingRateDialogProps {
    open: boolean;
    onClose: () => void;
    shippingRate: ShippingRateRule;
}

export function EditShippingRateDialog({
    open,
    onClose,
    shippingRate,
}: EditShippingRateDialogProps) {
    const updateShippingRate = useUpdateShippingRate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ShippingRateFormData>({
        // @ts-ignore - z.coerce.number() causes type inference issues with zodResolver, but works at runtime
        resolver: zodResolver(shippingRateSchema),
        defaultValues: {
            min_value: shippingRate.min_value,
            max_value: shippingRate.max_value,
            price: shippingRate.price,
        },
    });

    // Reset form when dialog opens with new data
    useEffect(() => {
        if (open) {
            reset({
                min_value: shippingRate.min_value,
                max_value: shippingRate.max_value,
                price: shippingRate.price,
            });
        }
    }, [open, shippingRate, reset]);

    const onSubmit = async (data: ShippingRateFormData) => {
        try {
            console.log('[EditShippingRateDialog] 🚀 FORM SUBMIT PAYLOAD:', data);
            console.log('[EditShippingRateDialog] Submitting:', data);

            await updateShippingRate.mutateAsync({
                id: shippingRate.id,
                data: {
                    min_value: data.min_value,
                    max_value: data.max_value,
                    price: data.price,
                },
            });

            toast.success('Đã cập nhật phí vận chuyển thành công!');
            onClose();
        } catch (error: any) {
            console.error('[EditShippingRateDialog] Submit error:', {
                error,
                message: error?.message,
                code: error?.code,
                statusCode: error?.status,
                formData: data,
            });

            // Provide more specific error messages based on error type
            if (error?.code === 'PGRST301' || error?.status === 401) {
                toast.error('Lỗi phân quyền: Bạn không có quyền chỉnh sửa.');
            } else if (error?.code === '23505') {
                toast.error('Lỗi: Giá trị trùng lặp trong hệ thống.');
            } else {
                toast.error(`Lỗi khi cập nhật: ${error?.message || 'Vui lòng thử lại.'}`);
            }
        }
    };

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    // Get unit based on type
    const getUnit = () => {
        if (shippingRate.type === 'value_based') return 'VND';
        if (shippingRate.type === 'weight_based') return 'kg';
        if (shippingRate.type === 'volume_based') return 'm³';
        return '';
    };

    const getPriceUnit = () => {
        if (shippingRate.type === 'weight_based') return 'VND/kg';
        if (shippingRate.type === 'volume_based') return 'VND/m³';
        return 'VND';
    };

    const getTypeLabel = () => {
        if (shippingRate.type === 'value_based') return 'Theo giá trị đơn hàng';
        if (shippingRate.type === 'weight_based') return 'Theo trọng lượng';
        if (shippingRate.type === 'volume_based') return 'Theo thể tích';
        return shippingRate.type;
    };

    return (
        <Dialog open={open} onClose={onClose} title="Chỉnh sửa phí vận chuyển">
            {/* @ts-ignore - z.coerce type inference causes handleSubmit type mismatch */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Method & Type Display */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Phương thức</Label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                            {SHIPPING_METHOD_LABELS[shippingRate.method]}
                        </div>
                    </div>
                    <div>
                        <Label>Kho</Label>
                        <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                            {shippingRate.warehouse}
                        </div>
                    </div>
                </div>

                <div>
                    <Label>Loại phí</Label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                        {getTypeLabel()}
                        {shippingRate.subtype && ` - ${shippingRate.subtype === 'heavy' ? 'Cồng kềnh' : 'Thể tích'}`}
                    </div>
                </div>

                {/* Min Value */}
                <div>
                    <Label htmlFor="min_value" required>
                        Giá trị tối thiểu ({getUnit()})
                    </Label>
                    <Controller
                        control={control}
                        name="min_value"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <Input
                                {...fieldProps}
                                id="min_value"
                                type="number"
                                step="any"
                                placeholder="0"
                                value={value ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    onChange(val === '' ? 0 : Number(val));
                                }}
                            />
                        )}
                    />
                    {errors.min_value && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.min_value.message}
                        </p>
                    )}
                </div>

                {/* Max Value */}
                <div>
                    <Label htmlFor="max_value" required>
                        Giá trị tối đa ({getUnit()})
                    </Label>
                    <Controller
                        control={control}
                        name="max_value"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <Input
                                {...fieldProps}
                                id="max_value"
                                type="number"
                                step="any"
                                placeholder="999999999"
                                value={value ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    onChange(val === '' ? 0 : Number(val));
                                }}
                            />
                        )}
                    />
                    {errors.max_value && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.max_value.message}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <Label htmlFor="price" required>
                        Giá (VND/{getUnit()})
                    </Label>
                    <Controller
                        control={control}
                        name="price"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <Input
                                {...fieldProps}
                                id="price"
                                type="number"
                                step="any"
                                placeholder="0"
                                value={value ?? ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    onChange(val === '' ? 0 : Number(val));
                                }}
                            />
                        )}
                    />
                    {errors.price && (
                        <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={updateShippingRate.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateShippingRate.isPending && (
                            <Loader2 size={18} className="animate-spin" />
                        )}
                        {updateShippingRate.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={updateShippingRate.isPending}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </Dialog>
    );
}
