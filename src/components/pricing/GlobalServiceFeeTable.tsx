import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ServiceFeeRule } from '@/types/database.types';

// Helper to Group Raw Rules into Table Rows (Ranges)
interface FeeRow {
    id_low?: string;
    id_high?: string;
    min_order_value: number;
    max_order_value: number;
    fee_percent_low: number; // Deposit < 80% (70%)
    fee_percent_high: number; // Deposit > 80% (100%)
}

interface GlobalServiceFeeTableProps {
    mode?: "view" | "edit";
    data?: ServiceFeeRule[]; // Raw list from DB
    onDataChange?: (newData: ServiceFeeRule[]) => void;
}

export function GlobalServiceFeeTable({ mode = "view", data = [], onDataChange }: GlobalServiceFeeTableProps) {
    // 1. Transform Raw Data to Grouped Rows
    const initialRows = useMemo(() => {
        const grouped = new Map<string, FeeRow>();

        // Sort by min value
        const sortedData = [...data].sort((a, b) => a.min_order_value - b.min_order_value);

        sortedData.forEach(rule => {
            const key = `${rule.min_order_value}-${rule.max_order_value}`;
            const existing = grouped.get(key) || {
                min_order_value: rule.min_order_value,
                max_order_value: rule.max_order_value,
                fee_percent_low: 0,
                fee_percent_high: 0
            };

            // Assuming deposit_percent 70 is low, 100 is high based on codebase context
            if (rule.deposit_percent < 80) {
                existing.fee_percent_low = rule.fee_percent;
                existing.id_low = rule.id;
            } else {
                existing.fee_percent_high = rule.fee_percent;
                existing.id_high = rule.id;
            }
            grouped.set(key, existing);
        });

        // Initialize with default template if empty
        if (grouped.size === 0 && mode === 'edit') {
            return [
                { min_order_value: 0, max_order_value: 2000000, fee_percent_low: 0, fee_percent_high: 0 },
                { min_order_value: 2000000, max_order_value: 5000000, fee_percent_low: 0, fee_percent_high: 0 },
                { min_order_value: 5000000, max_order_value: 999999999, fee_percent_low: 0, fee_percent_high: 0 },
            ]
        }

        return Array.from(grouped.values()).sort((a, b) => a.min_order_value - b.min_order_value);
    }, [data, mode]);

    // 2. Setup Form
    const { control, watch, reset, register, getValues } = useForm<{ rows: FeeRow[] }>({
        defaultValues: { rows: initialRows }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows"
    });

    // Reset form when initial data changes significantly (avoid loop)
    useEffect(() => {
        // Only reset if the incoming data is actually differing from current form state
        // This prevents cursor jumping when parent state updates due to our own changes
        const currentValues = getValues().rows;
        if (JSON.stringify(initialRows) !== JSON.stringify(currentValues)) {
            reset({ rows: initialRows });
        }
    }, [initialRows, reset, getValues]);


    // 3. Watch Changes & Propagate Up
    useEffect(() => {
        if (mode !== 'edit' || !onDataChange) return;

        const subscription = watch((value) => {
            if (!value.rows) return;

            // Flatten back to ServiceFeeRule[]
            const flattened: ServiceFeeRule[] = [];
            value.rows.forEach((row: any) => {
                if (!row) return;

                // Rule 1: Low Deposit (<80%)
                flattened.push({
                    id: row.id_low, // Might be undefined (new)
                    min_order_value: Number(row.min_order_value || 0),
                    max_order_value: Number(row.max_order_value || 0),
                    deposit_percent: 70, // Hardcoded standard
                    fee_percent: Number(row.fee_percent_low || 0),
                    method: 'TieuNgach' // Default
                } as unknown as ServiceFeeRule);

                // Rule 2: High Deposit (>80%)
                flattened.push({
                    id: row.id_high,
                    min_order_value: Number(row.min_order_value || 0),
                    max_order_value: Number(row.max_order_value || 0),
                    deposit_percent: 100, // Hardcoded standard
                    fee_percent: Number(row.fee_percent_high || 0),
                    method: 'TieuNgach'
                } as unknown as ServiceFeeRule);
            });

            onDataChange(flattened);
        });
        return () => subscription.unsubscribe();
    }, [watch, mode, onDataChange]);


    // --- UI Helpers ---

    const renderRangeInput = (index: number, type: 'min' | 'max') => {
        if (mode === 'view') {
            const row = fields[index];
            if (type === 'min' && row.min_order_value === 0) return "Dưới";
            if (type === 'min' && row.min_order_value >= 5000000) return "Trên"; // Simple view logic fallback
            if (type === 'max' && row.max_order_value > 100000000) return "";
            // Logic in view mode is complex due to text variants. 
            // Better to just render the specific text.
            // Relying on hardcoded render logic for view?
            // No, let's use the dynamic values.
            return null;
        }

        return (
            <Controller
                control={control}
                name={`rows.${index}.${type}_order_value`}
                render={({ field }) => (
                    <NumericFormat
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.floatValue)}
                        thousandSeparator="."
                        decimalSeparator=","
                        suffix="₫"
                        placeholder="0"
                        className="w-32 px-2 py-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                    />
                )}
            />
        );
    };

    const renderRangeDisplay = (min: number, max: number) => {
        const format = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
        if (min === 0) return `Dưới ${format(max / 1000000)} triệu`;
        if (max > 100000000) return `Trên ${format(min / 1000000)} triệu`;
        return `Từ ${format(min / 1000000)} - ${format(max / 1000000)} triệu`;
    };

    return (
        <div className="w-full mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
                {/* Header */}
                <div className="bg-amber-400 py-4 px-6 text-center">
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Bảng Giá Dịch Vụ Mua Hàng
                        <span className="block text-sm font-bold text-slate-800 opacity-80 mt-1">
                            (Áp dụng cho toàn bộ hệ thống)
                        </span>
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm md:text-base">
                        <thead>
                            <tr className="bg-amber-100 text-amber-900">
                                <th className="py-4 px-6 text-left font-bold border-b border-amber-200 w-1/3">
                                    GIÁ TRỊ ĐƠN HÀNG (VNĐ)
                                </th>
                                <th className="py-4 px-6 text-center font-bold border-b border-amber-200 w-1/3">
                                    CỌC DƯỚI 80% (70%)
                                </th>
                                <th className="py-4 px-6 text-center font-bold border-b border-amber-200 w-1/3">
                                    CỌC TRÊN 80% (100%)
                                </th>
                                {mode === 'edit' && <th className="w-16 border-b border-amber-200"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {fields.map((field, index) => (
                                <tr key={field.id} className="hover:bg-amber-50/50">
                                    <td className="py-4 px-6 font-medium text-slate-800">
                                        {mode === 'edit' ? (
                                            <div className="flex items-center gap-2">
                                                {renderRangeInput(index, 'min')}
                                                <span>-</span>
                                                {renderRangeInput(index, 'max')}
                                            </div>
                                        ) : (
                                            renderRangeDisplay(field.min_order_value, field.max_order_value)
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {mode === 'edit' ? (
                                            <div className="relative inline-block w-24">
                                                <input
                                                    {...register(`rows.${index}.fee_percent_low` as const)}
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full pl-2 pr-6 py-1 text-center font-bold bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-600 font-bold text-xs">%</span>
                                            </div>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                                {field.fee_percent_low}%
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        {mode === 'edit' ? (
                                            <div className="relative inline-block w-24">
                                                <input
                                                    {...register(`rows.${index}.fee_percent_high` as const)}
                                                    type="number"
                                                    step="0.1"
                                                    className="w-full pl-2 pr-6 py-1 text-center font-bold bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-600 font-bold text-xs">%</span>
                                            </div>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                                {field.fee_percent_high}%
                                            </span>
                                        )}
                                    </td>
                                    {mode === 'edit' && (
                                        <td className="text-center px-2">
                                            <button
                                                onClick={() => remove(index)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Xóa dòng"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {mode === 'edit' && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => append({
                                    min_order_value: 0,
                                    max_order_value: 0,
                                    fee_percent_low: 0,
                                    fee_percent_high: 0
                                })}
                                className="border-dashed border-slate-300 hover:border-blue-500 hover:text-blue-600"
                            >
                                <Plus size={16} className="mr-2" />
                                Thêm mốc giá trị
                            </Button>
                        </div>
                    )}
                </div>

                {/* Warning Footer */}
                <div className="bg-red-50 text-red-600 p-4 flex items-start gap-3 text-sm border-t border-red-100">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">LƯU Ý:</p>
                        <p>Giá trị tiền hàng để tính phí dịch vụ được tính trên tổng tiền hàng theo đơn hàng từng shop Trung Quốc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
