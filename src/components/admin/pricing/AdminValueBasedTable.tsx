import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ValueBasedRow {
    id_hn?: string;
    id_hcm?: string;
    id_fee?: string;
    min_value: number;
    max_value: number;
    fee_percent?: number;
    price_hn: number;
    price_hcm: number;
}

interface AdminValueBasedTableProps {
    data: any[];
    onDataChange: (newData: any[]) => void;
    showFeeColumn?: boolean;
    title?: string;
    color?: 'green' | 'red';
}

export function AdminValueBasedTable({
    data = [],
    onDataChange,
    showFeeColumn = false,
    title = "Bảng Phí",
    color = 'green'
}: AdminValueBasedTableProps) {

    // Transform data to editable rows
    const initialRows = useMemo(() => {
        if (!data || data.length === 0) {
            return [];
        }

        // Group by min_value and max_value
        const grouped = new Map<string, ValueBasedRow>();

        data.forEach((item: any) => {
            const key = `${item.min_value}-${item.max_value}`;
            const existing = grouped.get(key) || {
                min_value: item.min_value,
                max_value: item.max_value,
                fee_percent: item.fee_percent || 0,
                price_hn: 0,
                price_hcm: 0,
                id_hn: undefined,
                id_hcm: undefined,
                id_fee: undefined
            };

            // Handle hn/hcm pricing (both converted and actual)
            if (item.hn_actual !== undefined) {
                existing.price_hn = item.hn_actual;
                existing.id_hn = item.hn_rule_id;
            }
            if (item.hcm_actual !== undefined) {
                existing.price_hcm = item.hcm_actual;
                existing.id_hcm = item.hcm_rule_id;
            }
            if (item.fee_percent !== undefined) {
                existing.fee_percent = item.fee_percent;
                existing.id_fee = item.fee_rule_id;
            }

            grouped.set(key, existing);
        });

        return Array.from(grouped.values()).sort((a, b) => a.min_value - b.min_value);
    }, [data]);

    const { control, watch, reset, getValues } = useForm<{ rows: ValueBasedRow[] }>({
        defaultValues: { rows: initialRows }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows"
    });

    // Sync with external data changes (avoid infinite loops)
    useEffect(() => {
        const currentValues = getValues().rows;
        if (JSON.stringify(initialRows) !== JSON.stringify(currentValues)) {
            reset({ rows: initialRows });
        }
    }, [initialRows, reset, getValues]);

    // Propagate changes up to parent
    useEffect(() => {
        const subscription = watch((value) => {
            if (!value.rows) return;

            // Transform back to original data structure
            const transformed = value.rows.map((row: any) => ({
                min_value: Number(row.min_value || 0),
                max_value: Number(row.max_value || 0),
                fee_percent: showFeeColumn ? Number(row.fee_percent || 0) : 0,
                hn_actual: Number(row.price_hn || 0),
                hn_converted: Number(row.price_hn || 0), // Simplified
                hcm_actual: Number(row.price_hcm || 0),
                hcm_converted: Number(row.price_hcm || 0),
                hn_rule_id: row.id_hn,
                hcm_rule_id: row.id_hcm,
                fee_rule_id: row.id_fee
            }));

            onDataChange(transformed);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange, showFeeColumn]);

    const colorClasses = {
        green: {
            header: 'bg-green-600',
            headerText: 'text-white',
            headerBorder: 'border-green-700',
            cellBg: 'bg-green-50',
            cellText: 'text-green-700',
            inputRing: 'focus:ring-green-500'
        },
        red: {
            header: 'bg-red-600',
            headerText: 'text-white',
            headerBorder: 'border-red-700',
            cellBg: 'bg-red-50',
            cellText: 'text-red-700',
            inputRing: 'focus:ring-red-500'
        }
    };

    const colors = colorClasses[color];

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className={`${colors.header} ${colors.headerText}`}>
                        <tr>
                            <th className={`py-3 px-4 text-left font-bold ${colors.headerBorder} border-r`}>
                                Giá trị đơn hàng
                            </th>
                            {showFeeColumn && (
                                <th className={`py-3 px-4 text-center font-bold ${colors.headerBorder} border-r`}>
                                    Phí mua hàng (%)
                                </th>
                            )}
                            <th className={`py-3 px-4 text-center font-bold ${colors.headerBorder} border-r`}>
                                Cước HN
                            </th>
                            <th className={`py-3 px-4 text-center font-bold ${colors.headerBorder} border-r`}>
                                Cước HCM
                            </th>
                            <th className="py-3 px-4 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                                {/* Min/Max Value */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Controller
                                            control={control}
                                            name={`rows.${index}.min_value`}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(v) => field.onChange(v.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    suffix="₫"
                                                    className="w-32 px-2 py-1.5 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Min"
                                                />
                                            )}
                                        />
                                        <span className="text-gray-400">-</span>
                                        <Controller
                                            control={control}
                                            name={`rows.${index}.max_value`}
                                            render={({ field }) => (
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(v) => field.onChange(v.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    suffix="₫"
                                                    className="w-32 px-2 py-1.5 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Max"
                                                />
                                            )}
                                        />
                                    </div>
                                </td>

                                {/* Fee Percent (Optional) */}
                                {showFeeColumn && (
                                    <td className="py-3 px-4 text-center">
                                        <Controller
                                            control={control}
                                            name={`rows.${index}.fee_percent`}
                                            render={({ field }) => (
                                                <div className="relative inline-block w-24">
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        step="0.1"
                                                        className={`w-full pl-2 pr-6 py-1.5 text-center font-bold ${colors.cellBg} ${colors.cellText} border border-gray-200 rounded outline-none ${colors.inputRing} focus:ring-2`}
                                                    />
                                                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 ${colors.cellText} text-xs font-bold`}>%</span>
                                                </div>
                                            )}
                                        />
                                    </td>
                                )}

                                {/* Price HN */}
                                <td className="py-3 px-4 text-center">
                                    <Controller
                                        control={control}
                                        name={`rows.${index}.price_hn`}
                                        render={({ field }) => (
                                            <div className="relative inline-block w-28">
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(v) => field.onChange(v.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    className={`w-full pl-2 pr-6 py-1.5 text-center font-bold ${colors.cellText} border border-gray-200 rounded outline-none ${colors.inputRing} focus:ring-2`}
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                                            </div>
                                        )}
                                    />
                                </td>

                                {/* Price HCM */}
                                <td className="py-3 px-4 text-center">
                                    <Controller
                                        control={control}
                                        name={`rows.${index}.price_hcm`}
                                        render={({ field }) => (
                                            <div className="relative inline-block w-28">
                                                <NumericFormat
                                                    value={field.value}
                                                    onValueChange={(v) => field.onChange(v.floatValue)}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    className={`w-full pl-2 pr-6 py-1.5 text-center font-bold ${colors.cellText} border border-gray-200 rounded outline-none ${colors.inputRing} focus:ring-2`}
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                                            </div>
                                        )}
                                    />
                                </td>

                                {/* Delete Button */}
                                <td className="text-center">
                                    <button
                                        onClick={() => remove(index)}
                                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                        title="Xóa dòng"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Row Button */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => append({
                        min_value: 0,
                        max_value: 0,
                        fee_percent: 0,
                        price_hn: 0,
                        price_hcm: 0,
                        id_hn: undefined,
                        id_hcm: undefined,
                        id_fee: undefined
                    })}
                    className="w-full border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                    <Plus size={14} className="mr-1" />
                    Thêm khoảng giá trị
                </Button>
            </div>
        </div>
    );
}
