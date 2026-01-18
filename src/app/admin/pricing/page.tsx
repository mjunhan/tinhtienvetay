'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useServiceFeeRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { useMutation } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { DollarSign, Truck, Info, Pencil } from 'lucide-react';
import { EditServiceFeeDialog } from '@/components/admin/pricing/EditServiceFeeDialog';
import { EditShippingRateDialog } from '@/components/admin/pricing/EditShippingRateDialog';
import { AdminPricingTable } from '@/components/admin/pricing/AdminPricingTable';
import type { ServiceFeeRule, ShippingRateRule } from '@/types/database.types';

export default function AdminPricingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'service' | 'shipping'>('service');
    const [shippingSubTab, setShippingSubTab] = useState<'official' | 'other'>('official');

    // Dialog states
    const [editingServiceFee, setEditingServiceFee] = useState<ServiceFeeRule | null>(null);
    const [editingShippingRate, setEditingShippingRate] = useState<ShippingRateRule | null>(null);
    // Helper state for creating new rule with defaults
    const [createTemplate, setCreateTemplate] = useState<Partial<ShippingRateRule>>({});

    const { data: serviceFees, isLoading: isLoadingFees, refetch: refetchFees } = useServiceFeeRules();
    const { data: shippingRates, isLoading: isLoadingRates, refetch: refetchRates } = useShippingRateRules();

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('shipping_rate_rules')
                .delete()
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            toast.success('Đã xóa thành công');
            refetchRates();
        },
        onError: () => {
            toast.error('Lỗi khi xóa');
        }
    });

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

    // --- COLUMNS DEFINITIONS ---

    // 1. Tieu Ngach Checks
    const tieuNgachColumns = [
        {
            header: "Mức cân (kg)",
            accessor: (r: ShippingRateRule) => <span className="font-medium text-slate-900">{r.min_value} - {r.max_value === 999999999 ? 'Trở lên' : r.max_value} kg</span>
        },
        {
            header: "Kho",
            accessor: (r: ShippingRateRule) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.warehouse === 'HN' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {r.warehouse}
                </span>
            )
        },
        {
            header: "Giá cước (VNĐ)",
            accessor: (r: ShippingRateRule) => <span className="font-bold text-red-600">{formatMoney(r.price)}</span>,
            className: "text-center"
        }
    ];

    // 2. TMDT Checks
    const tmdtColumns = [
        {
            header: "Giá trị đơn (VNĐ)",
            accessor: (r: ShippingRateRule) => <span className="font-medium text-slate-900">{formatMoney(r.min_value)} - {r.max_value === 999999999 ? 'Trở lên' : formatMoney(r.max_value)}</span>
        },
        {
            header: "Kho",
            accessor: (r: ShippingRateRule) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.warehouse === 'HN' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {r.warehouse}
                </span>
            )
        },
        {
            header: "Đơn giá",
            accessor: (r: ShippingRateRule) => <span className="font-bold text-red-600">{formatMoney(r.price)}</span>,
            className: "text-center"
        }
    ];

    // 3. Chinh Ngach Checks
    const chinhNgachColumns = [
        {
            header: "Mức lượng",
            accessor: (r: ShippingRateRule) => <span className="font-medium text-slate-900">{r.min_value} - {r.max_value === 999999999 ? 'Trở lên' : r.max_value} {r.type === 'volume_based' ? 'm³' : 'kg'}</span>
        },
        {
            header: "Kho",
            accessor: (r: ShippingRateRule) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.warehouse === 'HN' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {r.warehouse}
                </span>
            )
        },
        {
            header: "Đơn giá",
            accessor: (r: ShippingRateRule) => <span className="font-bold text-red-600">{formatMoney(r.price)}</span>,
            className: "text-center"
        }
    ];

    // Handlers
    const handleEdit = (rule: ShippingRateRule) => setEditingShippingRate(rule);
    const handleDelete = (id: string) => deleteMutation.mutate(id);
    const handleCreate = (method: 'TieuNgach' | 'TMDT' | 'ChinhNgach', type: 'weight_based' | 'value_based' | 'volume_based' = 'weight_based', warehouse: 'HN' | 'HCM' = 'HN', subtype: 'heavy' | 'bulky' | null = null) => {
        // Prepare template for new rule
        const template: Partial<ShippingRateRule> = {
            method,
            type,
            warehouse,
            subtype,
            min_value: 0,
            max_value: 999999999,
            price: 0
        };
        // We set editingShippingRate with a partial object that mimics a new rule (no id)
        // But the dialog expects ShippingRateRule (with id). 
        // We can pass a "fake" object with empty id to signal creation mode.
        setEditingShippingRate({ ...template, id: '' } as ShippingRateRule);
    };


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

                    {/* Sub-tabs for shipping */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2">
                        <button
                            onClick={() => setShippingSubTab('official')}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${shippingSubTab === 'official'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Line Chính Ngạch
                        </button>
                        <button
                            onClick={() => setShippingSubTab('other')}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${shippingSubTab === 'other'
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            TMDT & Tiểu Ngạch
                        </button>
                    </div>

                    {/* Official Line (Chính Ngạch) */}
                    {shippingSubTab === 'official' && (
                        <div className="space-y-8">
                            <AdminPricingTable
                                title="Chính Ngạch - Hàng Nặng (Kg)"
                                rules={shippingRates?.filter(r => r.method === 'ChinhNgach' && r.type === 'weight_based') || []}
                                columns={chinhNgachColumns}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCreate={() => handleCreate('ChinhNgach', 'weight_based')}
                            />

                            <AdminPricingTable
                                title="Chính Ngạch - Hàng Cồng Kềnh (m³)"
                                rules={shippingRates?.filter(r => r.method === 'ChinhNgach' && r.type === 'volume_based') || []}
                                columns={chinhNgachColumns}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCreate={() => handleCreate('ChinhNgach', 'volume_based')}
                            />
                        </div>
                    )}

                    {/* Other shipping methods (TMDT, Tiểu Ngạch) */}
                    {shippingSubTab === 'other' && (
                        <div className="space-y-8">
                            <AdminPricingTable
                                title="Vận Chuyển Thường (Tiểu Ngạch)"
                                rules={shippingRates?.filter(r => r.method === 'TieuNgach') || []}
                                columns={tieuNgachColumns}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCreate={() => handleCreate('TieuNgach', 'weight_based')} // Assuming Weight based per prompt
                            />

                            <AdminPricingTable
                                title="Line TMĐT"
                                rules={shippingRates?.filter(r => r.method === 'TMDT') || []}
                                columns={tmdtColumns}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCreate={() => handleCreate('TMDT', 'value_based')} // Assuming Value based usually
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Edit Rule Dialog */}
            {editingShippingRate && (
                <EditShippingRateDialog
                    open={true}
                    onClose={() => setEditingShippingRate(null)}
                    shippingRate={editingShippingRate}
                />
            )}

            {/* Edit Service Fee Dialog (Unchanged logic) */}
            {editingServiceFee && (
                <EditServiceFeeDialog
                    open={true}
                    onClose={() => setEditingServiceFee(null)}
                    serviceFee={editingServiceFee}
                />
            )}

            <Toaster position="top-center" />
        </div>
    );
}
