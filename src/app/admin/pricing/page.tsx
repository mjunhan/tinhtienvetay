'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useServiceFeeRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { toast, Toaster } from 'sonner';
import { DollarSign, Truck, Info } from 'lucide-react';

export default function AdminPricingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'service' | 'shipping'>('service');

    const { data: serviceFees, isLoading: isLoadingFees, refetch: refetchFees } = useServiceFeeRules();
    const { data: shippingRates, isLoading: isLoadingRates, refetch: refetchRates } = useShippingRateRules();

    // Verify auth
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin/login');
            } else {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    if (isLoading || isLoadingFees || isLoadingRates) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý giá</h1>
                <p className="text-gray-600 mt-2">Chỉnh sửa phí dịch vụ và phí vận chuyển</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2">
                <button
                    onClick={() => setActiveTab('service')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'service'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    <DollarSign size={20} />
                    Phí dịch vụ
                </button>
                <button
                    onClick={() => setActiveTab('shipping')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'shipping'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    <Truck size={20} />
                    Phí vận chuyển
                </button>
            </div>

            {/* Service Fees Tab */}
            {activeTab === 'service' && (
                <div className="space-y-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                        <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Phí dịch vụ</p>
                            <p>Phí % dựa trên giá trị đơn hàng và mức đặt cọc (70% hoặc 80%)</p>
                        </div>
                    </div>

                    {/* TMDT Service Fees */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">TMDT</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ (VND)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến (VND)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đặt cọc</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {serviceFees
                                        ?.filter(sf => sf.method === 'TMDT')
                                        .sort((a, b) => a.min_order_value - b.min_order_value)
                                        .map((fee) => (
                                            <tr key={fee.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm">{formatMoney(fee.min_order_value)}₫</td>
                                                <td className="px-6 py-4 text-sm">{formatMoney(fee.max_order_value)}₫</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fee.deposit_percent === 70
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {fee.deposit_percent}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-blue-600">{fee.fee_percent}%</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* TieuNgach Service Fees */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Tiểu Ngạch</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ (VND)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến (VND)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đặt cọc</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {serviceFees
                                        ?.filter(sf => sf.method === 'TieuNgach')
                                        .sort((a, b) => a.min_order_value - b.min_order_value)
                                        .map((fee) => (
                                            <tr key={fee.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm">{formatMoney(fee.min_order_value)}₫</td>
                                                <td className="px-6 py-4 text-sm">{formatMoney(fee.max_order_value)}₫</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fee.deposit_percent === 70
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {fee.deposit_percent}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-green-600">{fee.fee_percent}%</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ChinhNgach Service Fees */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Chính Ngạch</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ (VND)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến (VND)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đặt cọc</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {serviceFees
                                        ?.filter(sf => sf.method === 'ChinhNgach')
                                        .sort((a, b) => a.min_order_value - b.min_order_value)
                                        .map((fee) => (
                                            <tr key={fee.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm">{formatMoney(fee.min_order_value)}₫</td>
                                                <td className="px-6 py-4 text-sm">{formatMoney(fee.max_order_value)}₫</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fee.deposit_percent === 70
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {fee.deposit_percent}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                                                    {fee.fee_percent === 0 ? '300,000₫ cố định' : `${fee.fee_percent}%`}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Shipping Rates Tab - Simplified version showing key rates */}
            {activeTab === 'shipping' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                        <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Phí vận chuyển quốc tế</p>
                            <p>Phí theo trọng lượng (kg) hoặc giá trị đơn hàng, tùy phương thức vận chuyển</p>
                        </div>
                    </div>

                    {/* Summary Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4">Tổng hợp phí vận chuyển</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Tổng số: <strong>{shippingRates?.length || 0}</strong> bản ghi phí vận chuyển
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">TMDT</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {shippingRates?.filter(r => r.method === 'TMDT').length || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600">Tiểu Ngạch</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {shippingRates?.filter(r => r.method === 'TieuNgach').length || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Chính Ngạch</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {shippingRates?.filter(r => r.method === 'ChinhNgach').length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Note about detailed view */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800">
                            Xem chi tiết tất cả shipping rates trong Supabase Table Editor hoặc sử dụng SQL queries.
                            Full table editor UI sẽ được thêm trong phiên bản tiếp theo!
                        </p>
                    </div>
                </div>
            )}

            {/* Note */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                    💡 <strong>Để chỉnh sửa pricing:</strong> Truy cập Supabase Dashboard → Table Editor → Chọn bảng tương ứng
                </p>
            </div>

            <Toaster position="top-center" />
        </div>
    );
}
