'use client';

import { usePricingRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Info, Calculator, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeIn } from '@/components/ui/motion-primitives';
import { GlobalServiceFeeTable } from '@/components/pricing/GlobalServiceFeeTable';
import { OfficialShippingTable } from '@/components/pricing/OfficialShippingTable';

export default function BangGiaPage() {
    const { data: pricing, isLoading, error } = usePricingRules();
    const { data: shippingRates } = useShippingRateRules();

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Đang tải bảng giá...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-100">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Không thể tải bảng giá</h2>
                    <Link href="/" className="text-amber-600 hover:underline font-semibold">← Quay về trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="absolute top-0 left-0 w-full h-[400px] bg-slate-900 -z-0" />

            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                {/* Header */}
                <motion.div variants={fadeIn} initial="initial" animate="animate" className="text-center mb-16 text-white">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                    >
                        <ArrowLeft size={16} />
                        Quay về công cụ tính giá
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                        Bảng Giá Dịch Vụ
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Cập nhật tỷ giá mới nhất và các chính sách vận chuyển ưu đãi.
                    </p>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="mt-8 relative"
                    >
                        {/* Pulsing glow effect */}
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-amber-500 blur-xl opacity-50 rounded-2xl"
                        />

                        <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                                <TrendingUp className="w-6 h-6" />
                                <div className="flex items-baseline gap-2 md:gap-3">
                                    <span className="text-base md:text-lg font-medium">TỶ GIÁ HIỆN TẠI:</span>
                                    <motion.span
                                        key={pricing?.exchange_rate}
                                        initial={{ scale: 1.2 }}
                                        animate={{ scale: 1 }}
                                        className="text-2xl md:text-3xl font-extrabold text-amber-50"
                                    >
                                        1¥ = {formatMoney(pricing?.exchange_rate || 0)}₫
                                    </motion.span>
                                </div>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded hidden md:inline">Cập nhật liên tục</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* GLOBAL SERVICE FEE TABLE - NEW V0.4.2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-12"
                >
                    <GlobalServiceFeeTable />
                </motion.div>

                {/* SECTION 1: OFFICIAL LINE (CHÍNH NGẠCH) - NEW DESIGN */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <OfficialShippingTable
                        rules={shippingRates || []}
                        exchangeRate={pricing?.exchange_rate || 0}
                    />
                </motion.div>

                {/* SECTION 2: NORMAL SHIPPING (VẬN CHUYỂN THƯỜNG) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Vận Chuyển Thường</h2>
                                <p className="text-green-600 font-medium text-sm mt-1">Phổ biến nhất</p>
                            </div>
                        </div>
                        <span className="hidden md:inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">80% khách hàng chọn</span>
                    </div>

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
                                    {/* Row 1: 0 - 2 triệu */}
                                    <motion.tr className="bg-white hover:bg-green-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-900">0 - 2 triệu</td>
                                        <td className="py-4 px-6 text-center border-l border-slate-100">
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">3%</span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">19.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">21.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">24.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">26.000</td>
                                    </motion.tr>

                                    {/* Row 2: 2 - 5 triệu */}
                                    <motion.tr className="bg-slate-50 hover:bg-green-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-900">2 - 5 triệu</td>
                                        <td className="py-4 px-6 text-center border-l border-slate-100">
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">1.5%</span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">14.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">16.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">19.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">21.000</td>
                                    </motion.tr>

                                    {/* Row 3: > 5 triệu */}
                                    <motion.tr className="bg-white hover:bg-green-50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-900">{'>'} 5 triệu</td>
                                        <td className="py-4 px-6 text-center border-l border-slate-100">
                                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm">1.2%</span>
                                        </td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">8.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">10.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">12.000</td>
                                        <td className="py-4 px-6 text-center font-bold text-slate-900 border-l border-slate-100">14.000</td>
                                    </motion.tr>
                                </motion.tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 p-3 text-center text-xs text-slate-500 border-t border-slate-200">
                            Hàng cồng kềnh tính theo công thức: (Dài x Rộng x Cao) / 6000
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 3: E-COMMERCE (TMĐT) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Line Thương Mại Điện Tử</h2>
                                <p className="text-red-600 font-medium text-sm mt-1">⚡ Hỏa tốc 2-4 ngày về kho HN</p>
                            </div>
                        </div>
                        <span className="hidden md:inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold">Express</span>
                    </div>

                    {/* Warning Banner */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-900">LƯU Ý QUAN TRỌNG</h4>
                            <p className="text-red-800 text-sm">
                                Các kiện hàng Line TMĐT được tính theo <span className="font-extrabold underline">CÂN NẶNG THỰC</span> - <span className="font-extrabold">KHÔNG QUY ĐỔI</span> thể tích.
                            </p>
                        </div>
                    </div>

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
                                    {pricing?.tmdt_shipping.map((tier, idx) => (
                                        <motion.tr
                                            key={idx}
                                            className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                                                } hover:bg-red-50 transition-colors`}
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                show: { opacity: 1, x: 0 }
                                            }}
                                        >
                                            <td className="py-4 px-6 font-medium text-slate-700">
                                                {tier.max_value > 1000000000 ? `Trên ${formatMoney(tier.min_value)}₫` : `${formatMoney(tier.min_value)} - ${formatMoney(tier.max_value)}₫`}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-xs">{tier.fee_percent}%</span>
                                            </td>
                                            <td className="py-4 px-6 text-center font-bold text-red-600">{formatMoney(tier.hn_actual)}₫</td>
                                            <td className="py-4 px-6 text-center font-bold text-red-600">{formatMoney(tier.hcm_actual)}₫</td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 4: SERVICE INFO (POLICY) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Cam kết dịch vụ
                            </h3>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5" />
                                    Mua hàng trong vòng 24h đặt cọc.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5" />
                                    Kiểm đếm số lượng, mẫu mã cơ bản.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5" />
                                    Hỗ trợ khiếu nại shop TQ trọn đời đơn hàng.
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <div className="text-center text-sm text-slate-400 pb-12">
                    <p>© 2026 Tính Tiền Về Tay. Bảng giá có hiệu lực từ 12/07/2025.</p>
                </div>
            </div>

            {/* Floating CTA Button */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 right-8 z-50"
            >
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-amber-500/50 font-bold text-lg hover:scale-105 transition-all"
                >
                    <Calculator className="w-6 h-6" />
                    <span className="hidden sm:inline">Tính Giá Ngay</span>
                    <span className="sm:hidden">Tính Giá</span>
                </Link>
            </motion.div>
        </div >
    );
}
