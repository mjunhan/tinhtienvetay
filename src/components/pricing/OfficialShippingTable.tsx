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
        <div className="w-full max-w-5xl mx-auto font-sans text-sm">
            {/* --- MAIN HEADER --- */}
            <div className="bg-[#002060] text-white font-bold text-center py-3 text-lg uppercase border border-[#002060]">
                LINE CHÍNH NGẠCH
            </div>

            <div className="flex flex-col md:flex-row border-l border-r border-[#002060]">
                {/* ====== LEFT COLUMN: HÀNG NẶNG ====== */}
                <div className="w-full md:w-1/2 md:border-r border-[#002060]">
                    {/* Sub Header */}
                    <div className="bg-[#FFC000] text-black font-bold text-center py-2 border-b border-[#002060] uppercase">
                        ĐỐI VỚI HÀNG NẶNG
                    </div>

                    {/* Table Content */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#002060] text-white font-bold">
                                <th className="py-2 border-r border-white/20">Số lượng (kg)</th>
                                <th className="py-2 border-r border-white/20">Hà Nội</th>
                                <th className="py-2">Hồ Chí Minh</th>
                            </tr>
                        </thead>
                        <tbody className="text-center font-bold text-[#002060]">
                            {/* Row 1: 70-500 (White) */}
                            <tr className="bg-white border-b border-gray-300">
                                <td className="py-3 px-2 text-left pl-6">70kg - 500kg</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 70, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 70, 'HCM')}₫</td>
                            </tr>
                            {/* Row 2: 500-1000 (Gray) */}
                            <tr className="bg-[#F2F2F2] border-b border-gray-300">
                                <td className="py-3 px-2 text-left pl-6">500kg - 1000kg</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 500, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 500, 'HCM')}₫</td>
                            </tr>
                            {/* Row 3: > 1000 (White) */}
                            <tr className="bg-white border-b border-gray-300">
                                <td className="py-3 px-2 text-left pl-6">Trên 1000kg</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 1000, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 1000, 'HCM')}₫</td>
                            </tr>
                            {/* Row 4: > 2000 (Gray) */}
                            <tr className="bg-[#F2F2F2]">
                                <td className="py-3 px-2 text-left pl-6">Trên 2000kg</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 2000, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('weight_based', 2000, 'HCM')}₫</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ====== RIGHT COLUMN: HÀNG CỒNG KỀNH ====== */}
                <div className="w-full md:w-1/2">
                    {/* Sub Header */}
                    <div className="bg-[#FFC000] text-black font-bold text-center py-2 border-b border-[#002060] uppercase">
                        ĐỐI VỚI HÀNG CỒNG KỀNH
                    </div>

                    {/* Table Content */}
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#002060] text-white font-bold">
                                <th className="py-2 border-r border-white/20">Số lượng (m³)</th>
                                <th className="py-2 border-r border-white/20">Hà Nội</th>
                                <th className="py-2">Hồ Chí Minh</th>
                            </tr>
                        </thead>
                        <tbody className="text-center font-bold text-[#002060]">
                            {/* Row 1: < 10 (White) */}
                            <tr className="bg-white border-b border-gray-300">
                                <td className="py-3 px-2 text-left pl-6">Dưới 10m³</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 0, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 0, 'HCM')}₫</td>
                            </tr>
                            {/* Row 2: > 10 (Gray) */}
                            <tr className="bg-[#F2F2F2] border-b border-gray-300">
                                <td className="py-3 px-2 text-left pl-6">Trên 10m³</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 10, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 10, 'HCM')}₫</td>
                            </tr>
                            {/* Row 3: > 20 (White) */}
                            <tr className="bg-white border-b border-gray-300">
                                <td className="py-3 px-2 text-left pl-6">Trên 20m³</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 20, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 20, 'HCM')}₫</td>
                            </tr>
                            {/* Row 4: > 30 (Gray) */}
                            <tr className="bg-[#F2F2F2]">
                                <td className="py-3 px-2 text-left pl-6">Trên 30m³</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 30, 'HN')}₫</td>
                                <td className="py-3 text-[#C00000]">{findPrice('volume_based', 30, 'HCM')}₫</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- FOOTER NOTE --- */}
            <div className="bg-[#FFF2CC] p-4 text-center text-[#002060] italic border border-t-0 border-[#002060] text-xs md:text-sm">
                <p className="mb-2">
                    Tổng chi phí bao gồm = Tiền hàng + Phí mua hàng (1%) + Ship nội địa TQ (nếu có) + Phí ủy thác (1%) + Thuế (VAT + Nhập khẩu nếu có) + Cước vận chuyển
                </p>
                <p>
                    Phí ủy thác: đối với invoice dưới 30tr mặc định thu ủy thác 300k/1 mục khai
                </p>
            </div>

            {/* --- BOTTOM NOTE --- */}
            <div className="mt-2 p-2 text-center text-black font-medium text-xs md:text-sm">
                Hàng đi Line Chính ngạch khách hàng vui lòng cung cấp chính xác: Thông tin hình ảnh sản phẩm, Tên sản phẩm, Số lượng sản phẩm...
            </div>
        </div>
    );
}
