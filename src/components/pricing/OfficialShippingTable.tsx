'use client';

import { ShippingRateRule } from '@/types/database.types';
import { motion } from 'framer-motion';

interface OfficialShippingTableProps {
    rules: ShippingRateRule[];
    exchangeRate: number;
}

export function OfficialShippingTable({ rules, exchangeRate }: OfficialShippingTableProps) {
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    // Filter for ChinhNgach method only
    const officialRules = rules.filter(rule => rule.method === 'ChinhNgach');

    // Split by type
    const weightRules = officialRules.filter(r => r.type === 'weight_based');
    const volumeRules = officialRules.filter(r => r.type === 'volume_based');

    const renderTableRows = (rulesList: ShippingRateRule[], unit: string) => {
        return rulesList.map((rule, idx) => {
            const priceHN = rule.price;
            const priceHCM = rule.price;

            return (
                <motion.tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                >
                    <td className="py-3 px-3 text-center text-sm">
                        {rule.max_value > 1000000
                            ? `Trên ${formatMoney(rule.min_value)}`
                            : `${formatMoney(rule.min_value)} - ${formatMoney(rule.max_value)}`}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-red-600">
                        {formatMoney(priceHN)}₫/{unit}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-red-600">
                        {formatMoney(priceHCM)}₫/{unit}
                    </td>
                </motion.tr>
            );
        });
    };

    return (
        <div className="border-2 border-[#003B70] rounded-xl overflow-hidden shadow-lg">
            {/* Main Header */}
            <div className="bg-[#003B70] text-white text-center py-4 font-bold text-xl uppercase tracking-wide">
                LINE CHÍNH NGẠCH
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-[#003B70]">
                {/* COLUMN 1: HEAVY GOODS */}
                <div>
                    <div className="bg-[#FFD966] text-[#003B70] text-center py-3 font-bold border-b-2 border-[#003B70]">
                        ĐỐI VỚI HÀNG NẶNG
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#003B70] text-white text-sm">
                                <th className="py-2 px-3 border-r border-white/30">Số lượng (kg)</th>
                                <th className="py-2 px-3 border-r border-white/30">Hà Nội</th>
                                <th className="py-2 px-3">Hồ Chí Minh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weightRules.length > 0 ? (
                                renderTableRows(weightRules, 'kg')
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-4 text-center text-slate-400 text-sm">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* COLUMN 2: BULKY GOODS */}
                <div>
                    <div className="bg-[#FFD966] text-[#003B70] text-center py-3 font-bold border-b-2 border-[#003B70]">
                        ĐỐI VỚI HÀNG CỒNG KỀNH
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#003B70] text-white text-sm">
                                <th className="py-2 px-3 border-r border-white/30">Số lượng (m³)</th>
                                <th className="py-2 px-3 border-r border-white/30">Hà Nội</th>
                                <th className="py-2 px-3">Hồ Chí Minh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volumeRules.length > 0 ? (
                                renderTableRows(volumeRules, 'm³')
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-4 text-center text-slate-400 text-sm">
                                        Chưa có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Note */}
            <div className="bg-[#FFF2CC] border-t-2 border-[#003B70] p-4 text-xs text-center text-[#003B70]">
                <p className="italic">
                    <strong>Lưu ý:</strong> Tổng chi phí bao gồm = Tiền hàng + Phí mua hàng (1%) + Phí vận chuyển + Các chi phí phát sinh khác (nếu có)
                </p>
            </div>
        </div>
    );
}
