import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { v4 as uuidv4 } from 'uuid';

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

        // Direct map without grouping/sorting to allow duplicates (new rows) and preserve order
        return data.map((item: any) => ({
            min_value: item.min_value,
            max_value: item.max_value,
            fee_percent: item.fee_percent || 0,
            price_hn: item.hn_actual || 0,
            price_hcm: item.hcm_actual || 0,
            id_hn: item.hn_rule_id,
            id_hcm: item.hcm_rule_id,
            id_fee: item.fee_rule_id
        }));
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

        // Only reset if the data structure has fundamentally changed (e.g. new length)
        // or if the form is empty but we have data.
        // We avoid resetting on every value change to prevent input cursor jumping/blurring.
        if (initialRows.length !== currentValues.length) {
            // If length matches, we assume it's just value updates which are handled by user input
            // Checks for edge case: Component mounted with empty data, then data loaded
            reset({ rows: initialRows });
        } else if (currentValues.length === 0 && initialRows.length > 0) {
            reset({ rows: initialRows });
        }
        // Note: If we strictly needed to sync external updates (e.g. from another user), 
        // we'd need a more complex check or a manual "Refresh" button. 
        // For local editing, this "Init Only" approach is smoother.
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
                                                        min="0"
                                                        max="100"
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
                        id_hn: uuidv4(),
                        id_hcm: uuidv4(),
                        id_fee: uuidv4()
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
