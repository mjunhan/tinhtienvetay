'use client';

import { ShippingRateRule } from '@/types/database.types';

interface OfficialShippingTableProps {
    rules: ShippingRateRule[];
    exchangeRate: number;
}

export function OfficialShippingTable({ rules }: OfficialShippingTableProps) {
    /**
     * Helper function to find price for a specific rule
     * Matches by method, type, warehouse, and min_value
     */
    const findPrice = (
        type: 'weight_based' | 'volume_based',
        min: number,
        warehouse: 'HN' | 'HCM'
    ): string => {
        const rule = rules.find(
            (r) =>
                r.method === 'ChinhNgach' &&
                r.type === type &&
                r.warehouse === warehouse &&
                r.min_value === min
        );
        return rule ? rule.price.toLocaleString('vi-VN') : '---';
    };

    return (
        <div className="w-full max-w-4xl mx-auto border-2 border-[#003B70] text-[#003B70] rounded-lg overflow-hidden shadow-lg">
            {/* MAIN HEADER */}
            <div className="bg-[#003B70] text-white font-bold text-center py-3 text-xl uppercase tracking-wide">
                LINE CHÍNH NGẠCH
            </div>

            <div className="flex flex-col md:flex-row">
                {/* --- LEFT COLUMN: HÀNG NẶNG (Weight) --- */}
                <div className="w-full md:w-1/2 border-r-0 md:border-r-2 md:border-[#003B70]">
                    <div className="bg-[#FFD966] font-bold text-center py-2 border-b-2 border-[#003B70]">
                        ĐỐI VỚI HÀNG NẶNG
                    </div>
                    <table className="w-full text-sm font-medium">
                        <thead>
                            <tr className="bg-[#003B70] text-white">
                                <th className="py-2 border-r border-white/30 w-1/3">Số lượng (kg)</th>
                                <th className="py-2 border-r border-white/30 w-1/3">Hà Nội</th>
                                <th className="py-2 w-1/3">Hồ Chí Minh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#003B70]">
                            {/* ROW 1: 70-500 */}
                            <tr>
                                <td className="py-2 pl-4 font-bold text-[#003B70]">70kg - 500kg</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 70, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 70, 'HCM')}₫</td>
                            </tr>
                            {/* ROW 2: 500-1000 */}
                            <tr className="bg-[#F2F2F2]">
                                <td className="py-2 pl-4 font-bold text-[#003B70]">500kg - 1000kg</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 500, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 500, 'HCM')}₫</td>
                            </tr>
                            {/* ROW 3: > 1000 */}
                            <tr>
                                <td className="py-2 pl-4 font-bold text-[#003B70]">Trên 1000kg</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 1000, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 1000, 'HCM')}₫</td>
                            </tr>
                            {/* ROW 4: > 2000 */}
                            <tr className="bg-[#F2F2F2]">
                                <td className="py-2 pl-4 font-bold text-[#003B70]">Trên 2000kg</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 2000, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('weight_based', 2000, 'HCM')}₫</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* --- RIGHT COLUMN: HÀNG CỒNG KỀNH (Volume) --- */}
                <div className="w-full md:w-1/2">
                    <div className="bg-[#FFD966] font-bold text-center py-2 border-b-2 border-[#003B70]">
                        ĐỐI VỚI HÀNG CỒNG KỀNH
                    </div>
                    <table className="w-full text-sm font-medium">
                        <thead>
                            <tr className="bg-[#003B70] text-white">
                                <th className="py-2 border-r border-white/30 w-1/3">Số lượng (m³)</th>
                                <th className="py-2 border-r border-white/30 w-1/3">Hà Nội</th>
                                <th className="py-2 w-1/3">Hồ Chí Minh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#003B70]">
                            {/* ROW 1: < 10 */}
                            <tr>
                                <td className="py-2 pl-4 font-bold text-[#003B70]">Dưới 10m³</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 0, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 0, 'HCM')}₫</td>
                            </tr>
                            {/* ROW 2: > 10 */}
                            <tr className="bg-[#F2F2F2]">
                                <td className="py-2 pl-4 font-bold text-[#003B70]">Trên 10m³</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 10, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 10, 'HCM')}₫</td>
                            </tr>
                            {/* ROW 3: > 20 */}
                            <tr>
                                <td className="py-2 pl-4 font-bold text-[#003B70]">Trên 20m³</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 20, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 20, 'HCM')}₫</td>
                            </tr>
                            {/* ROW 4: > 30 */}
                            <tr className="bg-[#F2F2F2]">
                                <td className="py-2 pl-4 font-bold text-[#003B70]">Trên 30m³</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 30, 'HN')}₫</td>
                                <td className="py-2 text-center text-[#C00000] font-bold">{findPrice('volume_based', 30, 'HCM')}₫</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FOOTER NOTE */}
            <div className="bg-[#FFF2CC] p-4 text-xs md:text-sm text-[#003B70] italic text-center border-t-2 border-[#003B70]">
                <strong>Lưu ý:</strong> Tổng chi phí bao gồm = Tiền hàng + Phí mua hàng (1%) + Ship nội địa TQ (nếu có) + Phí ủy thác (1%) + Thuế (VAT + Nhập khẩu nếu có) + Cước vận chuyển.
                <br />
                <span className="text-[10px] md:text-xs mt-1 inline-block">
                    * Phí ủy thác: đối với invoice dưới 30tr mặc định thu ủy thác 300k/1 mục khai.
                </span>
            </div>
        </div>
    );
}
