'use client';

import { usePricingRules } from '@/hooks/usePricingRules';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeIn } from '@/components/ui/motion-primitives';

export default function BangGiaPage() {
    const { data: pricing, isLoading, error } = usePricingRules();

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Đang tải bảng giá...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-amber-100">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Không thể tải bảng giá</h2>
                    <p className="text-slate-600 mb-4">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
                    <Link href="/" className="text-amber-600 hover:underline font-semibold">← Quay về trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-amber-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div variants={fadeIn} initial="initial" animate="animate" className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-4 transition-colors font-semibold"
                    >
                        <ArrowLeft size={20} />
                        Quay về trang chủ
                    </Link>
                    <h1 className="text-5xl font-bold text-slate-900 mb-2">
                        Bảng Giá Dịch Vụ
                    </h1>
                    <p className="text-slate-600">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</p>
                </motion.div>

                {/* Exchange Rate Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-xl p-8 mb-8 text-white"
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-amber-100 mb-2">Tỷ giá hôm nay</p>
                            <p className="text-5xl font-bold">1¥ = {formatMoney(pricing?.exchange_rate || 0)}₫</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                            <p className="text-sm text-amber-100">CNY → VND</p>
                            <p className="text-2xl font-semibold">{pricing?.exchange_rate || 0}</p>
                        </div>
                    </div>
                </motion.div>

                {/* TMDT & TieuNgach Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* TMDT */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">TMDT</h2>
                            <p className="text-blue-100 text-sm">Thương mại điện tử</p>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 font-semibold text-gray-700">Giá trị đơn</th>
                                            <th className="text-left py-3 font-semibold text-gray-700">Phí DV</th>
                                            <th className="text-left py-3 font-semibold text-gray-700">HN</th>
                                            <th className="text-left py-3 font-semibold text-gray-700">HCM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pricing?.tmdt_shipping.map((tier, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 text-gray-800">
                                                    {formatMoney(tier.min_value)} - {formatMoney(tier.max_value)}₫
                                                </td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                        {tier.fee_percent}%
                                                    </span>
                                                </td>
                                                <td className="py-3 font-semibold text-blue-600">{formatMoney(tier.hn_actual)}₫/kg</td>
                                                <td className="py-3 font-semibold text-purple-600">{formatMoney(tier.hcm_actual)}₫/kg</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* TieuNgach */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">Tiểu Ngạch</h2>
                            <p className="text-green-100 text-sm">Vận chuyển thường</p>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="text-left py-3 font-semibold text-gray-700">Giá trị đơn</th>
                                            <th className="text-left py-3 font-semibold text-gray-700">Phí DV</th>
                                            <th className="text-left py-3 font-semibold text-gray-700">HN</th>
                                            <th className="text-left py-3 font-semibold text-gray-700">HCM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pricing?.normal_shipping.map((tier, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 text-gray-800">
                                                    {formatMoney(tier.min_value)} - {formatMoney(tier.max_value)}₫
                                                </td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                        {tier.fee_percent}%
                                                    </span>
                                                </td>
                                                <td className="py-3 font-semibold text-green-600">{formatMoney(tier.hn_actual)}₫/kg</td>
                                                <td className="py-3 font-semibold text-teal-600">{formatMoney(tier.hcm_actual)}₫/kg</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ChinhNgach Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Chính Ngạch</h2>
                        <p className="text-purple-100 text-sm">Hàng nặng - Theo trọng lượng (kg)</p>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 font-semibold text-gray-700">Trọng lượng</th>
                                        <th className="text-left py-3 font-semibold text-gray-700">Hà Nội</th>
                                        <th className="text-left py-3 font-semibold text-gray-700">TP.HCM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricing?.official_shipping.heavy.map((tier, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 text-gray-800">
                                                {formatMoney(tier.min_weight || 0)} - {formatMoney(tier.max_weight || 0)} kg
                                            </td>
                                            <td className="py-3 font-semibold text-purple-600">{formatMoney(tier.price_hn)}₫/kg</td>
                                            <td className="py-3 font-semibold text-pink-600">{formatMoney(tier.price_hcm)}₫/kg</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                            <p className="text-sm text-purple-800">
                                <strong>Lưu ý:</strong> Phí ủy thác 1% giá trị tổng invoice (đơn dưới 30 triệu: 300k/mục khai)
                            </p>
                        </div>
                    </div>
                </div>

                {/* ChinhNgach Bulky */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white">Chính Ngạch - Hàng Cồng Kềnh</h2>
                        <p className="text-pink-100 text-sm">Theo thể tích (m³)</p>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 font-semibold text-gray-700">Thể tích</th>
                                        <th className="text-left py-3 font-semibold text-gray-700">Hà Nội</th>
                                        <th className="text-left py-3 font-semibold text-gray-700">TP.HCM</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricing?.official_shipping.bulky.map((tier, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 text-gray-800">
                                                {tier.min_volume} - {tier.max_volume} m³
                                            </td>
                                            <td className="py-3 font-semibold text-pink-600">{formatMoney(tier.price_hn)}₫/m³</td>
                                            <td className="py-3 font-semibold text-rose-600">{formatMoney(tier.price_hcm)}₫/m³</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-xl p-8 text-center text-white"
                >
                    <h3 className="text-2xl font-bold mb-4">Cần tư vấn chi tiết?</h3>
                    <p className="text-amber-50 mb-6">Liên hệ ngay để được báo giá chính xác nhất!</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-8 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            Tính phí ngay
                        </Link>
                        <a
                            href="tel:0912345678"
                            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all border-2 border-white/30"
                        >
                            📞 Hotline
                        </a>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-slate-600">
                    <p>* Giá trên có thể thay đổi tùy theo thời điểm. Vui lòng liên hệ để được báo giá chính xác.</p>
                    <p className="mt-2">© 2026 Tính Tiền Vé Tàu - v0.3.0</p>
                </div>
            </div>
        </div>
    );
}
