'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BarChart3, Users, DollarSign, TrendingUp, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Verify auth on mount
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
                <p className="text-gray-600 mt-2">Chào mừng đến với trang quản trị</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Cập nhật khi tích hợp CRM</p>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Khách hàng</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Cập nhật khi tích hợp CRM</p>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Tỷ giá hiện tại</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">3,960₫</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <DollarSign className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-4">1 CNY → 3,960 VND</p>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">0₫</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="text-amber-600" size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Cập nhật khi tích hợp CRM</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Truy cập nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/settings"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <Settings className="text-gray-600 group-hover:text-blue-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900">Cài đặt chung</h3>
                        <p className="text-sm text-gray-600 mt-1">Quản lý tỷ giá, hotline, Zalo</p>
                    </a>

                    <a
                        href="/admin/pricing"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                        <DollarSign className="text-gray-600 group-hover:text-purple-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900">Quản lý giá</h3>
                        <p className="text-sm text-gray-600 mt-1">Chỉnh sửa phí dịch vụ, phí vận chuyển</p>
                    </a>

                    <a
                        href="/"
                        target="_blank"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                        <BarChart3 className="text-gray-600 group-hover:text-green-600 mb-2" size={24} />
                        <h3 className="font-semibold text-gray-900">Xem trang công khai</h3>
                        <p className="text-sm text-gray-600 mt-1">Mở calculator trong tab mới</p>
                    </a>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
                <div className="text-center py-12 text-gray-500">
                    <p>Chưa có dữ liệu</p>
                    <p className="text-sm mt-2">Tích hợp CRM và tracking để xem hoạt động</p>
                </div>
            </div>
        </div>
    );
}
