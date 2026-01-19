"use client";

import { motion } from "framer-motion";
// Matches PricingConfig 'tmdt_shipping' structure
interface TmdtPricingTier {
    min_value: number;
    max_value: number;
    fee_percent: number;
    hn_actual: number;
    hcm_actual: number;
    // Optional IDs for editing
    hn_rule_id?: string;
    hcm_rule_id?: string;
    fee_rule_id?: string;
}

interface TmdtShippingTableProps {
    data?: TmdtPricingTier[];
    mode?: "view" | "edit";
    onUpdate?: (index: number, field: keyof TmdtPricingTier, value: number) => void;
}

export function TmdtShippingTable({ data = [], mode = "view", onUpdate }: TmdtShippingTableProps) {
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left">Giá trị đơn hàng/Shop</th>
                            <th className="py-4 px-6 text-center">Phí mua hàng</th>
                            <th className="py-4 px-6 text-center">Cước HN</th>
                            <th className="py-4 px-6 text-center">Cước HCM</th>
                        </tr>
                    </thead>
                    <motion.tbody
                        className="divide-y divide-slate-100"
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {data.map((tier, idx) => (
                            <motion.tr
                                key={idx}
                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-red-50 transition-colors`}
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    show: { opacity: 1, x: 0 }
                                }}
                            >
                                <td className="py-4 px-6 font-medium text-slate-700">
                                    {tier.max_value > 1000000000 ? `Trên ${formatMoney(tier.min_value)}₫` : `${formatMoney(tier.min_value)} - ${formatMoney(tier.max_value)}₫`}
                                </td>
                                {mode === 'view' ? (
                                    <>
                                        <td className="py-4 px-6 text-center">
                                            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs">{tier.fee_percent}%</span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-red-600">{formatMoney(tier.hn_actual)}₫</td>
                                        <td className="py-4 px-6 text-center font-bold text-red-600">{formatMoney(tier.hcm_actual)}₫</td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-4 px-6 text-center">
                                            <input
                                                type="number"
                                                value={tier.fee_percent}
                                                onChange={(e) => onUpdate?.(idx, 'fee_percent', Number(e.target.value))}
                                                className="w-16 p-1 text-center border rounded focus:ring-2 focus:ring-red-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-red-600">
                                            <input
                                                type="number"
                                                value={tier.hn_actual}
                                                onChange={(e) => onUpdate?.(idx, 'hn_actual', Number(e.target.value))}
                                                className="w-24 p-1 text-center border rounded focus:ring-2 focus:ring-red-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-red-600">
                                            <input
                                                type="number"
                                                value={tier.hcm_actual}
                                                onChange={(e) => onUpdate?.(idx, 'hcm_actual', Number(e.target.value))}
                                                className="w-24 p-1 text-center border rounded focus:ring-2 focus:ring-red-500 outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
        </div>
    );
}
