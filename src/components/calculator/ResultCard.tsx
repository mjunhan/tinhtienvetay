import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { CostBreakdown } from '@/types';
import { formatVND, formatCNY, formatNumber } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Wallet, Truck, Box } from 'lucide-react';

interface ResultCardProps {
    breakdown: CostBreakdown;
    method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
    settings?: {
        clean_zalo_link: string;
        registration_link: string;
    };
}

function AnimatedNumber({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => formatNumber(Math.round(current)));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

function AnimatedMoney({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(current)
    );

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

import { DownloadInvoice } from './DownloadInvoice';

export function ResultCard({ breakdown, method, settings }: ResultCardProps) {
    const zaloLink = settings?.clean_zalo_link || "https://zalo.me/0912345678";
    const registerLink = settings?.registration_link || "https://kdhoangkim.com/user/register?sale=3955";

    return (
        <Card title="Chi phí ước tính" className="h-full bg-gradient-to-br from-white to-violet-50/50" id="result-card-container">
            <div className="space-y-6">
                {/* Exchange Rate Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-primary rounded-full text-xs font-semibold">
                    <span>Tỷ giá: 1 ¥ = {breakdown.exchange_rate} ₫</span>
                </div>

                {/* Breakdown Items */}
                <div className="space-y-4">
                    {/* Item 1: Product Total */}
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 text-secondary rounded-lg">
                                <Box className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-text-main">Tiền hàng</div>
                                <div className="text-xs text-text-muted">{formatCNY(breakdown.total_product_cny)}</div>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-text-main">
                            <AnimatedMoney value={breakdown.total_product_vnd} />
                        </div>
                    </div>

                    {/* Item 2: Service Fee */}
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-500 rounded-lg">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-text-main">Phí dịch vụ</div>
                                <div className="text-xs text-text-muted">{breakdown.service_fee_percent}%</div>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-text-main">
                            <AnimatedMoney value={breakdown.service_fee_vnd} />
                        </div>
                    </div>

                    {/* Item 3: Shipping */}
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-500 rounded-lg">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-text-main">Phí vận chuyển</div>
                                <div className="text-xs text-text-muted">
                                    {breakdown.total_weight_kg} kg x {formatNumber(breakdown.shipping_rate_vnd)} ₫/kg
                                    {breakdown.internal_ship_vnd > 0 && ` + Nội địa TQ`}
                                </div>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-text-main">
                            <AnimatedMoney value={breakdown.int_shipping_fee_vnd + breakdown.internal_ship_vnd} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 border-dashed" />

                {/* PRICE PER UNIT Highlight */}
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-800">Giá vốn 1 sản phẩm</span>
                    <span className="text-lg font-bold text-yellow-700">
                        <AnimatedMoney value={breakdown.avg_price_per_unit_vnd} />
                    </span>
                </div>

                {/* Total */}
                <div className="pt-2">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-lg font-bold text-text-main">Tổng đơn về tay tạm tính</span>
                        <span className="text-2xl font-bold text-primary">
                            <AnimatedMoney value={breakdown.total_landed_cost} />
                        </span>
                    </div>
                    {method === 'ChinhNgach' && (
                        <p className="text-xs text-orange-500 text-right font-medium animate-pulse">
                            * Chưa bao gồm VAT
                        </p>
                    )}
                </div>

                {/* Deposit Section */}
                <div className="bg-primary/5 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-main">Số tiền cần cọc</span>
                        <span className="font-bold text-primary"><AnimatedMoney value={breakdown.deposit_amount} /></span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-text-main max-w-[200px]">Số tiền còn lại <span className="text-xs text-text-muted">(= tổng đơn về tay tạm tính - số tiền đã cọc bên trên)</span> thanh toán khi nhận hàng</span>
                        <span className="font-bold text-text-main"><AnimatedMoney value={breakdown.remaining_amount} /></span>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-3 pt-2">
                    <a
                        href={zaloLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-white border border-slate-200 text-text-main font-semibold rounded-full hover:bg-slate-50 transition-colors text-sm shadow-sm flex items-center justify-center gap-2 group"
                    >
                        <img src="/zalo-icon.png" className="w-5 h-5" alt="Zalo" />
                        <span className="group-hover:text-blue-600 transition-colors">TƯ VẤN & ĐÀM PHÁN GIÁ</span>
                    </a>
                    <a
                        href={registerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                    >
                        LÊN ĐƠN NGAY <ArrowRight className="w-4 h-4" />
                    </a>

                    <DownloadInvoice
                        elementId="result-card-container"
                        productName="Logistic Estimator"
                    />
                </div>
            </div>
        </Card>
    );
}
