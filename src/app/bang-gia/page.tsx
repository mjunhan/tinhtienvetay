'use client';

import { usePricingRules } from '@/hooks/usePricingRules';
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeIn } from '@/components/ui/motion-primitives';

export default function BangGiaPage() {
    const { data: pricing, isLoading, error } = usePricingRules();

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
                    <div className="mt-8 inline-flex items-center gap-3 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold text-xl shadow-lg shadow-amber-500/20">
                        <span>TỶ GIÁ HIỆN TẠI:</span>
                        <span className="bg-white text-amber-600 px-3 py-1 rounded-lg">1¥ = {formatMoney(pricing?.exchange_rate || 0)}₫</span>
                    </div>
                </motion.div>

                {/* SECTION 1: OFFICIAL LINE (CHÍNH NGẠCH) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-2 bg-amber-500 rounded-full" />
                        <h2 className="text-3xl font-bold text-slate-900">Line Chính Ngạch</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Heavy Goods */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800">Hàng Nặng (KG)</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-900 text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Trọng lượng</th>
                                            <th className="py-3 px-4 text-left">Hà Nội</th>
                                            <th className="py-3 px-4 text-left">TP.HCM</th>
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
                                        {pricing?.official_shipping.heavy.map((tier, idx) => (
                                            <motion.tr
                                                key={idx}
                                                className="hover:bg-amber-50/50 transition-colors"
                                                variants={{
                                                    hidden: { opacity: 0, x: -10 },
                                                    show: { opacity: 1, x: 0 }
                                                }}
                                            >
                                                <td className="py-3 px-4 font-medium text-slate-700">
                                                    {tier.max_weight ? `${formatMoney(tier.min_weight || 0)} - ${formatMoney(tier.max_weight)} kg` : `Trên ${formatMoney(tier.min_weight || 0)} kg`}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-slate-900">{formatMoney(tier.price_hn)}₫</td>
                                                <td className="py-3 px-4 font-bold text-slate-900">{formatMoney(tier.price_hcm)}₫</td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bulky Goods */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800">Hàng Cồng Kềnh (M³)</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-900 text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-left">Thể tích</th>
                                            <th className="py-3 px-4 text-left">Hà Nội</th>
                                            <th className="py-3 px-4 text-left">TP.HCM</th>
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
                                        {pricing?.official_shipping.bulky.map((tier, idx) => (
                                            <motion.tr
                                                key={idx}
                                                className="hover:bg-amber-50/50 transition-colors"
                                                variants={{
                                                    hidden: { opacity: 0, x: -10 },
                                                    show: { opacity: 1, x: 0 }
                                                }}
                                            >
                                                <td className="py-3 px-4 font-medium text-slate-700">
                                                    {tier.max_volume ? `${tier.min_volume} - ${tier.max_volume} m³` : `Trên ${tier.min_volume} m³`}
                                                </td>
                                                <td className="py-3 px-4 font-bold text-slate-900">{formatMoney(tier.price_hn)}₫</td>
                                                <td className="py-3 px-4 font-bold text-slate-900">{formatMoney(tier.price_hcm)}₫</td>
                                            </motion.tr>
                                        ))}
                                    </motion.tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Formula Footer */}
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-slate-700 flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-900 mb-1">CÔNG THỨC TÍNH TỔNG CHI PHÍ:</p>
                            <p>Tiền hàng + Phí mua hàng + Ship nội địa TQ + <span className="font-bold text-red-600">Phí ủy thác (1%)</span> + Thuế (VAT + NK) + Cước vận chuyển</p>
                            <p className="mt-1 text-xs text-slate-500 italic">* Lưu ý: Đối với invoice dưới 30tr, phí ủy thác mặc định là 300k/đơn.</p>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 2: NORMAL SHIPPING (VẬN CHUYỂN THƯỜNG) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-2 bg-green-500 rounded-full" />
                        <h2 className="text-3xl font-bold text-slate-900">Vận Chuyển Thường</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900 text-white">
                                    <tr>
                                        <th className="py-4 px-6 text-left" rowSpan={2}>Giá trị đơn hàng</th>
                                        <th className="py-4 px-6 text-center" rowSpan={2}>Phí mua hàng<br /><span className="text-xs font-normal opacity-70">(Cọc 80%)</span></th>
                                        <th className="py-2 px-4 text-center border-b border-slate-700" colSpan={2}>Hà Nội</th>
                                        <th className="py-2 px-4 text-center border-b border-slate-700" colSpan={2}>Hồ Chí Minh</th>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 text-center bg-slate-800 font-medium">Cân thực</th>
                                        <th className="py-2 px-4 text-center bg-slate-800 font-medium text-slate-400">Quy đổi</th>
                                        <th className="py-2 px-4 text-center bg-slate-800 font-medium">Cân thực</th>
                                        <th className="py-2 px-4 text-center bg-slate-800 font-medium text-slate-400">Quy đổi</th>
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
                                    {pricing?.normal_shipping.map((tier, idx) => (
                                        <motion.tr
                                            key={idx}
                                            className="hover:bg-green-50/30 transition-colors"
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                show: { opacity: 1, x: 0 }
                                            }}
                                        >
                                            <td className="py-4 px-6 font-medium text-slate-700">
                                                {tier.max_value > 1000000000 ? `Trên ${formatMoney(tier.min_value)}₫` : `${formatMoney(tier.min_value)} - ${formatMoney(tier.max_value)}₫`}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold text-xs">{tier.fee_percent}%</span>
                                            </td>
                                            <td className="py-4 px-6 text-center font-bold text-slate-900">{formatMoney(tier.hn_actual)}</td>
                                            <td className="py-4 px-6 text-center text-slate-400">{formatMoney(tier.hn_converted || tier.hn_actual + 2000)}</td>
                                            <td className="py-4 px-6 text-center font-bold text-slate-900">{formatMoney(tier.hcm_actual)}</td>
                                            <td className="py-4 px-6 text-center text-slate-400">{formatMoney(tier.hcm_converted || tier.hcm_actual + 2000)}</td>
                                        </motion.tr>
                                    ))}
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
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-10 w-2 bg-red-500 rounded-full" />
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Line Thương Mại Điện Tử</h2>
                            <p className="text-red-500 font-medium text-sm">Hỏa tốc 2-4 ngày về kho HN</p>
                        </div>
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
                                            className="hover:bg-red-50/30 transition-colors"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[60px] opacity-20" />
                            <h3 className="text-lg font-bold mb-4">Thông tin liên hệ</h3>
                            <div className="space-y-4 text-sm text-slate-300">
                                <p><strong className="text-white">Hotline/Zalo:</strong> 0912.345.678</p>
                                <p><strong className="text-white">Kho HN:</strong> 123 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
                                <p><strong className="text-white">Kho HCM:</strong> 456 CMT8, Quận 3, TP.HCM</p>
                                <p><strong className="text-white">Email:</strong> support@tinhtienvetay.vn</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <div className="text-center text-sm text-slate-400 pb-12">
                    <p>© 2026 Tính Tiền Về Tay. Bảng giá có hiệu lực từ 12/07/2025.</p>
                </div>
            </div>
        </div>
    );
}
