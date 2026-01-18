import { ShippingRateRule } from "@/types/database.types";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Plus } from "lucide-react";

interface AdminOfficialTableProps {
    rules: ShippingRateRule[];
    onEdit: (rule: ShippingRateRule) => void;
    onDelete: (id: string) => void;
    onCreate: (template: Partial<ShippingRateRule>) => void;
}

export const AdminOfficialTable = ({ rules, onEdit, onDelete, onCreate }: AdminOfficialTableProps) => {

    // Helper to find the exact rule record
    const getRule = (type: 'weight_based' | 'volume_based', min: number, warehouse: 'HN' | 'HCM') => {
        return rules.find(r =>
            r.method === 'ChinhNgach' &&
            r.type === type &&
            r.warehouse === warehouse &&
            r.min_value === min
        );
    };

    // Render a Price Cell with Actions
    const PriceCell = ({ type, min, warehouse }: { type: 'weight_based' | 'volume_based', min: number, warehouse: 'HN' | 'HCM' }) => {
        const rule = getRule(type, min, warehouse);

        if (!rule) {
            return (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs border-dashed text-slate-400 hover:text-blue-600 hover:border-blue-600"
                        onClick={() => onCreate({ method: 'ChinhNgach', type, min_value: min, warehouse })}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Thiết lập
                    </Button>
                </div>
            );
        }

        return (
            <div className="group flex items-center justify-center gap-2">
                <span className="font-bold text-red-600">
                    {new Intl.NumberFormat('vi-VN').format(rule.price)}
                </span>
                {/* Actions - visible on group hover */}
                <div className="hidden group-hover:flex items-center gap-1 opacity-100 transition-opacity">
                    <button onClick={() => onEdit(rule)} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Sửa">
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => { if (confirm('Xóa mốc giá này?')) onDelete(rule.id); }}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                        title="Xóa"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full space-y-6 font-sans">
            {/* HEADER */}
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800">Quản Lý Line Chính Ngạch</h2>
                <span className="text-xs text-slate-500 ml-2">(Giao diện đồng bộ với Web khách hàng)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* === LEFT: HÀNG NẶNG === */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    <div className="bg-slate-900 py-3 px-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg text-center uppercase">Hàng Nặng (Kg)</h3>
                    </div>
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                        <div className="py-3 px-4">Mức cân</div>
                        <div className="py-3 px-4 text-center">Hà Nội</div>
                        <div className="py-3 px-4 text-center">HCM</div>
                    </div>
                    <div className="divide-y divide-gray-100 text-sm">
                        {/* ROW 1: 70-500 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">70kg - 500kg</div>
                            <PriceCell type="weight_based" min={70} warehouse="HN" />
                            <PriceCell type="weight_based" min={70} warehouse="HCM" />
                        </div>
                        {/* ROW 2: 500-1000 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">500kg - 1000kg</div>
                            <PriceCell type="weight_based" min={500} warehouse="HN" />
                            <PriceCell type="weight_based" min={500} warehouse="HCM" />
                        </div>
                        {/* ROW 3: >1000 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">Trên 1000kg</div>
                            <PriceCell type="weight_based" min={1000} warehouse="HN" />
                            <PriceCell type="weight_based" min={1000} warehouse="HCM" />
                        </div>
                        {/* ROW 4: >2000 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">Trên 2000kg</div>
                            <PriceCell type="weight_based" min={2000} warehouse="HN" />
                            <PriceCell type="weight_based" min={2000} warehouse="HCM" />
                        </div>
                    </div>
                </div>

                {/* === RIGHT: HÀNG CỒNG KỀNH === */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    <div className="bg-slate-900 py-3 px-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg text-center uppercase">Hàng Cồng Kềnh (m³)</h3>
                    </div>
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                        <div className="py-3 px-4">Thể tích</div>
                        <div className="py-3 px-4 text-center">Hà Nội</div>
                        <div className="py-3 px-4 text-center">HCM</div>
                    </div>
                    <div className="divide-y divide-gray-100 text-sm">
                        {/* ROW 1: <10 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">Dưới 10m³</div>
                            <PriceCell type="volume_based" min={0} warehouse="HN" />
                            <PriceCell type="volume_based" min={0} warehouse="HCM" />
                        </div>
                        {/* ROW 2: >10 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">Trên 10m³</div>
                            <PriceCell type="volume_based" min={10} warehouse="HN" />
                            <PriceCell type="volume_based" min={10} warehouse="HCM" />
                        </div>
                        {/* ROW 3: >20 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">Trên 20m³</div>
                            <PriceCell type="volume_based" min={20} warehouse="HN" />
                            <PriceCell type="volume_based" min={20} warehouse="HCM" />
                        </div>
                        {/* ROW 4: VIP */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 py-3 px-4">
                            <div className="font-medium pt-1">Trên 20m³ (VIP)</div>
                            <PriceCell type="volume_based" min={21} warehouse="HN" />
                            <PriceCell type="volume_based" min={21} warehouse="HCM" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
