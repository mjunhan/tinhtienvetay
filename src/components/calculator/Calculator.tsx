"use client";

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculatorSchema, CalculatorFormValues } from '@/lib/schemas';
import { useCostCalculator } from '@/hooks/useCostCalculator';
import { usePricingRules } from '@/hooks/usePricingRules';
import { InputCard } from './InputCard';
import { ResultCard } from './ResultCard';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function Calculator() {
    const [showResult, setShowResult] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch pricing data using React Query
    const { data: pricingData, isLoading: isPricingLoading, error: pricingError } = usePricingRules();

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<CalculatorFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(calculatorSchema) as any,
        defaultValues: {
            warehouse: 'HN',
            method: 'TMDT',
            deposit: 70,
            products: [
                {
                    id: '1',
                    quantity: 1,
                    price_cny: 0,
                    weight_kg: 0,
                    name: '',
                    link: ''
                }
            ],
            customerName: '',
            customerPhone: ''
        },
        mode: 'onChange'
    });

    // Fetch Settings 
    const [settings, setSettings] = useState<{ clean_zalo_link: string; registration_link: string } | undefined>(undefined);
    useEffect(() => {
        // Fetch Settings
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const formValues = useWatch({ control });

    // Ensure formValues has valid data before calculation to prevent crashes
    // Type assertion needed due to partial form state during data entry
    const safeOrderDetails = {
        warehouse: (formValues.warehouse || 'HN') as 'HN' | 'HCM',
        method: (formValues.method || 'TMDT') as 'TMDT' | 'TieuNgach' | 'ChinhNgach',
        deposit: (formValues.deposit || 70) as 70 | 80,
        products: (formValues.products || []) as { id: string; quantity: number; price_cny: number; weight_kg?: number; internal_ship_cny?: number; dimensions?: { length: number; width: number; height: number }; name?: string; link?: string }[],
        customerName: formValues.customerName || '',
        customerPhone: formValues.customerPhone || ''
    };

    const breakdown = useCostCalculator(safeOrderDetails, pricingData);

    const onSubmit = async (data: CalculatorFormValues) => {
        setIsSubmitting(true);
        console.log("SUBMITTING LEAD:", data);

        try {
            // Prepare payload including the breakdown result
            const payload = {
                ...data,
                ...breakdown, // Include calculated costs
                submittedAt: new Date().toISOString()
            };

            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Gửi thông tin thất bại');
            }

            console.log("Lead saved successfully");
            toast.success("Đã gửi thông tin! Đang hiện bảng giá...");
            setShowResult(true);
        } catch (error) {
            console.error("Error saving lead:", error);
            toast.error("Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Inputs */}
                <div className="lg:col-span-7 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputCard control={control} register={register} errors={errors} />

                        {/* Honeypot Field - Hidden from humans */}
                        <div className="opacity-0 absolute top-0 left-0 h-0 w-0 -z-50 overflow-hidden">
                            <input
                                type="text"
                                tabIndex={-1}
                                autoComplete="off"
                                {...register('bot_check')}
                                placeholder="Do not fill this field"
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || isPricingLoading || !pricingData}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.02] transition-all transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ĐANG TÍNH TOÁN...
                                    </>
                                ) : isPricingLoading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ĐANG TẢI BẢNG GIÁ...
                                    </>
                                ) : pricingError ? (
                                    <>
                                        ⚠️ LỖI TẢI DỮ LIỆU
                                    </>
                                ) : (
                                    "XEM BÁO GIÁ CHI TIẾT"
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-3">
                                * Bằng việc bấm nút này, bạn đồng ý nhận tư vấn từ chúng tôi qua Zalo.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Right Column: Results (Sticky) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8">
                        {showResult ? (
                            <ResultCard
                                breakdown={breakdown}
                                method={formValues.method || 'TMDT'}
                                settings={settings}
                                orderDetails={safeOrderDetails} // Pass details for Invoice
                            />
                        ) : (
                            <div className="h-full min-h-[400px] bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-text-muted">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/2554/2554978.png"
                                        className="w-8 h-8 opacity-50"
                                        alt="Waiting"
                                    />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Chưa có kết quả</h3>
                                <p className="text-sm max-w-[250px]">
                                    Vui lòng nhập thông tin sản phẩm và liên hệ để xem bảng giá chi tiết.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toaster position="bottom-center" />
        </div>
    );
}
