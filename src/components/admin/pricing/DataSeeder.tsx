import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { DEFAULT_SERVICE_FEES, DEFAULT_OFFICIAL_RATES, DEFAULT_TIEU_NGACH_RATES, DEFAULT_TMDT_RATES } from '@/lib/constants';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function DataSeeder() {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleReset = async () => {
        if (!confirm('Hành động này sẽ XÓA TOÀN BỘ dữ liệu phí dịch vụ và giá vận chuyển hiện tại và khôi phục về mặc định. Bạn có chắc chắn không?')) {
            return;
        }

        setIsLoading(true);
        try {
            // 1. Delete all existing Service Fees & Official Rates
            // Be careful not to delete Normal/TMDT unless intended. Spec confirms: Reset All.

            // Delete Service Fees
            const { error: delFeeErr } = await supabase.from('service_fee_rules').delete().in('method', ['TieuNgach', 'TMDT']);
            if (delFeeErr) throw delFeeErr;

            // Delete Shipping Rates (ChinhNgach, TieuNgach, TMDT)
            const { error: delRateErr } = await supabase.from('shipping_rate_rules').delete().in('method', ['ChinhNgach', 'TieuNgach', 'TMDT']);
            if (delRateErr) throw delRateErr;

            // 2. Insert Defaults
            const { error: insFeeErr } = await supabase.from('service_fee_rules').insert(DEFAULT_SERVICE_FEES);
            if (insFeeErr) throw insFeeErr;

            const { error: insRateErr } = await supabase.from('shipping_rate_rules').insert([
                ...DEFAULT_OFFICIAL_RATES,
                ...DEFAULT_TIEU_NGACH_RATES,
                ...DEFAULT_TMDT_RATES
            ]);
            if (insRateErr) throw insRateErr;

            toast.success('Đã khôi phục dữ liệu gốc thành công!');

            // 3. Invalidate Queries to refresh UI
            queryClient.invalidateQueries({ queryKey: ['service-fees'] });
            queryClient.invalidateQueries({ queryKey: ['shipping-rates'] });
            queryClient.invalidateQueries({ queryKey: ['pricing'] });


        } catch (error: any) {
            console.error('Seeding error:', error);
            toast.error('Lỗi khi khôi phục dữ liệu: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div className="flex items-start gap-3">
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-red-900 text-lg">Khôi phục dữ liệu gốc</h3>
                    <p className="text-red-700 text-sm max-w-xl">
                        Nếu bảng giá bị lỗi hoặc mất dữ liệu, bạn có thể sử dụng chức năng này để thiết lập lại các mức phí và giá vận chuyển mặc định ban đầu.
                    </p>
                </div>
            </div>
            <Button
                onClick={handleReset}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white min-w-[200px]"
            >
                <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Đang khôi phục...' : 'Reset Default Data'}
            </Button>
        </div>
    );
}
