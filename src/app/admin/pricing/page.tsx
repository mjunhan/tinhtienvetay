'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useServiceFeeRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { toast, Toaster } from 'sonner';
import { DollarSign, Truck, Info, Pencil } from 'lucide-react';
import { EditServiceFeeDialog } from '@/components/admin/pricing/EditServiceFeeDialog';
import { EditShippingRateDialog } from '@/components/admin/pricing/EditShippingRateDialog';
import type { ServiceFeeRule, ShippingRateRule } from '@/types/database.types';

export default function AdminPricingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'service' | 'shipping'>('service');

    // Dialog states
    const [editingServiceFee, setEditingServiceFee] = useState<ServiceFeeRule | null>(null);
    const [editingShippingRate, setEditingShippingRate] = useState<ShippingRateRule | null>(null);

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

    const renderServiceFeeTable = (method: string, title: string, gradientClass: string, colorClass: string) => {
        const fees = serviceFees?.filter(sf => sf.method === method).sort((a, b) => a.min_order_value - b.min_order_value) || [];

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`${gradientClass} px-6 py-4`}>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Từ (VND)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đến (VND)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đặt cọc</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phí %</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {fees.map((fee) => (
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
                                    <td className={`px-6 py-4 text-sm font-semibold ${colorClass}`}>
                                        {method === 'ChinhNgach' && fee.fee_percent === 0
                                            ? '300,000₫ cố định'
                                            : `${fee.fee_percent}%`}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => setEditingServiceFee(fee)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Pencil size={16} className="text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderShippingRateTable = (
        method: string,
        title: string,
        type: string,
        subtype: string | null,
        gradientClass: string
    ) => {
        const rates = shippingRates?.filter(
            r => r.method === method && r.type === type && (subtype ? r.subtype === subtype : true)
        ).sort((a, b) => a.min_value - b.min_value) || [];

        if (rates.length === 0) return null;

        const getUnit = () => {
            if (type === 'value_based') return 'VND';
            if (type === 'weight_based') return 'kg';
            if (type === 'volume_based') return 'm³';
            return '';
        };

        const getPriceUnit = () => {
            if (type === 'weight_based') return 'VND/kg';
            if (type === 'volume_based') return 'VND/m³';
            return 'VND';
        };

        // Group by value range and warehouse
        const groupedRates: { [key: string]: { rate: ShippingRateRule; hn?: number; hcm?: number } } = {};
        rates.forEach(rate => {
            const key = `${rate.min_value}-${rate.max_value}`;
            if (!groupedRates[key]) {
                groupedRates[key] = { rate };
            }
            if (rate.warehouse === 'HN') {
                groupedRates[key].hn = rate.price;
            } else {
                groupedRates[key].hcm = rate.price;
            }
        });

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className={`${gradientClass} px-6 py-4`}>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Từ ({getUnit()})
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Đến ({getUnit()})
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kho</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Giá ({getPriceUnit()})
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rates.map((rate) => (
                                <tr key={rate.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">
                                        {type === 'value_based' ? formatMoney(rate.min_value) : rate.min_value}
                                        {type !== 'value_based' && ` ${getUnit()}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {type === 'value_based' ? formatMoney(rate.max_value) : rate.max_value}
                                        {type !== 'value_based' && ` ${getUnit()}`}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {rate.warehouse}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                                        {formatMoney(rate.price)} {type === 'value_based' ? '₫' : ''}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => setEditingShippingRate(rate)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Pencil size={16} className="text-gray-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

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

                    {renderServiceFeeTable('TMDT', 'TMDT', 'bg-gradient-to-r from-blue-600 to-purple-600', 'text-blue-600')}
                    {renderServiceFeeTable('TieuNgach', 'Tiểu Ngạch', 'bg-gradient-to-r from-green-600 to-teal-600', 'text-green-600')}
                    {renderServiceFeeTable('ChinhNgach', 'Chính Ngạch', 'bg-gradient-to-r from-purple-600 to-pink-600', 'text-purple-600')}
                </div>
            )}

            {/* Shipping Rates Tab */}
            {activeTab === 'shipping' && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                        <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Phí vận chuyển quốc tế</p>
                            <p>Phí theo trọng lượng (kg) hoặc giá trị đơn hàng, tùy phương thức vận chuyển</p>
                        </div>
                    </div>

                    {renderShippingRateTable('TMDT', 'TMDT - Theo giá trị đơn hàng', 'value_based', null, 'bg-gradient-to-r from-blue-600 to-purple-600')}
                    {renderShippingRateTable('TieuNgach', 'Tiểu Ngạch - Theo giá trị đơn hàng', 'value_based', null, 'bg-gradient-to-r from-green-600 to-teal-600')}
                    {renderShippingRateTable('ChinhNgach', 'Chính Ngạch - Hàng cồng kềnh (theo kg)', 'weight_based', 'heavy', 'bg-gradient-to-r from-purple-600 to-pink-600')}
                    {renderShippingRateTable('ChinhNgach', 'Chính Ngạch - Hàng thể tích (theo m³)', 'volume_based', 'bulky', 'bg-gradient-to-r from-pink-600 to-red-600')}
                </div>
            )}

            {/* Edit Dialogs */}
            {editingServiceFee && (
                <EditServiceFeeDialog
                    open={true}
                    onClose={() => setEditingServiceFee(null)}
                    serviceFee={editingServiceFee}
                />
            )}

            {editingShippingRate && (
                <EditShippingRateDialog
                    open={true}
                    onClose={() => setEditingShippingRate(null)}
                    shippingRate={editingShippingRate}
                />
            )}

            <Toaster position="top-center" />
        </div>
    );
}
