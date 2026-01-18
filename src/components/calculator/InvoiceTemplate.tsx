import { CostBreakdown, OrderDetails } from "@/types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface InvoiceTemplateProps {
    id: string;
    details: OrderDetails;
    breakdown: CostBreakdown;
}

export function InvoiceTemplate({ id, details, breakdown }: InvoiceTemplateProps) {
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatCNY = (value: number) => {
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value);
    };

    const currentDate = format(new Date(), "dd 'tháng' MM 'năm' yyyy", { locale: vi });

    return (
        <div id={id} className="bg-white w-[595px] min-h-[842px] p-8 relative overflow-hidden font-sans text-slate-900 border border-slate-200">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

            {/* Watermark/Pattern (Subtle) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[150px] font-bold text-slate-50 opacity-20 -rotate-45 pointer-events-none select-none">
                TINHTIENVETAY
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-amber-600 tracking-tight mb-1">
                        TÍNH TIỀN VỀ TAY
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Dịch vụ nhập hàng Trung Quốc uy tín</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-slate-800">BÁO GIÁ DỊCH VỤ</h2>
                    <p className="text-sm text-slate-500 mt-1">Ngày: {currentDate}</p>
                </div>
            </div>

            {/* Customer & Order Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Khách hàng</h3>
                    <div className="space-y-1.5">
                        <p className="font-semibold text-lg text-slate-800">{details.customerName || 'Khách hàng'}</p>
                        <p className="text-slate-600">{details.customerPhone || '---'}</p>
                    </div>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                    <h3 className="text-xs font-bold text-amber-600/70 uppercase tracking-wider mb-3">Thông tin đơn hàng</h3>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Kho nhận:</span>
                            <span className="font-bold text-slate-800">{details.warehouse === 'HN' ? 'Hà Nội' : 'Hồ Chí Minh'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Hình thức:</span>
                            <span className="font-bold text-slate-800">
                                {details.method === 'TMDT' ? 'Thương Mại Điện Tử' :
                                    details.method === 'ChinhNgach' ? 'Chính Ngạch' : 'Tiểu Ngạch'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Tổng cân nặng:</span>
                            <span className="font-bold text-slate-800">{details.products.reduce((acc, p) => acc + (p.weight_kg || 0) * (p.quantity || 0), 0).toFixed(1)} kg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Details Table */}
            <div className="mb-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            <th className="py-3 px-4 text-left rounded-l-lg">Hạng mục chi phí</th>
                            <th className="py-3 px-4 text-right">Giá trị (CNY)</th>
                            <th className="py-3 px-4 text-right rounded-r-lg">Thành tiền (VND)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* 1. Goods Value */}
                        <tr>
                            <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">Tiền hàng</p>
                                <p className="text-xs text-slate-500">Tỷ giá: {formatMoney(breakdown.exchange_rate)}</p>
                            </td>
                            <td className="py-3 px-4 text-right text-slate-600">
                                {formatCNY(breakdown.total_product_cny)}
                            </td>
                            <td className="py-3 px-4 text-right font-medium text-slate-800">
                                {formatMoney(breakdown.total_product_vnd)}
                            </td>
                        </tr>

                        {/* 2. Service Fee */}
                        <tr>
                            <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">Phí dịch vụ mua hàng</p>
                                <p className="text-xs text-slate-500">
                                    {breakdown.service_fee_percent > 0
                                        ? `${breakdown.service_fee_percent}% giá trị đơn hàng`
                                        : 'Phí cố định'}
                                </p>
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400">---</td>
                            <td className="py-3 px-4 text-right font-medium text-slate-800">
                                {formatMoney(breakdown.service_fee_vnd)}
                            </td>
                        </tr>

                        {/* 3. Shipping Fee */}
                        <tr>
                            <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">Phí vận chuyển Quốc tế</p>
                                <p className="text-xs text-slate-500">
                                    {formatMoney(breakdown.shipping_rate_vnd)}/kg x {breakdown.total_weight_kg.toFixed(1)}kg
                                </p>
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400">---</td>
                            <td className="py-3 px-4 text-right font-medium text-slate-800">
                                {formatMoney(breakdown.int_shipping_fee_vnd)}
                            </td>
                        </tr>

                        {/* 4. Internal Ship */}
                        {(breakdown.internal_ship_vnd > 0) && (
                            <tr>
                                <td className="py-3 px-4">
                                    <p className="font-semibold text-slate-800">Phí ship nội địa TQ</p>
                                </td>
                                <td className="py-3 px-4 text-right text-slate-600">
                                    {formatCNY(details.products.reduce((acc, p) => acc + (p.internal_ship_cny || 0), 0))}
                                </td>
                                <td className="py-3 px-4 text-right font-medium text-slate-800">
                                    {formatMoney(breakdown.internal_ship_vnd)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Total Highlight */}
            <div className="flex justify-end mb-12">
                <div className="bg-red-50 px-8 py-6 rounded-2xl border border-red-100 w-2/3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600 font-medium">Tổng cọc ({details.deposit}%):</span>
                        <span className="text-lg font-semibold text-slate-800">{formatMoney(breakdown.deposit_amount)}</span>
                    </div>
                    <div className="h-px bg-red-200 my-3" />
                    <div className="flex justify-between items-end">
                        <span className="text-lg font-bold text-red-800 mb-1">TỔNG CHI PHÍ VỀ TAY:</span>
                        <span className="text-3xl font-extrabold text-red-600 leading-none">
                            {formatMoney(breakdown.total_landed_cost)}
                        </span>
                    </div>
                    <p className="text-right text-xs text-red-400 mt-2 font-medium italic">
                        (Giá đã bao gồm toàn bộ chi phí về đến kho {details.warehouse === 'HN' ? 'Hà Nội' : 'HCM'})
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-slate-50 border-t border-slate-100 p-6 flex justify-between items-center">
                <div className="text-sm text-slate-500">
                    <p className="font-bold text-slate-700 mb-1">Mọi thắc mắc xin liên hệ:</p>
                    <p>Hotline/Zalo: <span className="text-slate-900 font-semibold">0912.345.678</span></p>
                    <p>Website: tinhtienvetay.vn</p>
                </div>
                <div className="text-right">
                    <div className="inline-block px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                        Uy tín - Tận tâm - Tốc độ
                    </div>
                </div>
            </div>
        </div>
    );
}
