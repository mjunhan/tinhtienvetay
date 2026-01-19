import { AlertTriangle } from 'lucide-react';
import { useServiceFeeRules } from '@/hooks/usePricingRules';
// Simple Input wrapper for styling
const PercentInput = ({ value, onChange, disabled }: { value: number, onChange: (val: number) => void, disabled?: boolean }) => (
    <div className="relative inline-block w-20">
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full pl-2 pr-6 py-1 text-center font-bold bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all disabled:opacity-50"
            disabled={disabled}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-600 font-bold text-xs">%</span>
    </div>
);

interface ServiceFeeTier {
    id?: string;
    min_order_value: number;
    deposit_percent: number;
    fee_percent: number;
}

interface GlobalServiceFeeTableProps {
    mode?: "view" | "edit";
    // If edit mode and external control
    data?: ServiceFeeTier[];
    onUpdate?: (id: string, field: 'fee_percent', value: number) => void;
}

export function GlobalServiceFeeTable({ mode = "view", data, onUpdate }: GlobalServiceFeeTableProps) {
    // Fallback to internal hook if no data provided (View mode default behavior)
    const { data: fetchedFees } = useServiceFeeRules();

    // Use provided data (for edit mode) or fetched data (for view only)
    const feesToRender = data || fetchedFees || [];

    // Helper to find fee
    const findFee = (minVal: number, deposit: number) => {
        return feesToRender.find(f =>
            // Rough match for ranges based on min_order_value
            // Assumptions based on original hardcoded table:
            // < 2M -> min 0
            // 2M-5M -> min 2000000
            // > 5M -> min 5000000
            f.min_order_value === minVal && f.deposit_percent === deposit
        );
    };

    // Helper to render cell
    const renderCell = (minVal: number, deposit: number) => {
        const fee = findFee(minVal, deposit);
        if (!fee) return <span className="text-gray-400">---</span>;

        if (mode === 'edit' && onUpdate && fee.id) {
            return (
                <PercentInput
                    value={fee.fee_percent}
                    onChange={(val) => onUpdate(fee.id!, 'fee_percent', val)}
                />
            );
        }

        return (
            <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                {fee.fee_percent}%
            </span>
        );
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

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm md:text-base">
                        <thead>
                            <tr className="bg-amber-100 text-amber-900">
                                <th className="py-4 px-6 text-left font-bold border-b border-amber-200 w-1/3">
                                    GIÁ TRỊ ĐƠN HÀNG
                                </th>
                                <th className="py-4 px-6 text-center font-bold border-b border-amber-200 w-1/3">
                                    CỌC DƯỚI 80% (70%)
                                </th>
                                <th className="py-4 px-6 text-center font-bold border-b border-amber-200 w-1/3">
                                    CỌC TRÊN 80% (100%)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Row 1: < 2M */}
                            <tr className="hover:bg-amber-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    Dưới 2 triệu
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {renderCell(0, 70)}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {renderCell(0, 100)}
                                </td>
                            </tr>

                            {/* Row 2: 2M - 5M */}
                            <tr className="hover:bg-amber-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    Từ 2 triệu đến 5 triệu
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {renderCell(2000000, 70)}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {renderCell(2000000, 100)}
                                </td>
                            </tr>

                            {/* Row 3: > 5M */}
                            <tr className="hover:bg-amber-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    Trên 5 triệu
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {renderCell(5000000, 70)}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {renderCell(5000000, 100)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
