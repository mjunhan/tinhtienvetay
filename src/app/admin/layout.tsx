'use client';

import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReactNode, useEffect, useState } from 'react';
import { Home, Settings, DollarSign, LogOut, Menu, X, ArrowLeft, FileText, List, MessageSquare } from 'lucide-react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Check auth status and get user email
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserEmail(session.user.email || null);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();

            // Clear auth cookies
            document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            toast.success('Đã đăng xuất');
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Lỗi đăng xuất');
        }
    };

    const navItems = [
        { href: '/admin', label: 'Tổng quan', icon: Home },
        { href: '/admin/posts', label: 'Bài viết', icon: FileText },
        { href: '/admin/categories', label: 'Danh mục', icon: List },
        { href: '/admin/comments', label: 'Bình luận', icon: MessageSquare },
        { href: '/admin/pricing', label: 'Quản lý giá', icon: DollarSign },
        { href: '/admin/settings', label: 'Cài đặt chung', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Admin Panel
                </h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300
          lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                        TÍNH TIỀN VỀ TAY
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Admin Dashboard v0.4.2</p>
                </div>

                {/* User Info */}
                {userEmail && (
                    <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Đăng nhập với</p>
                        <p className="text-sm font-medium text-amber-50 truncate">{userEmail}</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-900/20'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }
                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </a>
                        );
                    })}
                </nav>

                {/* Back to Home & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900">
                    <a
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-all mb-1"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Về Trang Chủ</span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
