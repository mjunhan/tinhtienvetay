import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ShippingRateRule } from "@/types/database.types";

interface OfficialShippingTableProps {
    rules: ShippingRateRule[];
    mode?: "view" | "edit";
    // For single field updates we used this, but now we need bulk update or full replacement
    onDataChange?: (newData: ShippingRateRule[]) => void;
}

// Editable Cell Component
const PriceInput = ({ control, name }: { control: any, name: string }) => (
    <Controller
        control={control}
        name={name}
        render={({ field }) => (
            <div className="relative inline-block w-full max-w-[120px]">
                <NumericFormat
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.floatValue)}
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix=""
                    allowNegative={false}
                    className="w-full pl-2 pr-6 py-2 text-center font-bold text-red-600 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs">₫</span>
            </div>
        )}
    />
);

// Range Editor Component
const RangeEditor = ({ control, index, namePrefix, suffix, isEditing }: { control: any, index: number, namePrefix: string, suffix: string, isEditing: boolean }) => {
    // If not editing, display text logic
    // But we are inside a map, so we can access values via useWatch strictly if needed, but here simple rendering is enough if we trust passed values.
    // Actually, react-hook-form is controlled, so we use Controller.

    return (
        <div className="flex items-center gap-2 justify-center">
            <Controller
                control={control}
                name={`${namePrefix}.${index}.min_value`}
                render={({ field }) => isEditing ? (
                    <NumericFormat
                        value={field.value}
                        onValueChange={(v) => field.onChange(v.floatValue)}
                        className="w-20 px-2 py-1 text-right border rounded text-sm font-medium"
                        thousandSeparator="."
                        placeholder="Min"
                    />
                ) : (
                    <span className="hidden" /> // Logic handled by wrapper
                )}
            />
            {isEditing && <span className="text-gray-400">-</span>}
            <Controller
                control={control}
                name={`${namePrefix}.${index}.max_value`}
                render={({ field }) => isEditing ? (
                    <NumericFormat
                        value={field.value}
                        onValueChange={(v) => field.onChange(v.floatValue)}
                        className="w-20 px-2 py-1 text-right border rounded text-sm font-medium"
                        thousandSeparator="."
                        placeholder="Max"
                    />
                ) : (
                    <span className="hidden" />
                )}
            />
            {isEditing && <span className="text-gray-500 text-xs ml-1">{suffix}</span>}
        </div>
    );
};

// Sub-Component for a Card (Heavy or Bulky) to keep code clean
const ShippingCard = ({ title, type, control, name, mode, onRemove, onAdd, suffix }: any) => {
    const { fields } = useFieldArray({ control, name });

    const formatRange = (min: number, max: number) => {
        const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
        if (min === 0) return `Dưới ${fmt(max)}${suffix}`;
        if (max > 100000000) return `Trên ${fmt(min)}${suffix}`;
        return `${fmt(min)}${suffix} - ${fmt(max)}${suffix}`;
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="bg-slate-900 py-4 px-6 border-b border-slate-800">
                <h3 className="text-white font-bold text-lg text-center uppercase tracking-wide">
                    {title}
                </h3>
            </div>

            <div className="flex-1">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                    <div className="py-3 px-4 text-left">Số lượng</div>
                    <div className="py-3 px-2 text-center">Hà Nội</div>
                    <div className="py-3 px-2 text-center">Hồ Chí Minh</div>
                    {mode === 'edit' && <div className="w-10"></div>}
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                    {fields.map((field: any, index: number) => (
                        <div key={field.id} className="grid grid-cols-[1.5fr_1fr_1fr_auto] hover:bg-gray-50 transition-colors items-center p-2">
                            <div className="px-2 text-sm font-medium text-slate-900">
                                {mode === 'edit' ? (
                                    <RangeEditor control={control} index={index} namePrefix={name} suffix={suffix} isEditing={true} />
                                ) : (
                                    formatRange(field.min_value, field.max_value)
                                )}
                            </div>
                            <div className="px-1 text-center">
                                {mode === 'edit' ? (
                                    <PriceInput control={control} name={`${name}.${index}.price_hn`} />
                                ) : (
                                    <span className="text-red-600 font-bold">{new Intl.NumberFormat('vi-VN').format(field.price_hn)}</span>
                                )}
                            </div>
                            <div className="px-1 text-center">
                                {mode === 'edit' ? (
                                    <PriceInput control={control} name={`${name}.${index}.price_hcm`} />
                                ) : (
                                    <span className="text-red-600 font-bold">{new Intl.NumberFormat('vi-VN').format(field.price_hcm)}</span>
                                )}
                            </div>
                            {mode === 'edit' && (
                                <div className="text-center">
                                    <button onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {fields.length === 0 && <div className="p-4 text-center text-gray-400 text-sm">Chưa có dữ liệu</div>}
                </div>
            </div>

            {mode === 'edit' && (
                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                    <Button variant="outline" size="sm" onClick={onAdd} className="w-full border-dashed">
                        <Plus size={14} className="mr-1" /> Thêm khoảng
                    </Button>
                </div>
            )}
        </div>
    );
}

export function OfficialShippingTable({ rules, mode = "view", onDataChange }: OfficialShippingTableProps) {
    // 1. Transform Flat Rules to Heavy/Bulky Structures
    interface ExtendedRule extends ShippingRateRule {
        // We'll flatten warehouse rows into one "Display Row" for the UI
        price_hn: number;
        price_hcm: number;
        id_hn?: string;
        id_hcm?: string;
    }

    const { heavyRows, bulkyRows } = useMemo(() => {
        const process = (subtype: string) => {
            const subset = rules.filter(r => r.method === 'ChinhNgach' && (r.type === 'weight_based' ? 'heavy' : 'bulky') === (subtype === 'weight' ? 'heavy' : 'bulky'));

            // The structure in DB uses `type`='weight_based' for 'heavy' UI card
            // and `type`='volume_based' for 'bulky' UI card.
            // Wait, `usePricingRules` lines 157-163 filter by `subtype === 'heavy'`. 
            // Does `ShippingRateRule` have columns `subtype`? 
            // Checking `usePricingRules` line 297: `select('*')`. 
            // Line 4 in `usePricingRules` imports type from database.types.
            // Line 162 in `usePricingRules` calls `r.subtype`.
            // If subtype exists, we use it. If not, we infer from type.
            // Assumption: `weight_based` = heavy card, `volume_based` = bulky card.

            const typeKey = subtype === 'weight' ? 'weight_based' : 'volume_based';
            const relevant = rules.filter(r => r.method === 'ChinhNgach' && r.type === typeKey);

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
            heavyRows: process('weight'),
            bulkyRows: process('volume')
        };
    }, [rules]);

    const { control, watch, reset, getValues } = useForm({
        defaultValues: {
            heavy: heavyRows,
            bulky: bulkyRows
        }
    });

    // Reset loop prevention
    useEffect(() => {
        const currentVals = getValues();
        const nextVals = { heavy: heavyRows, bulky: bulkyRows };
        if (JSON.stringify(nextVals) !== JSON.stringify(currentVals)) {
            reset(nextVals);
        }
    }, [heavyRows, bulkyRows, reset, getValues]);

    // Watcher
    useEffect(() => {
        if (mode !== 'edit' || !onDataChange) return;
        const subscription = watch((value) => {
            const flattened: ShippingRateRule[] = [];

            // Validate and Flat Heavy
            value.heavy?.forEach((r: any) => {
                if (r.price_hn > 0 || r.id_hn) {
                    flattened.push({
                        id: r.id_hn,
                        method: 'ChinhNgach',
                        type: 'weight_based',
                        subtype: 'heavy', // Explicitly setting for consistency
                        warehouse: 'HN',
                        min_value: r.min_value,
                        max_value: r.max_value,
                        price: r.price_hn
                    } as ShippingRateRule);
                }
                if (r.price_hcm > 0 || r.id_hcm) {
                    flattened.push({
                        id: r.id_hcm,
                        method: 'ChinhNgach',
                        type: 'weight_based',
                        subtype: 'heavy',
                        warehouse: 'HCM',
                        min_value: r.min_value,
                        max_value: r.max_value,
                        price: r.price_hcm
                    } as ShippingRateRule);
                }
            });

            // Validate and Flat Bulky
            value.bulky?.forEach((r: any) => {
                const mkRule = (wh: 'HN' | 'HCM', price: number, id?: string) => ({
                    id, method: 'ChinhNgach', type: 'volume_based', subtype: 'bulky', warehouse: wh,
                    min_value: r.min_value, max_value: r.max_value, price
                } as ShippingRateRule);

                if (r.price_hn > 0 || r.id_hn) flattened.push(mkRule('HN', r.price_hn, r.id_hn));
                if (r.price_hcm > 0 || r.id_hcm) flattened.push(mkRule('HCM', r.price_hcm, r.id_hcm));
            });

            onDataChange(flattened);
        });
        return () => subscription.unsubscribe();
    }, [watch, onDataChange, mode]);

    const { append: appendHeavy, remove: removeHeavy } = useFieldArray({ control, name: 'heavy' });
    const { append: appendBulky, remove: removeBulky } = useFieldArray({ control, name: 'bulky' });

    return (
        <div className="w-full space-y-6 font-sans">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800">Line Chính Ngạch</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShippingCard
                    title="Đối với Hàng Nặng"
                    control={control}
                    name="heavy"
                    mode={mode}
                    suffix="kg"
                    onRemove={removeHeavy}
                    onAdd={() => appendHeavy({ min_value: 0, max_value: 0, price_hn: 0, price_hcm: 0 })}
                />
                <ShippingCard
                    title="Đối với Hàng Cồng Kềnh"
                    control={control}
                    name="bulky"
                    mode={mode}
                    suffix="m³"
                    onRemove={removeBulky}
                    onAdd={() => appendBulky({ min_value: 0, max_value: 0, price_hn: 0, price_hcm: 0 })}
                />
            </div>

            {/* === FOOTER NOTES === */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-sm text-slate-700 mt-4">
                <p className="mb-2 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">ℹ️</span>
                    <span>
                        <strong>Tổng chi phí bao gồm:</strong> Tiền hàng + Phí mua hàng (1%) + Ship nội địa TQ (nếu có) + Phí ủy thác (1%) + Thuế (VAT + Nhập khẩu nếu có) + Cước vận chuyển.
                    </span>
                </p>
            </div>
        </div>
    );
};
