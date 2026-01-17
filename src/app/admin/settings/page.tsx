'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useGlobalSettings, useUpdateGlobalSetting } from '@/hooks/usePricingRules';
import { toast, Toaster } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { data: settings, isLoading: isLoadingSettings, refetch } = useGlobalSettings();
    const updateSetting = useUpdateGlobalSetting();

    const [exchangeRate, setExchangeRate] = useState('3960');
    const [hotline, setHotline] = useState('');
    const [zaloLink, setZaloLink] = useState('');

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

    // Load settings
    useEffect(() => {
        if (settings) {
            const rate = settings.find(s => s.key === 'exchange_rate');
            const phone = settings.find(s => s.key === 'hotline');
            const zalo = settings.find(s => s.key === 'zalo_link');

            if (rate) setExchangeRate(rate.value);
            if (phone) setHotline(phone.value);
            if (zalo) setZaloLink(zalo.value);
        }
    }, [settings]);

    const handleSave = async () => {
        try {
            toast.loading('Đang lưu...');

            await Promise.all([
                updateSetting.mutateAsync({ key: 'exchange_rate', value: exchangeRate }),
                updateSetting.mutateAsync({ key: 'hotline', value: hotline }),
                updateSetting.mutateAsync({ key: 'zalo_link', value: zaloLink }),
            ]);

            toast.dismiss();
            toast.success('Đã lưu cài đặt!');
            refetch();
        } catch (error) {
            toast.dismiss();
            console.error('Save error:', error);
            toast.error('Lỗi khi lưu cài đặt');
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                    {/* Exchange Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tỷ giá (1 CNY = ? VND)
                        </label>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-400">¥1 =</span>
                            <input
                                type="number"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(e.target.value)}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-bold"
                                placeholder="3960"
                            />
                            <span className="text-2xl font-bold text-gray-400">₫</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Tỷ giá này sẽ được sử dụng để tính toán trong calculator
                        </p>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Hotline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số hotline
                        </label>
                        <input
                            type="tel"
                            value={hotline}
                            onChange={(e) => setHotline(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0912345678"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Số điện thoại hỗ trợ khách hàng
                        </p>
                    </div>

                    {/* Zalo Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link Zalo OA
                        </label>
                        <input
                            type="url"
                            value={zaloLink}
                            onChange={(e) => setZaloLink(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://zalo.me/tinhtienvetay"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Link Zalo Official Account để khách hàng liên hệ
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                    <button
                        onClick={handleSave}
                        disabled={updateSetting.isPending}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {updateSetting.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>

                    <button
                        onClick={() => refetch()}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <RefreshCw size={20} />
                        Làm mới
                    </button>
                </div>
            </div>

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
