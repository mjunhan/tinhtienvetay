import { ShippingRateRule } from "@/types/database.types";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Plus } from "lucide-react";

interface ColumnDef {
    header: string;
    accessor: (rule: ShippingRateRule) => React.ReactNode;
    className?: string;
}

interface AdminPricingTableProps {
    title: string;
    rules: ShippingRateRule[]; // Filtered rules passed from parent
    columns: ColumnDef[];
    onEdit: (rule: ShippingRateRule) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
}

export const AdminPricingTable = ({ title, rules, columns, onEdit, onDelete, onCreate }: AdminPricingTableProps) => {
    // Sort rules by min_value to ensure correct visual order
    const sortedRules = [...rules].sort((a, b) => a.min_value - b.min_value);

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-8">
            {/* HEADER WITH ADD BUTTON */}
            <div className="bg-slate-900 py-4 px-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">{title}</h3>
                <Button size="sm" variant="secondary" onClick={onCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Thêm mốc mới
                </Button>
            </div>

            {/* TABLE HEADER */}
            <div className="grid bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700"
                style={{ gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)` }}>
                {columns.map((col, idx) => (
                    <div key={idx} className={`py-3 px-4 ${col.className || ''}`}>{col.header}</div>
                ))}
                <div className="py-3 px-4 text-center">Thao tác</div>
            </div>

            {/* TABLE BODY */}
            <div className="divide-y divide-gray-100">
                {sortedRules.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 italic">Chưa có dữ liệu. Hãy thêm mốc mới.</div>
                ) : (
                    sortedRules.map((rule) => (
                        <div key={rule.id} className="grid hover:bg-slate-50 transition-colors items-center"
                            style={{ gridTemplateColumns: `repeat(${columns.length + 1}, 1fr)` }}>

                            {/* Data Columns */}
                            {columns.map((col, idx) => (
                                <div key={idx} className={`py-4 px-4 ${col.className || ''}`}>
                                    {col.accessor(rule)}
                                </div>
                            ))}

                            {/* Actions Column */}
                            <div className="py-4 px-4 flex justify-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => onEdit(rule)} className="text-blue-600 hover:bg-blue-50 px-2">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { if (confirm("Xóa?")) onDelete(rule.id) }} className="text-red-600 hover:bg-red-50 px-2">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
