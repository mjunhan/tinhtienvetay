import { ShippingRateRule } from "@/types/database.types";

interface OfficialShippingTableProps {
    rules: ShippingRateRule[];
    mode?: "view" | "edit";
}

export function OfficialShippingTable({ rules, mode = "view" }: OfficialShippingTableProps) {
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };
    // Helper to find price dynamically from props
    const findPrice = (
        type: 'weight_based' | 'volume_based',
        min: number,
        warehouse: 'HN' | 'HCM'
    ) => {
        const rule = rules.find(r =>
            r.method === 'ChinhNgach' &&
            r.type === type &&
            r.warehouse === warehouse &&
            r.min_value === min
        );

        if (!rule) return '---';
        // Format: 11000 -> 11.000
        return new Intl.NumberFormat('vi-VN').format(rule.price);
    };

    return (
        <div className="w-full space-y-6 font-sans">
            {/* SECTION HEADER */}
            <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-slate-800">Line Chính Ngạch</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* === CARD 1: HÀNG NẶNG (WEIGHT) === */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    {/* Card Header */}
                    <div className="bg-slate-900 py-4 px-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg text-center uppercase tracking-wide">
                            Đối với Hàng Nặng
                        </h3>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                        <div className="py-3 px-4 text-left">Số lượng (kg)</div>
                        <div className="py-3 px-4 text-center">Hà Nội</div>
                        <div className="py-3 px-4 text-center">Hồ Chí Minh</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100">
                        {/* ROW 1 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">70kg - 500kg</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 70, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 70, 'HCM')}</div>
                        </div>
                        {/* ROW 2 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">500kg - 1000kg</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 500, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 500, 'HCM')}</div>
                        </div>
                        {/* ROW 3 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">Trên 1000kg</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 1000, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 1000, 'HCM')}</div>
                        </div>
                        {/* ROW 4 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">Trên 2000kg</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 2000, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('weight_based', 2000, 'HCM')}</div>
                        </div>
                    </div>
                </div>

                {/* === CARD 2: HÀNG CỒNG KỀNH (VOLUME) === */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    {/* Card Header */}
                    <div className="bg-slate-900 py-4 px-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg text-center uppercase tracking-wide">
                            Đối với Hàng Cồng Kềnh
                        </h3>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-slate-50 border-b border-gray-200 text-sm font-semibold text-slate-700">
                        <div className="py-3 px-4 text-left">Số lượng (m³)</div>
                        <div className="py-3 px-4 text-center">Hà Nội</div>
                        <div className="py-3 px-4 text-center">Hồ Chí Minh</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-100">
                        {/* ROW 1 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">Dưới 10m³</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 0, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 0, 'HCM')}</div>
                        </div>
                        {/* ROW 2 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">Trên 10m³</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 10, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 10, 'HCM')}</div>
                        </div>
                        {/* ROW 3 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">Trên 20m³</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 20, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 20, 'HCM')}</div>
                        </div>
                        {/* ROW 4 */}
                        <div className="grid grid-cols-3 hover:bg-gray-50 transition-colors">
                            <div className="py-4 px-4 text-sm font-medium text-slate-900">Trên 20m³ (VIP)</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 21, 'HN')}</div>
                            <div className="py-4 px-4 text-center text-red-600 font-bold">{findPrice('volume_based', 21, 'HCM')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* === FOOTER NOTES === */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-sm text-slate-700 mt-4">
                <p className="mb-2 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">ℹ️</span>
                    <span>
                        <strong>Tổng chi phí bao gồm:</strong> Tiền hàng + Phí mua hàng (1%) + Ship nội địa TQ (nếu có) + Phí ủy thác (1%) + Thuế (VAT + Nhập khẩu nếu có) + Cước vận chuyển.
                    </span>
                </p>
                <p className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">💡</span>
                    <span>
                        <strong>Phí ủy thác:</strong> Đối với invoice dưới 30tr mặc định thu ủy thác 300k/ 1 mục khai.
                    </span>
                </p>
            </div>
        </div>
    );
};
