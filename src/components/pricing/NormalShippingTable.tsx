"use client";

import { motion } from "framer-motion";

interface PricingTier {
    min_value: number;
    max_value: number;
    fee_percent: number;
    hn_actual: number;
    hn_converted: number;
    hcm_actual: number;
    hcm_converted: number;
}

interface NormalShippingTableProps {
    data?: PricingTier[];
    mode?: "view" | "edit";
    onUpdate?: (index: number, field: keyof PricingTier, value: number) => void;
}

export function NormalShippingTable({ data = [], mode = "view", onUpdate }: NormalShippingTableProps) {
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left border-r border-slate-700" rowSpan={2}>Tiền hàng/Shop</th>
                            <th className="py-4 px-6 text-center border-r border-slate-700" rowSpan={2}>
                                Phí mua hàng<br />
                                <span className="text-xs font-normal opacity-80">(Cọc 80%)</span>
                            </th>
                            <th className="py-2 px-4 text-center border-b border-slate-700 border-r border-slate-700" colSpan={2}>Hà Nội</th>
                            <th className="py-2 px-4 text-center border-b border-slate-700" colSpan={2}>Hồ Chí Minh</th>
                        </tr>
                        <tr>
                            <th className="py-2 px-4 text-center bg-slate-800 font-medium border-r border-slate-700">Cân thực</th>
                            <th className="py-2 px-4 text-center bg-slate-800 font-medium border-r border-slate-700">Cân quy đổi</th>
                            <th className="py-2 px-4 text-center bg-slate-800 font-medium border-r border-slate-700">Cân thực</th>
                            <th className="py-2 px-4 text-center bg-slate-800 font-medium">Cân quy đổi</th>
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
                                className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-green-50 transition-colors`}
                                variants={{
                                    hidden: { opacity: 0, x: -10 },
                                    show: { opacity: 1, x: 0 }
                                }}
                            >
                                <td className="py-4 px-6 font-medium text-slate-900">
                                    {tier.max_value > 100000000
                                        ? `> ${tier.min_value / 1000000} triệu`
                                        : `${tier.min_value / 1000000} - ${tier.max_value / 1000000} triệu`}
                                </td>
                                {mode === 'view' ? (
                                    <>
                                        <td className="py-4 px-6 text-center border-l border-slate-100">
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">
                                                {tier.fee_percent}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            {formatMoney(tier.hn_actual)}
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            {formatMoney(tier.hn_converted)}
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            {formatMoney(tier.hcm_actual)}
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            {formatMoney(tier.hcm_converted)}
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-4 px-6 text-center border-l border-slate-100">
                                            <input
                                                type="number"
                                                value={tier.fee_percent}
                                                onChange={(e) => onUpdate?.(idx, 'fee_percent', Number(e.target.value))}
                                                className="w-16 p-1 text-center border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            <input
                                                type="number"
                                                value={tier.hn_actual}
                                                onChange={(e) => onUpdate?.(idx, 'hn_actual', Number(e.target.value))}
                                                className="w-24 p-1 text-center border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            <input
                                                type="number"
                                                value={tier.hn_converted}
                                                onChange={(e) => onUpdate?.(idx, 'hn_converted', Number(e.target.value))}
                                                className="w-24 p-1 text-center border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            <input
                                                type="number"
                                                value={tier.hcm_actual}
                                                onChange={(e) => onUpdate?.(idx, 'hcm_actual', Number(e.target.value))}
                                                className="w-24 p-1 text-center border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">
                                            <input
                                                type="number"
                                                value={tier.hcm_converted}
                                                onChange={(e) => onUpdate?.(idx, 'hcm_converted', Number(e.target.value))}
                                                className="w-24 p-1 text-center border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </td>
                                    </>
                                )}
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </table>
            </div>
            <div className="bg-slate-50 p-3 text-center text-xs text-slate-500 border-t border-slate-200">
                Hàng cồng kềnh tính theo công thức: (Dài x Rộng x Cao) / 6000
            </div>
        </div>
    );
}
