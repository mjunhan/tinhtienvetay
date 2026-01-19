'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { usePricingRules, useServiceFeeRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { DollarSign, Truck, Info } from 'lucide-react';
import { ServiceFeeTable } from '@/components/admin/pricing/ServiceFeeTable'; // NEW
import { OfficialLineTable } from '@/components/admin/pricing/OfficialLineTable'; // NEW
import { AdminValueBasedTable } from '@/components/admin/pricing/AdminValueBasedTable'; // NEW
import { PricingSaveBar } from '@/components/pricing/PricingSaveBar';
import { DataSeeder } from '@/components/admin/pricing/DataSeeder'; // NEW

export default function AdminPricingPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'service' | 'shipping'>('service');
    const [shippingSubTab, setShippingSubTab] = useState<'official' | 'other'>('official');

    // Data Hooks
    const { data: pricing, isLoading: isLoadingPricing } = usePricingRules();
    const { data: serviceFees, isLoading: isLoadingFees } = useServiceFeeRules();
    const { data: shippingRates, isLoading: isLoadingRates } = useShippingRateRules();

    // Local State for Batch Editing
    const [normalShippingData, setNormalShippingData] = useState<any[]>([]);
    const [tmdtShippingData, setTmdtShippingData] = useState<any[]>([]);
    const [officialShippingData, setOfficialShippingData] = useState<any[]>([]);
    const [serviceFeeData, setServiceFeeData] = useState<any[]>([]);

    const [hasChanges, setHasChanges] = useState(false);

    // Sync local state with fetched data
    // Normal & TMDT
    useEffect(() => {
        if (pricing?.normal_shipping) setNormalShippingData(JSON.parse(JSON.stringify(pricing.normal_shipping)));
        if (pricing?.tmdt_shipping) setTmdtShippingData(JSON.parse(JSON.stringify(pricing.tmdt_shipping)));
    }, [pricing]);

    // Official Shipping
    useEffect(() => {
        if (shippingRates) {
            setOfficialShippingData(JSON.parse(JSON.stringify(shippingRates)));
        }
    }, [shippingRates]);

    // Service Fees
    useEffect(() => {
        if (serviceFees) {
            setServiceFeeData(JSON.parse(JSON.stringify(serviceFees)));
        }
    }, [serviceFees]);

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

    // --- Update Handlers ---

    const handleNormalUpdate = useCallback((newData: any[]) => {
        setNormalShippingData(newData);
        setHasChanges(true);
    }, []);

    const handleTmdtUpdate = useCallback((newData: any[]) => {
        setTmdtShippingData(newData);
        setHasChanges(true);
    }, []);

    const handleOfficialUpdate = useCallback((newData: any[]) => {
        setOfficialShippingData(newData);
        setHasChanges(true);
    }, []);

    const handleServiceFeeUpdate = useCallback((newData: any[]) => {
        setServiceFeeData(newData);
        setHasChanges(true);
    }, []);

    // --- Reset / Cancel ---
    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        if (confirm("Bạn có chắc chắn muốn hủy bỏ mọi thay đổi?")) {
            if (pricing?.normal_shipping) setNormalShippingData(JSON.parse(JSON.stringify(pricing.normal_shipping)));
            if (pricing?.tmdt_shipping) setTmdtShippingData(JSON.parse(JSON.stringify(pricing.tmdt_shipping)));
            if (shippingRates) setOfficialShippingData(JSON.parse(JSON.stringify(shippingRates)));
            if (serviceFees) setServiceFeeData(JSON.parse(JSON.stringify(serviceFees)));
            setHasChanges(false);
            setResetKey(prev => prev + 1); // Force table components to remount/reset
            toast.info("Đã hủy bỏ thay đổi");
        }
    };

    // --- Batch Save Mutation ---
    const saveChangesMutation = useMutation({
        mutationFn: async () => {
            // 1. Normal Shipping (TieuNgach) - Upsert & Delete
            if (normalShippingData.length > 0 || pricing?.normal_shipping) {
                // Upsert shipping rates
                const normalShippingRules = [];
                for (const tier of normalShippingData) {
                    // HN Rule
                    normalShippingRules.push({
                        ...(tier.hn_rule_id && { id: tier.hn_rule_id }),
                        method: 'TieuNgach',
                        type: 'value_based',
                        warehouse: 'HN',
                        min_value: tier.min_value,
                        max_value: tier.max_value,
                        price: tier.hn_actual
                    });
                    // HCM Rule
                    normalShippingRules.push({
                        ...(tier.hcm_rule_id && { id: tier.hcm_rule_id }),
                        method: 'TieuNgach',
                        type: 'value_based',
                        warehouse: 'HCM',
                        min_value: tier.min_value,
                        max_value: tier.max_value,
                        price: tier.hcm_actual
                    });
                }

                if (normalShippingRules.length > 0) {
                    const { error: normalUpsertError } = await supabase
                        .from('shipping_rate_rules')
                        .upsert(normalShippingRules);
                    if (normalUpsertError) throw normalUpsertError;
                }

                // Upsert service fees
                const normalServiceFees = [];
                for (const tier of normalShippingData) {
                    if (tier.fee_percent !== undefined) {
                        normalServiceFees.push({
                            ...(tier.fee_rule_id && { id: tier.fee_rule_id }),
                            method: 'TieuNgach',
                            min_order_value: tier.min_value,
                            max_order_value: tier.max_value,
                            deposit_percent: 70, // Default
                            fee_percent: tier.fee_percent
                        });
                    }
                }

                if (normalServiceFees.length > 0) {
                    const { error: feeUpsertError } = await supabase
                        .from('service_fee_rules')
                        .upsert(normalServiceFees);
                    if (feeUpsertError) throw feeUpsertError;
                }

                // Delete missing shipping rates
                const currentNormalShippingIds = normalShippingData
                    .flatMap(t => [t.hn_rule_id, t.hcm_rule_id])
                    .filter(Boolean);
                const originalNormalShippingIds = pricing?.normal_shipping
                    ?.flatMap((t: any) => [t.hn_rule_id, t.hcm_rule_id])
                    .filter(Boolean) || [];
                const normalShippingIdsToDelete = originalNormalShippingIds
                    .filter(id => !currentNormalShippingIds.includes(id));

                if (normalShippingIdsToDelete.length > 0) {
                    await supabase.from('shipping_rate_rules').delete().in('id', normalShippingIdsToDelete);
                }

                // Delete missing service fees
                const currentNormalFeeIds = normalShippingData
                    .map(t => t.fee_rule_id)
                    .filter(Boolean);
                const originalNormalFeeIds = pricing?.normal_shipping
                    ?.map((t: any) => t.fee_rule_id)
                    .filter(Boolean) || [];
                const normalFeeIdsToDelete = originalNormalFeeIds
                    .filter(id => !currentNormalFeeIds.includes(id));

                if (normalFeeIdsToDelete.length > 0) {
                    await supabase.from('service_fee_rules').delete().in('id', normalFeeIdsToDelete);
                }
            }

            // 2. TMDT Shipping - Upsert & Delete
            if (tmdtShippingData.length > 0 || pricing?.tmdt_shipping) {
                // Upsert shipping rates
                const tmdtShippingRules = [];
                for (const tier of tmdtShippingData) {
                    // HN Rule
                    tmdtShippingRules.push({
                        ...(tier.hn_rule_id && { id: tier.hn_rule_id }),
                        method: 'TMDT',
                        type: 'value_based',
                        warehouse: 'HN',
                        min_value: tier.min_value,
                        max_value: tier.max_value,
                        price: tier.hn_actual
                    });
                    // HCM Rule
                    tmdtShippingRules.push({
                        ...(tier.hcm_rule_id && { id: tier.hcm_rule_id }),
                        method: 'TMDT',
                        type: 'value_based',
                        warehouse: 'HCM',
                        min_value: tier.min_value,
                        max_value: tier.max_value,
                        price: tier.hcm_actual
                    });
                }

                if (tmdtShippingRules.length > 0) {
                    const { error: tmdtUpsertError } = await supabase
                        .from('shipping_rate_rules')
                        .upsert(tmdtShippingRules);
                    if (tmdtUpsertError) throw tmdtUpsertError;
                }

                // Delete missing shipping rates
                const currentTmdtShippingIds = tmdtShippingData
                    .flatMap(t => [t.hn_rule_id, t.hcm_rule_id])
                    .filter(Boolean);
                const originalTmdtShippingIds = pricing?.tmdt_shipping
                    ?.flatMap((t: any) => [t.hn_rule_id, t.hcm_rule_id])
                    .filter(Boolean) || [];
                const tmdtShippingIdsToDelete = originalTmdtShippingIds
                    .filter(id => !currentTmdtShippingIds.includes(id));

                if (tmdtShippingIdsToDelete.length > 0) {
                    await supabase.from('shipping_rate_rules').delete().in('id', tmdtShippingIdsToDelete);
                }
            }

            // 3. Official Shipping (Upsert & Delete)
            if (officialShippingData.length > 0 || shippingRates && shippingRates.length > 0) {
                // Upsert (Insert or Update)
                if (officialShippingData.length > 0) {
                    const { error: upsertError } = await supabase
                        .from('shipping_rate_rules')
                        .upsert(officialShippingData.map(r => ({
                            id: r.id, // ID undefined = New Insert
                            method: 'ChinhNgach',
                            type: r.type,
                            subtype: r.subtype,
                            warehouse: r.warehouse,
                            min_value: r.min_value,
                            max_value: r.max_value,
                            price: r.price
                        })).map(r => {
                            if (!r.id) delete r.id; // Ensure Supabase treats as insert
                            return r;
                        }));
                    if (upsertError) throw upsertError;
                }

                // Delete Missing IDs
                const currentIds = officialShippingData.filter(r => r.id).map(r => r.id);
                const originalIds = shippingRates?.filter(r => r.method === 'ChinhNgach').map(r => r.id) || [];
                const idsToDelete = originalIds.filter(id => !currentIds.includes(id));

                if (idsToDelete.length > 0) {
                    await supabase.from('shipping_rate_rules').delete().in('id', idsToDelete);
                }
            }

            // 4. Service Fees (Upsert & Delete)
            if (serviceFeeData.length > 0 || serviceFees && serviceFees.length > 0) {
                // Upsert
                if (serviceFeeData.length > 0) {
                    const { error: upsertFeeError } = await supabase
                        .from('service_fee_rules')
                        .upsert(serviceFeeData.map(r => ({
                            id: r.id,
                            method: 'TieuNgach',
                            min_order_value: r.min_order_value,
                            max_order_value: r.max_order_value,
                            deposit_percent: r.deposit_percent,
                            fee_percent: r.fee_percent
                        })).map(r => {
                            if (!r.id) delete r.id;
                            return r;
                        }));
                    if (upsertFeeError) throw upsertFeeError;
                }

                // Delete Missing
                const currentFeeIds = serviceFeeData.filter(r => r.id).map(r => r.id);
                const originalFeeIds = serviceFees?.map(r => r.id) || [];
                const feesToDelete = originalFeeIds.filter(id => !currentFeeIds.includes(id));

                if (feesToDelete.length > 0) {
                    await supabase.from('service_fee_rules').delete().in('id', feesToDelete);
                }
            }
        },
        onSuccess: () => {
            toast.success('Đã lưu thay đổi thành công!');
            setHasChanges(false);
            queryClient.invalidateQueries({ queryKey: ['pricing'] });
            queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
            queryClient.invalidateQueries({ queryKey: ['service-fees'] });
        },
        onError: (error) => {
            console.error('Save failed:', error);
            // We can also trigger the toast here if we want global visibility
            toast.error('Lỗi khi lưu thay đổi: ' + error.message);
        }
    });

    const handleSave = async () => {
        try {
            await saveChangesMutation.mutateAsync();
        } catch (error) {
            // Error is already handled in onError, but we catch it here to prevent unhandled promise rejection crashes
            console.error("Save transaction failed (caught in handleSave):", error);
        }
    };

    if (isLoading || isLoadingPricing || isLoadingFees || isLoadingRates) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý giá</h1>
                <p className="text-gray-600 mt-2">Chỉnh sửa bảng giá hiển thị công khai. Nhấn vào ô giá trị để sửa.</p>
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
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                        <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Cấu hình Phí dịch vụ</p>
                            <p>Sửa trực tiếp số % trong bảng bên dưới. Thay đổi sẽ áp dụng sau khi bấm 'Lưu'.</p>
                        </div>
                    </div>
                    {/* NEW COMPONENT */}
                    <ServiceFeeTable
                        key={resetKey}
                        data={serviceFeeData}
                        onDataChange={handleServiceFeeUpdate}
                    />
                </div>
            )}

            {/* Shipping Rates Tab */}
            {activeTab === 'shipping' && (
                <div className="space-y-6">
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
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                                <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Cấu hình Line Chính Ngạch</p>
                                    <p>Sửa giá và các mốc cân nặng/thể tích trực tiếp.</p>
                                </div>
                            </div>
                            {/* NEW COMPONENT */}
                            <OfficialLineTable
                                key={resetKey}
                                rules={officialShippingData}
                                onDataChange={handleOfficialUpdate}
                            />
                        </div>
                    )}

                    {/* Other shipping methods (TMDT, Tiểu Ngạch) */}
                    {shippingSubTab === 'other' && (
                        <div className="space-y-12">
                            {/* Normal Shipping */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-slate-800">Vận Chuyển Thường (Tiểu Ngạch)</h2>
                                </div>
                                <AdminValueBasedTable
                                    key={resetKey}
                                    data={normalShippingData}
                                    onDataChange={handleNormalUpdate}
                                    showFeeColumn={true}
                                    title="Vận Chuyển Thường"
                                    color="green"
                                />
                            </div>

                            {/* TMDT Shipping */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-slate-800">Line Thương Mại Điện Tử</h2>
                                </div>
                                <AdminValueBasedTable
                                    key={resetKey}
                                    data={tmdtShippingData}
                                    onDataChange={handleTmdtUpdate}
                                    showFeeColumn={false}
                                    title="Line TMĐT"
                                    color="red"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* DATA SEEDER SECTION */}
            <DataSeeder />

            {/* Pricing Save Bar */}
            <PricingSaveBar
                hasChanges={hasChanges}
                isLoading={saveChangesMutation.isPending}
                onSave={handleSave}
                onReset={handleReset}
            />

            <Toaster position="top-right" />
        </div>
    );
}

