import { Control, useFieldArray, UseFormRegister, FieldErrors, useFormContext } from 'react-hook-form';
import { Plus, Trash2, Package, Ruler } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { CalculatorFormValues } from '@/lib/schemas';
import { motion, AnimatePresence } from 'framer-motion';

interface InputCardProps {
    control: Control<CalculatorFormValues>;
    register: UseFormRegister<CalculatorFormValues>;
    errors: FieldErrors<CalculatorFormValues>;
}

export function InputCard({ control, register, errors }: InputCardProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const { watch } = useFormContext<CalculatorFormValues>();
    const method = watch('method');
    const showDimensions = method === 'TieuNgach' || method === 'ChinhNgach';

    return (
        <div className="space-y-6">
            <Card title="Cấu hình đơn hàng" className="h-full">
                {/* 1. Global Config */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Select
                        label="Kho nhận hàng"
                        {...register('warehouse')}
                        options={[
                            { value: 'HN', label: 'Hà Nội' },
                            { value: 'HCM', label: 'Hồ Chí Minh' },
                        ]}
                    />
                    <Select
                        label="Hình thức vận chuyển"
                        {...register('method')}
                        options={[
                            { value: 'TMDT', label: 'Thương Mại Điện Tử' },
                            { value: 'TieuNgach', label: 'Tiểu Ngạch' },
                            { value: 'ChinhNgach', label: 'Chính Ngạch' },
                        ]}
                    />
                    <Select
                        label="Mức đặt cọc"
                        {...register('deposit', { valueAsNumber: true })}
                        options={[
                            { value: 70, label: '70% (Phí ưu đãi)' },
                            { value: 80, label: '80% (Phí tốt nhất)' },
                        ]}
                    />
                </div>

                {/* 2. Products List */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-text-main">Thông tin sản phẩm</label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => append({ id: crypto.randomUUID(), quantity: 1, price_cny: 0, weight_kg: 0, internal_ship_cny: 0 })}
                            className="text-primary hover:bg-violet-50"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Thêm dòng
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {fields.map((field, index) => (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group"
                                >
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Row 1: Product Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 pr-8">
                                        <Input
                                            placeholder="Link gốc (1688/Taobao...)"
                                            {...register(`products.${index}.link`)}
                                            className="bg-white"
                                        />
                                        <Input
                                            placeholder="Tên sản phẩm / Ghi chú (Optional)"
                                            {...register(`products.${index}.name`)}
                                            className="bg-white"
                                        />
                                    </div>

                                    {/* Row 2: Metrics */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <Input
                                            label="Số lượng"
                                            type="number"
                                            min={1}
                                            suffix="sp"
                                            {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                                            error={errors.products?.[index]?.quantity?.message}
                                            className="bg-white"
                                        />
                                        <div>
                                            <div className="flex items-center mb-1.5">
                                                <label className="text-sm font-medium text-text-main/80">Giá Web (¥)</label>
                                                <Tooltip content="Giá niêm yết trên web Trung." />
                                            </div>
                                            <Input
                                                type="number"
                                                step={0.01}
                                                suffix="¥"
                                                {...register(`products.${index}.price_cny`, { valueAsNumber: true })}
                                                error={errors.products?.[index]?.price_cny?.message}
                                                className="bg-white"
                                            />
                                        </div>
                                        <Input
                                            label="Cân nặng (Kg)"
                                            type="number"
                                            step={0.1}
                                            suffix="kg"
                                            {...register(`products.${index}.weight_kg`, { valueAsNumber: true })}
                                            error={errors.products?.[index]?.weight_kg?.message}
                                            className="bg-white"
                                        />
                                    </div>

                                    {/* Row 3: Shipping & Dimensions */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <div className="flex items-center mb-1.5">
                                                <label className="text-sm font-medium text-text-main/80">Ship nội địa TQ</label>
                                                <span className="ml-1 text-xs text-slate-400 font-normal">(Tùy chọn)</span>
                                            </div>
                                            <Input
                                                type="number"
                                                step={0.01}
                                                suffix="¥"
                                                placeholder="0"
                                                {...register(`products.${index}.internal_ship_cny`, { valueAsNumber: true })}
                                                className="bg-white"
                                            />
                                        </div>

                                        {/* Conditional Dimensions */}
                                        <AnimatePresence>
                                            {showDimensions && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="pt-3 border-t border-slate-200"
                                                >
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Ruler className="w-4 h-4 text-violet-600" />
                                                        <label className="text-sm font-medium text-text-main/80">
                                                            Kích thước kiện hàng (D × R × C) - cm
                                                        </label>
                                                        <span className="text-xs text-slate-400 font-normal">(Không bắt buộc)</span>
                                                        <Tooltip content="Dùng để tính cân quy đổi / thể tích. Bỏ trống nếu không có thông tin." />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <Input
                                                            placeholder="Dài"
                                                            type="number"
                                                            step={0.1}
                                                            suffix="cm"
                                                            {...register(`products.${index}.dimensions.length`, { valueAsNumber: true })}
                                                            error={errors.products?.[index]?.dimensions?.length?.message}
                                                            className="bg-white"
                                                        />
                                                        <Input
                                                            placeholder="Rộng"
                                                            type="number"
                                                            step={0.1}
                                                            suffix="cm"
                                                            {...register(`products.${index}.dimensions.width`, { valueAsNumber: true })}
                                                            error={errors.products?.[index]?.dimensions?.width?.message}
                                                            className="bg-white"
                                                        />
                                                        <Input
                                                            placeholder="Cao"
                                                            type="number"
                                                            step={0.1}
                                                            suffix="cm"
                                                            {...register(`products.${index}.dimensions.height`, { valueAsNumber: true })}
                                                            error={errors.products?.[index]?.dimensions?.height?.message}
                                                            className="bg-white"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {fields.length === 0 && (
                            <div className="text-center py-8 text-text-muted text-sm border-2 border-dashed border-slate-200 rounded-xl">
                                Chưa có sản phẩm nào
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* 4. Contact Info */}
            <Card title="Thông tin liên hệ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Họ và tên"
                        placeholder="Nhập họ tên của bạn"
                        {...register('customerName')}
                        error={errors.customerName?.message}
                    />
                    <Input
                        label="Số điện thoại"
                        placeholder="Nhập số điện thoại (Zalo)"
                        {...register('customerPhone')}
                        error={errors.customerPhone?.message}
                    />
                </div>
            </Card>
        </div >
    );
}
