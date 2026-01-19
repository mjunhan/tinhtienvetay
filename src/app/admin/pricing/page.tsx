'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { usePricingRules, useServiceFeeRules, useShippingRateRules } from '@/hooks/usePricingRules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import { DollarSign, Truck, Info, Pencil, Save, RefreshCw } from 'lucide-react';
import { EditServiceFeeDialog } from '@/components/admin/pricing/EditServiceFeeDialog';
import { EditShippingRateDialog } from '@/components/admin/pricing/EditShippingRateDialog';
import type { ServiceFeeRule, ShippingRateRule } from '@/types/database.types';
import { GlobalServiceFeeTable } from '@/components/pricing/GlobalServiceFeeTable';
import { OfficialShippingTable } from '@/components/pricing/OfficialShippingTable';
import { NormalShippingTable } from '@/components/pricing/NormalShippingTable';
import { TmdtShippingTable } from '@/components/pricing/TmdtShippingTable';

export default function AdminPricingPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'service' | 'shipping'>('service');
    const [shippingSubTab, setShippingSubTab] = useState<'official' | 'other'>('official');

    // Dialog states (Still used for Official and Service Fees if needed, or we might deprecate)
    // For now we keep Service Fees editable via Dialog as they are complex to edit inline in the current GlobalTable component
    const [editingServiceFee, setEditingServiceFee] = useState<ServiceFeeRule | null>(null);
    const [editingShippingRate, setEditingShippingRate] = useState<ShippingRateRule | null>(null);

    // Data Hooks
    const { data: pricing, isLoading: isLoadingPricing, refetch: refetchPricing } = usePricingRules();
    const { data: serviceFees, isLoading: isLoadingFees } = useServiceFeeRules();
    const { data: shippingRates, isLoading: isLoadingRates } = useShippingRateRules();

    // Local State for Batch Editing (Normal & TMDT)
    const [normalShippingData, setNormalShippingData] = useState<any[]>([]);
    const [tmdtShippingData, setTmdtShippingData] = useState<any[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Sync local state with fetched data
    useEffect(() => {
        if (pricing?.normal_shipping) {
            setNormalShippingData(JSON.parse(JSON.stringify(pricing.normal_shipping)));
        }
    }, [pricing?.normal_shipping]);

    useEffect(() => {
        if (pricing?.tmdt_shipping) {
            setTmdtShippingData(JSON.parse(JSON.stringify(pricing.tmdt_shipping)));
        }
    }, [pricing?.tmdt_shipping]);

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

    // Update Handlers
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

    // Batch Save Mutation
    const saveChangesMutation = useMutation({
        mutationFn: async () => {
            const updates = [];

            // Process Normal Shipping Updates
            for (const tier of normalShippingData) {
                // Update HN Rule
                if (tier.hn_rule_id) {
                    updates.push(
                        supabase.from('shipping_rate_rules').update({ price: tier.hn_actual }).eq('id', tier.hn_rule_id)
                    );
                }
                // Update HCM Rule
                if (tier.hcm_rule_id) {
                    updates.push(
                        supabase.from('shipping_rate_rules').update({ price: tier.hcm_actual }).eq('id', tier.hcm_rule_id)
                    );
                }
                // Update Service Fee Rule
                if (tier.fee_rule_id) {
                    updates.push(
                        supabase.from('service_fee_rules').update({ fee_percent: tier.fee_percent }).eq('id', tier.fee_rule_id)
                    );
                }
            }

            // Process TMDT Shipping Updates
            for (const tier of tmdtShippingData) {
                if (tier.hn_rule_id) {
                    updates.push(
                        supabase.from('shipping_rate_rules').update({ price: tier.hn_actual }).eq('id', tier.hn_rule_id)
                    );
                }
                if (tier.hcm_rule_id) {
                    updates.push(
                        supabase.from('shipping_rate_rules').update({ price: tier.hcm_actual }).eq('id', tier.hcm_rule_id)
                    );
                }
                if (tier.fee_rule_id) {
                    updates.push(
                        supabase.from('service_fee_rules').update({ fee_percent: tier.fee_percent }).eq('id', tier.fee_rule_id)
                    );
                }
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

    if (isLoading || isLoadingPricing) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20"> {/* pb-20 for floating button */}
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý giá</h1>
                <p className="text-gray-600 mt-2">Chỉnh sửa bảng giá hiển thị công khai</p>
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
                            <p className="font-semibold mb-1">Phí dịch vụ</p>
                            <p>Hiển thị bảng phí dịch vụ toàn cục. (Hiện tại chỉ hiển thị, chưa hỗ trợ sửa trực tiếp tại đây).</p>
                        </div>
                    </div>
                    {/* Using Shared Component */}
                    <GlobalServiceFeeTable mode="view" />
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
                                    <p>Giá được hiển thị dựa trên cấu hình "Cân nặng" hoặc "Thể tích". Để sửa, vui lòng sử dụng tính năng "Sửa nhanh" (Coming Soon) hoặc liên hệ dev.</p>
                                </div>
                            </div>
                            <OfficialShippingTable rules={shippingRates || []} mode="view" />
                        </div>
                    )}

                    {/* Other shipping methods (TMDT, Tiểu Ngạch) */}
                    {shippingSubTab === 'other' && (
                        <div className="space-y-12">
                            {/* Normal Shipping */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-slate-800">Vận Chuyển Thường (Tiểu Ngạch)</h2>
                                    {hasChanges && <span className="text-amber-600 font-semibold animate-pulse">Có thay đổi chưa lưu...</span>}
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
                                    {hasChanges && <span className="text-amber-600 font-semibold animate-pulse">Có thay đổi chưa lưu...</span>}
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

            {/* Floating Save Button */}
            {hasChanges && (
                <div className="fixed bottom-8 right-8 z-50 animate-bounce">
                    <button
                        onClick={() => saveChangesMutation.mutate()}
                        disabled={saveChangesMutation.isPending}
                        className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full shadow-2xl hover:bg-blue-700 font-bold text-lg disabled:opacity-50"
                    >
                        {saveChangesMutation.isPending ? (
                            <>
                                <RefreshCw className="w-6 h-6 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="w-6 h-6" />
                                Lưu Thay Đổi
                            </>
                        )}
                    </button>
                </div>
            )}

            <Toaster position="top-right" />
        </div>
    );
}
