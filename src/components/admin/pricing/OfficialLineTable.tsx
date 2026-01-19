import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ShippingRateRule } from "@/types/database.types";

interface OfficialLineTableProps {
    rules: ShippingRateRule[];
    onDataChange: (newData: ShippingRateRule[]) => void;
}

// Reusable Row Input Component for consistency
const RangeRow = ({ control, index, name, suffix, onRemove }: any) => {
    return (
        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] hover:bg-slate-50 transition-colors items-center p-2 border-b border-gray-100 last:border-0">
            {/* Range Inputs */}
            <div className="px-2 flex items-center gap-2">
                <Controller
                    control={control}
                    name={`${name}.${index}.min_value`}
                    render={({ field }) => (
                        <NumericFormat
                            value={field.value}
                            onValueChange={(v) => field.onChange(v.floatValue)}
                            thousandSeparator="."
                            className="w-20 px-2 py-1.5 border rounded text-right text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Min"
                        />
                    )}
                />
                <span className="text-gray-400 font-medium">-</span>
                <Controller
                    control={control}
                    name={`${name}.${index}.max_value`}
                    render={({ field }) => (
                        <NumericFormat
                            value={field.value}
                            onValueChange={(v) => field.onChange(v.floatValue)}
                            thousandSeparator="."
                            className="w-20 px-2 py-1.5 border rounded text-right text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Max"
                        />
                    )}
                />
                <span className="text-gray-500 text-xs font-medium">{suffix}</span>
            </div>

            {/* Price HN */}
            <div className="px-1 text-center">
                <Controller
                    control={control}
                    name={`${name}.${index}.price_hn`}
                    render={({ field }) => (
                        <div className="relative inline-block w-28">
                            <NumericFormat
                                value={field.value}
                                onValueChange={(v) => field.onChange(v.floatValue)}
                                thousandSeparator="."
                                className="w-full pl-2 pr-6 py-1.5 text-center font-bold text-red-600 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none text-sm"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                        </div>

                    )}
                />
            </div>

            {/* Price HCM */}
            <div className="px-1 text-center">
                <Controller
                    control={control}
                    name={`${name}.${index}.price_hcm`}
                    render={({ field }) => (
                        <div className="relative inline-block w-28">
                            <NumericFormat
                                value={field.value}
                                onValueChange={(v) => field.onChange(v.floatValue)}
                                thousandSeparator="."
                                className="w-full pl-2 pr-6 py-1.5 text-center font-bold text-red-600 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-red-500 outline-none text-sm"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₫</span>
                        </div>
                    )}
                />
            </div>

            {/* Delete */}
            <div className="text-center">
                <button onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}

export function OfficialLineTable({ rules, onDataChange }: OfficialLineTableProps) {

    // 1. Group to Heavy/Bulky
    const { heavyRows, bulkyRows } = useMemo(() => {
        const process = (subtype: 'heavy' | 'bulky') => {
            const typeKey = subtype === 'heavy' ? 'weight_based' : 'volume_based';

            // Filter rules matching this subtype
            const relevant = rules.filter(r => r.method === 'ChinhNgach' && (r.type === typeKey || r.subtype === subtype));

            const map = new Map<string, any>();
            relevant.forEach(r => {
                const key = `${r.min_value}-${r.max_value}`;
                const existing = map.get(key) || {
                    min_value: r.min_value,
                    max_value: r.max_value,
                    price_hn: 0,
                    price_hcm: 0
                };
                if (r.warehouse === 'HN') {
                    existing.price_hn = r.price;
                    existing.id_hn = r.id;
                } else {
                    existing.price_hcm = r.price;
                    existing.id_hcm = r.id;
                }
                map.set(key, existing);
            });
            return Array.from(map.values()).sort((a, b) => a.min_value - b.min_value);
        };

        return {
            heavyRows: process('heavy'),
            bulkyRows: process('bulky')
        };
    }, [rules]);

    const { control, watch, reset } = useForm({
        defaultValues: {
            heavy: heavyRows,
            bulky: bulkyRows
        }
    });

    const { fields: heavyFields, append: appendHeavy, remove: removeHeavy } = useFieldArray({ control, name: 'heavy' });
    const { fields: bulkyFields, append: appendBulky, remove: removeBulky } = useFieldArray({ control, name: 'bulky' });

    // Initial Load / Sync REMOVED to prevent infinite loop.
    // Parent should control re-initialization via the 'key' prop.
    /*
    useEffect(() => {
        // Prevent infinite loops but update if parent data changes significantly (e.g. after reset)
        // Simple check: defaultValues usually empty on first render if data not ready
        if (heavyRows.length > 0 || bulkyRows.length > 0) {
            reset({ heavy: heavyRows, bulky: bulkyRows });
        }
    }, [heavyRows, bulkyRows, reset]);
    */

    // Data Binding
    useEffect(() => {
        const subscription = watch((value) => {
            const flattened: ShippingRateRule[] = [];

            // Heavy
            value.heavy?.forEach((r: any) => {
                // HN
                if (r) {
                    flattened.push({
                        id: r.id_hn,
                        method: 'ChinhNgach',
                        type: 'weight_based',
                        subtype: 'heavy',
                        warehouse: 'HN',
                        min_value: Number(r.min_value || 0),
                        max_value: Number(r.max_value || 0),
                        price: Number(r.price_hn || 0)
                    } as any as ShippingRateRule);
                    // HCM
                    flattened.push({
                        id: r.id_hcm,
                        method: 'ChinhNgach',
                        type: 'weight_based',
                        subtype: 'heavy',
                        warehouse: 'HCM',
                        min_value: Number(r.min_value || 0),
                        max_value: Number(r.max_value || 0),
                        price: Number(r.price_hcm || 0)
                    } as any as ShippingRateRule);
                }
            });

            // Bulky
            value.bulky?.forEach((r: any) => {
                // HN
                if (r) {
                    flattened.push({
                        id: r.id_hn,
                        method: 'ChinhNgach',
                        type: 'volume_based',
                        subtype: 'bulky',
                        warehouse: 'HN',
                        min_value: Number(r.min_value || 0),
                        max_value: Number(r.max_value || 0),
                        price: Number(r.price_hn || 0)
                    } as any as ShippingRateRule);
                    // HCM
                    flattened.push({
                        id: r.id_hcm,
                        method: 'ChinhNgach',
                        type: 'volume_based',
                        subtype: 'bulky',
                        warehouse: 'HCM',
                        min_value: Number(r.min_value || 0),
                        max_value: Number(r.max_value || 0),
                        price: Number(r.price_hcm || 0)
                    } as any as ShippingRateRule);
                }
            });

            onDataChange(flattened);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange]);

    return (
        <div className="w-full space-y-6 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* HEAVY ITEMS CARD */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full">
                    <div className="bg-slate-900 py-3 px-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg text-center uppercase tracking-wide">
                            Hàng Nặng (Kg)
                        </h3>
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                            <div className="py-2 px-4 text-left">Trọng lượng</div>
                            <div className="py-2 px-2 text-center">Hà Nội</div>
                            <div className="py-2 px-2 text-center">HCM</div>
                            <div className="w-10"></div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {heavyFields.map((field, index) => (
                                <RangeRow
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    name="heavy"
                                    suffix="kg"
                                    onRemove={removeHeavy}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <Button variant="outline" size="sm" onClick={() => appendHeavy({ min_value: 0, max_value: 0, price_hn: 0, price_hcm: 0 })} className="w-full border-dashed">
                            <Plus size={14} className="mr-1" /> Thêm khoảng cân nặng
                        </Button>
                    </div>
                </div>

                {/* BULKY ITEMS CARD */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full">
                    <div className="bg-slate-900 py-3 px-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg text-center uppercase tracking-wide">
                            Hàng Cồng Kềnh (m³)
                        </h3>
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                            <div className="py-2 px-4 text-left">Thể tích</div>
                            <div className="py-2 px-2 text-center">Hà Nội</div>
                            <div className="py-2 px-2 text-center">HCM</div>
                            <div className="w-10"></div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {bulkyFields.map((field, index) => (
                                <RangeRow
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    name="bulky"
                                    suffix="m³"
                                    onRemove={removeBulky}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <Button variant="outline" size="sm" onClick={() => appendBulky({ min_value: 0, max_value: 0, price_hn: 0, price_hcm: 0 })} className="w-full border-dashed">
                            <Plus size={14} className="mr-1" /> Thêm khoảng thể tích
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
