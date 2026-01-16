'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Settings, Save, X } from 'lucide-react';

interface Lead {
    [key: string]: any;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ clean_zalo_link: '', registration_link: '' });
    const [savingSettings, setSavingSettings] = useState(false);

    const fetchLeads = async () => {
        const token = sessionStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin');
            return;
        }

        try {
            setRefreshing(true);
            const res = await fetch('/api/admin/leads', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) {
                toast.error("Sai mã PIN! Vui lòng đăng nhập lại.");
                sessionStorage.removeItem('admin_token');
                router.push('/admin');
                return;
            }
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            if (Array.isArray(data)) {
                setLeads([...data].reverse());
            } else {
                setLeads([]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải dữ liệu.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setSettings(data);
        } catch (e) {
            console.error(e);
        }
    };

    const saveSettings = async () => {
        const token = sessionStorage.getItem('admin_token');
        setSavingSettings(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success("Đã lưu cấu hình!");
                setShowSettings(false);
            } else {
                toast.error("Lưu thất bại!");
            }
        } catch (e) {
            toast.error("Lỗi kết nối!");
        } finally {
            setSavingSettings(false);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchSettings();
    }, []);

    // Extract headers dynamically
    const headers = leads.length > 0 ? Object.keys(leads[0]) : [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-[95%] mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-text-main">
                        Danh sách tất cả đơn hàng ({leads.length})
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm font-medium"
                        >
                            <Settings className="w-5 h-5" />
                            Cấu hình
                        </button>
                        <button
                            onClick={fetchLeads}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors shadow-sm font-medium disabled:opacity-70"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-text-muted font-semibold border-b border-slate-200">
                            <tr>
                                {headers.map(header => (
                                    <th key={header} className="px-6 py-4 whitespace-nowrap">{header}</th>
                                ))}
                                {headers.length === 0 && <th className="px-6 py-4">Thông tin</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.map((lead, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    {headers.map(header => (
                                        <td key={`${idx}-${header}`} className="px-6 py-4 whitespace-nowrap text-text-main max-w-md truncate">
                                            {/* Simple formatting for basic types */}
                                            {typeof lead[header] === 'object' && lead[header] !== null
                                                ? JSON.stringify(lead[header])
                                                : String(lead[header])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={headers.length || 1} className="px-6 py-12 text-center text-text-muted">
                                        Chưa có dữ liệu nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg">Cấu hình hệ thống</h3>
                            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-200 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">
                                    Link Zalo (Tư vấn)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={settings.clean_zalo_link}
                                    onChange={e => setSettings({ ...settings, clean_zalo_link: e.target.value })}
                                    placeholder="https://zalo.me/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">
                                    Link Đăng Ký (Lên đơn ngay)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={settings.registration_link}
                                    onChange={e => setSettings({ ...settings, registration_link: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-text-muted font-medium hover:bg-slate-200 rounded-lg"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={saveSettings}
                                disabled={savingSettings}
                                className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover flex items-center gap-2"
                            >
                                {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
