'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const [pin, setPin] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, verify with server. Here we just store it and let the API reject if wrong.
        // Or simple client-side check if we wanted, but let's just save to session.
        if (pin.length < 4) {
            toast.error('Mã PIN quá ngắn');
            return;
        }

        // Save to session storage
        sessionStorage.setItem('admin_token', pin);
        toast.success('Đang đăng nhập...');
        router.push('/admin/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Card className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Hệ Thống Quản Trị</h1>
                    <p className="text-text-muted mb-6">Nhập mã PIN để truy cập</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Nhập mã PIN..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center text-lg tracking-widest"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all"
                        >
                            ĐĂNG NHẬP
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
