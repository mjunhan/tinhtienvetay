'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { usePricingRules, useServiceFeeRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { DollarSign, Truck, Info } from 'lucide-react';
import { GlobalServiceFeeTable } from '@/components/pricing/GlobalServiceFeeTable';
import { OfficialShippingTable } from '@/components/pricing/OfficialShippingTable';
import { NormalShippingTable } from '@/components/pricing/NormalShippingTable';
import { TmdtShippingTable } from '@/components/pricing/TmdtShippingTable';
import { PricingSaveBar } from '@/components/pricing/PricingSaveBar';

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

    const handleNormalUpdate = useCallback((index: number, field: string, value: number) => {
        setNormalShippingData(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
        setHasChanges(true);
    }, []);

    const handleTmdtUpdate = useCallback((index: number, field: string, value: number) => {
        setTmdtShippingData(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [field]: value };
            return newData;
        });
        setHasChanges(true);
    }, []);

    const handleOfficialUpdate = useCallback((id: string, field: string, value: number) => {
        setOfficialShippingData(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
        setHasChanges(true);
    }, []);

    const handleServiceFeeUpdate = useCallback((id: string, field: string, value: number) => {
        setServiceFeeData(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
        setHasChanges(true);
    }, []);

    // --- Reset / Cancel ---
    const handleReset = () => {
        if (confirm("Bạn có chắc chắn muốn hủy bỏ mọi thay đổi?")) {
            if (pricing?.normal_shipping) setNormalShippingData(JSON.parse(JSON.stringify(pricing.normal_shipping)));
            if (pricing?.tmdt_shipping) setTmdtShippingData(JSON.parse(JSON.stringify(pricing.tmdt_shipping)));
            if (shippingRates) setOfficialShippingData(JSON.parse(JSON.stringify(shippingRates)));
            if (serviceFees) setServiceFeeData(JSON.parse(JSON.stringify(serviceFees)));
            setHasChanges(false);
            toast.info("Đã hủy bỏ thay đổi");
        }
    };

    // --- Batch Save Mutation ---
    const saveChangesMutation = useMutation({
        mutationFn: async () => {
            const updates = [];

            // 1. Normal Shipping
            for (const tier of normalShippingData) {
                if (tier.hn_rule_id) updates.push(supabase.from('shipping_rate_rules').update({ price: tier.hn_actual }).eq('id', tier.hn_rule_id));
                if (tier.hcm_rule_id) updates.push(supabase.from('shipping_rate_rules').update({ price: tier.hcm_actual }).eq('id', tier.hcm_rule_id));
                if (tier.fee_rule_id) updates.push(supabase.from('service_fee_rules').update({ fee_percent: tier.fee_percent }).eq('id', tier.fee_rule_id));
            }

            // 2. TMDT Shipping
            for (const tier of tmdtShippingData) {
                if (tier.hn_rule_id) updates.push(supabase.from('shipping_rate_rules').update({ price: tier.hn_actual }).eq('id', tier.hn_rule_id));
                if (tier.hcm_rule_id) updates.push(supabase.from('shipping_rate_rules').update({ price: tier.hcm_actual }).eq('id', tier.hcm_rule_id));
                if (tier.fee_rule_id) updates.push(supabase.from('service_fee_rules').update({ fee_percent: tier.fee_percent }).eq('id', tier.fee_rule_id));
            }

            // 3. Official Shipping (Direct ID match)
            // Optimization: Only update dirty rows? For simplicity we update all if local state changed, 
            // but ideally we should track dirty IDs. For now, checking against current state is hard without deep diff.
            // We just send update for all rows in the modified array for simplicity (small data set).
            for (const rule of officialShippingData) {
                updates.push(supabase.from('shipping_rate_rules').update({ price: rule.price }).eq('id', rule.id));
            }

            // 4. Service Fees
            for (const fee of serviceFeeData) {
                updates.push(supabase.from('service_fee_rules').update({ fee_percent: fee.fee_percent }).eq('id', fee.id));
            }

            if (updates.length > 0) {
                await Promise.all(updates);
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
            toast.error('Lỗi khi lưu thay đổi: ' + error.message);
        }
    });

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
                    <GlobalServiceFeeTable
                        mode="edit"
                        data={serviceFeeData}
                        onUpdate={handleServiceFeeUpdate}
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
                                    <p>Sửa giá trực tiếp bằng cách click vào số tiền.</p>
                                </div>
                            </div>
                            <OfficialShippingTable
                                rules={officialShippingData}
                                mode="edit"
                                onUpdate={handleOfficialUpdate}
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
                                <NormalShippingTable
                                    data={normalShippingData}
                                    mode="edit"
                                    onUpdate={handleNormalUpdate}
                                />
                            </div>

                            {/* TMDT Shipping */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-slate-800">Line Thương Mại Điện Tử</h2>
                                </div>
                                <TmdtShippingTable
                                    data={tmdtShippingData}
                                    mode="edit"
                                    onUpdate={handleTmdtUpdate}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Pricing Save Bar */}
            <PricingSaveBar
                hasChanges={hasChanges}
                isLoading={saveChangesMutation.isPending}
                onSave={() => saveChangesMutation.mutate()}
                onReset={handleReset}
            />

            <Toaster position="top-right" />
        </div>
    );
}
