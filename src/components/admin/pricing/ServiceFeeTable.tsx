import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Plus, Trash2, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ServiceFeeRule } from '@/types/database.types';
import { DEFAULT_SERVICE_FEES } from '@/lib/constants';

interface FeeRow {
    id_low?: string;
    id_high?: string;
    min_order_value: number;
    max_order_value: number;
    fee_percent_low: number; // Deposit < 80% (70%)
    fee_percent_high: number; // Deposit > 80% (100%)
}

interface ServiceFeeTableProps {
    data: ServiceFeeRule[];
    onDataChange: (newData: any[]) => void; // Passing flattened structure back to parent
}

export function ServiceFeeTable({ data, onDataChange }: ServiceFeeTableProps) {
    // 1. Prepare Initial Data
    const initialRows = useMemo(() => {
        const grouped = new Map<string, FeeRow>();
        const sortedData = [...data].sort((a, b) => a.min_order_value - b.min_order_value);

        sortedData.forEach(rule => {
            const key = `${rule.min_order_value}-${rule.max_order_value}`;
            const existing = grouped.get(key) || {
                min_order_value: rule.min_order_value,
                max_order_value: rule.max_order_value,
                fee_percent_low: 0,
                fee_percent_high: 0
            };

            if (rule.deposit_percent < 80) {
                existing.fee_percent_low = rule.fee_percent;
                existing.id_low = rule.id;
            } else {
                existing.fee_percent_high = rule.fee_percent;
                existing.id_high = rule.id;
            }
            grouped.set(key, existing);
        });

        // Use Default if Empty is handled by parent or manual initialization
        return Array.from(grouped.values()).sort((a, b) => a.min_order_value - b.min_order_value);
    }, [data]);

    const { control, register, watch, reset, setValue } = useForm<{ rows: FeeRow[] }>({
        defaultValues: { rows: initialRows }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows"
    });

    // Reset loop
    useEffect(() => {
        // Only reset if strict difference to avoid cursor jumping? 
        // Actually for initial load it's fine.
        if (initialRows.length > 0) {
            reset({ rows: initialRows });
        }
    }, [initialRows, reset]);

    // Live binding back to parent
    useEffect(() => {
        const subscription = watch((value) => {
            if (!value.rows) return;
            // Flatten logic
            const flattened: any[] = [];
            value.rows.forEach((row: any) => {
                if (!row) return;

                // Rule 1: Low Deposit
                flattened.push({
                    id: row.id_low,
                    min_order_value: Number(row.min_order_value),
                    max_order_value: Number(row.max_order_value),
                    deposit_percent: 70,
                    fee_percent: Number(row.fee_percent_low),
                    method: 'TieuNgach'
                });

                // Rule 2: High Deposit
                flattened.push({
                    id: row.id_high,
                    min_order_value: Number(row.min_order_value),
                    max_order_value: Number(row.max_order_value),
                    deposit_percent: 100,
                    fee_percent: Number(row.fee_percent_high),
                    method: 'TieuNgach'
                });
            });
            onDataChange(flattened);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);


    const handleInitialize = () => {
        // Convert default rules to rows
        const grouped = new Map<string, FeeRow>();
        DEFAULT_SERVICE_FEES.forEach(rule => {
            const key = `${rule.min_order_value}-${rule.max_order_value}`;
            const existing = grouped.get(key) || {
                min_order_value: rule.min_order_value,
                max_order_value: rule.max_order_value,
                fee_percent_low: 0,
                fee_percent_high: 0
            };
            if (rule.deposit_percent < 80) existing.fee_percent_low = rule.fee_percent;
            else existing.fee_percent_high = rule.fee_percent;
            grouped.set(key, existing);
        });
        const rows = Array.from(grouped.values()).sort((a, b) => a.min_order_value - b.min_order_value);
        reset({ rows });
    };

    if (fields.length === 0 && data.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                <Info className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bảng phí dịch vụ</h3>
                <p className="text-gray-500 mb-4">Dữ liệu hiện tại đang trống. Bạn có thể khởi tạo bảng phí mặc định.</p>
                <Button onClick={handleInitialize} className="bg-blue-600 custom-hover">
                    Khởi tạo phí mặc định
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 text-slate-700 font-semibold align-middle">
                            <th className="py-3 px-4 text-left min-w-[300px]">Giá trị đơn hàng (VNĐ)</th>
                            <th className="py-3 px-4 text-center min-w-[150px]">Phí (Cọc 70%)</th>
                            <th className="py-3 px-4 text-center min-w-[150px]">Phí (Cọc 100%)</th>
                            <th className="py-3 px-4 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50 transition-colors">
                                {/* RANGE INPUTS */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            control={control}
                                            name={`rows.${index}.min_order_value`}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(v) => field.onChange(v.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    className="w-32 px-2 py-1.5 border rounded-md text-right font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                            )}
                                        />
                                        <span className="text-gray-400 font-medium">-</span>
                                        <Controller
                                            control={control}
                                            name={`rows.${index}.max_order_value`}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(v) => field.onChange(v.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    className="w-32 px-2 py-1.5 border rounded-md text-right font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                                    placeholder="Max"
                                                />
                                            )}
                                        />
                                        <span className="text-xs text-gray-500 ml-1">đ</span>
                                    </div>
                                </td>

                                {/* FEE LOW */}
                                <td className="py-3 px-4 text-center">
                                    <div className="relative inline-block w-24">
                                        <input
                                            {...register(`rows.${index}.fee_percent_low`)}
                                            type="number"
                                            step="0.1"
                                            className="w-full px-2 py-1.5 text-center font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 text-xs font-bold">%</span>
                                    </div>
                                </td>

                                {/* FEE HIGH */}
                                <td className="py-3 px-4 text-center">
                                    <div className="relative inline-block w-24">
                                        <input
                                            {...register(`rows.${index}.fee_percent_high`)}
                                            type="number"
                                            step="0.1"
                                            className="w-full px-2 py-1.5 text-center font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 text-xs font-bold">%</span>
                                    </div>
                                </td>

                                {/* DELETE */}
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => remove(index)}
                                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ min_order_value: 0, max_order_value: 0, fee_percent_low: 0, fee_percent_high: 0 })}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                    <Plus size={16} className="mr-2" /> Thêm khoảng giá trị
                </Button>
            </div>
        </div>
    );
}
