'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/usePricingRules';
import { toast, Toaster } from 'sonner';
import { Save, RefreshCw, Loader2 } from 'lucide-react';
import { globalSettingsSchema, type GlobalSettingsFormData } from '@/schemas/admin';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

export default function AdminSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { data: settings, isLoading: isLoadingSettings, refetch } = useGlobalSettings();
    const updateSetting = useUpdateGlobalSetting();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<GlobalSettingsFormData>({
        resolver: zodResolver(globalSettingsSchema),
        defaultValues: {
            exchange_rate: '3960',
            hotline: '',
            zalo_link: '',
        },
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

    // Load settings and update form
    useEffect(() => {
        if (settings) {
            const rate = settings.find(s => s.key === 'exchange_rate');
            const phone = settings.find(s => s.key === 'hotline');
            const zalo = settings.find(s => s.key === 'zalo_link');

            reset({
                exchange_rate: rate?.value || '3960',
                hotline: phone?.value || '',
                zalo_link: zalo?.value || '',
            });
        }
    }, [settings, reset]);

    const onSubmit = async (data: GlobalSettingsFormData) => {
        try {
            await Promise.all([
                updateSetting.mutateAsync({ key: 'exchange_rate', value: data.exchange_rate }),
                updateSetting.mutateAsync({ key: 'hotline', value: data.hotline }),
                updateSetting.mutateAsync({ key: 'zalo_link', value: data.zalo_link }),
            ]);

            toast.success('Cập nhật thành công!');
            refetch();
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Lỗi khi lưu cài đặt. Vui lòng thử lại.');
        }
    };

    if (isLoading || isLoadingSettings) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Cài đặt chung</h1>
                <p className="text-gray-600 mt-2">Quản lý tỷ giá và thông tin liên hệ</p>
            </div>

            {/* Settings Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                        {/* Exchange Rate */}
                        <div>
                            <Label htmlFor="exchange_rate" required>
                                Tỷ giá (1 CNY = ? VND)
                            </Label>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-bold text-gray-400">¥1 =</span>
                                <Input
                                    id="exchange_rate"
                                    type="text"
                                    {...register('exchange_rate')}
                                    className="flex-1 text-2xl font-bold"
                                    placeholder="3960"
                                />
                                <span className="text-2xl font-bold text-gray-400">₫</span>
                            </div>
                            {errors.exchange_rate && (
                                <p className="text-sm text-red-600 mt-2">
                                    {errors.exchange_rate.message}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Tỷ giá này sẽ được sử dụng để tính toán trong calculator
                            </p>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Hotline */}
                        <div>
                            <Label htmlFor="hotline" required>
                                Số hotline
                            </Label>
                            <Input
                                id="hotline"
                                type="tel"
                                {...register('hotline')}
                                placeholder="0912345678"
                            />
                            {errors.hotline && (
                                <p className="text-sm text-red-600 mt-2">
                                    {errors.hotline.message}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Số điện thoại hỗ trợ khách hàng
                            </p>
                        </div>

                        {/* Zalo Link */}
                        <div>
                            <Label htmlFor="zalo_link" required>
                                Link Zalo OA
                            </Label>
                            <Input
                                id="zalo_link"
                                type="url"
                                {...register('zalo_link')}
                                placeholder="https://zalo.me/tinhtienvetay"
                            />
                            {errors.zalo_link && (
                                <p className="text-sm text-red-600 mt-2">
                                    {errors.zalo_link.message}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Link Zalo Official Account để khách hàng liên hệ
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-8">
                        <button
                            type="submit"
                            disabled={updateSetting.isPending}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateSetting.isPending ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Lưu thay đổi
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            disabled={updateSetting.isPending}
                            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={20} />
                            Làm mới
                        </button>
                    </div>
                </div>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Lưu ý</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Sau khi thay đổi tỷ giá, calculator sẽ tự động cập nhật</li>
                    <li>Khách hàng sẽ thấy giá mới ngay lập tức</li>
                    <li>Thông tin liên hệ có thể được sử dụng trong trang công khai</li>
                </ul>
            </div>

            <Toaster position="top-center" />
        </div>
    );
}
