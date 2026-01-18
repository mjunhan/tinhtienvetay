'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { useUpdateServiceFee } from '@/hooks/useAdminMutations';
import { serviceFeeSchema, type ServiceFeeFormData } from '@/schemas/admin';
import type { ServiceFeeRule } from '@/types/database.types';
import { SHIPPING_METHOD_LABELS } from '@/types';

interface EditServiceFeeDialogProps {
    open: boolean;
    onClose: () => void;
    serviceFee: ServiceFeeRule;
}

export function EditServiceFeeDialog({
    open,
    onClose,
    serviceFee,
}: EditServiceFeeDialogProps) {
    const updateServiceFee = useUpdateServiceFee();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ServiceFeeFormData>({
        // @ts-ignore - z.coerce.number() causes type issues with zodResolver but works at runtime
        resolver: zodResolver(serviceFeeSchema),
        defaultValues: {
            min_order_value: serviceFee.min_order_value,
            max_order_value: serviceFee.max_order_value,
            deposit_percent: serviceFee.deposit_percent,
            fee_percent: serviceFee.fee_percent,
        },
    });

    // Reset form when dialog opens with new data
    useEffect(() => {
        if (open) {
            reset({
                min_order_value: serviceFee.min_order_value,
                max_order_value: serviceFee.max_order_value,
                deposit_percent: serviceFee.deposit_percent,
                fee_percent: serviceFee.fee_percent,
            });
        }
    }, [open, serviceFee, reset]);

    const onSubmit = async (data: ServiceFeeFormData) => {
        try {
            console.log('[EditServiceFeeDialog] 🚀 FORM SUBMIT PAYLOAD:', data);
            console.log('[EditServiceFeeDialog] Submitting:', data);

            await updateServiceFee.mutateAsync({
                id: serviceFee.id,
                data: {
                    min_order_value: data.min_order_value,
                    max_order_value: data.max_order_value,
                    deposit_percent: data.deposit_percent,
                    fee_percent: data.fee_percent,
                },
            });

            toast.success('Đã cập nhật phí dịch vụ thành công!');
            onClose();
        } catch (error: any) {
            console.error('[EditServiceFeeDialog] Submit error:', {
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

    return (
        <Dialog open={open} onClose={onClose} title="Chỉnh sửa phí dịch vụ">
            {/* @ts-ignore - z.coerce type inference causes handleSubmit type mismatch */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Method Display */}
                <div>
                    <Label>Phương thức</Label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                        {SHIPPING_METHOD_LABELS[serviceFee.method]}
                    </div>
                </div>

                {/* Min Order Value */}
                <div>
                    <Label htmlFor="min_order_value" required>
                        Giá trị đơn hàng tối thiểu (VND)
                    </Label>
                    <Controller
                        control={control}
                        name="min_order_value"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <Input
                                {...fieldProps}
                                id="min_order_value"
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
                    {errors.min_order_value && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.min_order_value.message}
                        </p>
                    )}
                </div>

                {/* Max Order Value */}
                <div>
                    <Label htmlFor="max_order_value" required>
                        Giá trị đơn hàng tối đa (VND)
                    </Label>
                    <Controller
                        control={control}
                        name="max_order_value"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <Input
                                {...fieldProps}
                                id="max_order_value"
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
                    {errors.max_order_value && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.max_order_value.message}
                        </p>
                    )}
                </div>

                {/* Deposit Percent */}
                <div>
                    <Label htmlFor="deposit_percent" required>
                        Đặt cọc (%)
                    </Label>
                    <Controller
                        control={control}
                        name="deposit_percent"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <select
                                {...fieldProps}
                                id="deposit_percent"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={value}
                                onChange={(e) => onChange(Number(e.target.value))}
                            >
                                <option value={70}>70%</option>
                                <option value={80}>80%</option>
                            </select>
                        )}
                    />
                    {errors.deposit_percent && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.deposit_percent.message}
                        </p>
                    )}
                </div>

                {/* Fee Percent */}
                <div>
                    <Label htmlFor="fee_percent" required>
                        Phí dịch vụ (%)
                    </Label>
                    <Controller
                        control={control}
                        name="fee_percent"
                        render={({ field: { onChange, value, ...fieldProps } }) => (
                            <Input
                                {...fieldProps}
                                id="fee_percent"
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
                    {errors.fee_percent && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.fee_percent.message}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={updateServiceFee.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateServiceFee.isPending && (
                            <Loader2 size={18} className="animate-spin" />
                        )}
                        {updateServiceFee.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={updateServiceFee.isPending}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </Dialog>
    );
}
