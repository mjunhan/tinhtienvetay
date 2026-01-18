import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function GlobalServiceFeeTable() {
    return (
        <div className="w-full mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
                {/* Header */}
                <div className="bg-amber-400 py-4 px-6 text-center">
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Bảng Giá Dịch Vụ Mua Hàng
                        <span className="block text-sm font-bold text-slate-800 opacity-80 mt-1">
                            (Áp dụng cho toàn bộ hệ thống)
                        </span>
                    </h2>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm md:text-base">
                        <thead>
                            <tr className="bg-amber-100 text-amber-900">
                                <th className="py-4 px-6 text-left font-bold border-b border-amber-200 w-1/3">
                                    GIÁ TRỊ ĐƠN HÀNG
                                </th>
                                <th className="py-4 px-6 text-center font-bold border-b border-amber-200 w-1/3">
                                    CỌC DƯỚI 80%
                                </th>
                                <th className="py-4 px-6 text-center font-bold border-b border-amber-200 w-1/3">
                                    CỌC TRÊN 80%
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Row 1: < 2M */}
                            <tr className="hover:bg-amber-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    Dưới 2 triệu
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                        5%
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                        3%
                                    </span>
                                </td>
                            </tr>

                            {/* Row 2: 2M - 5M */}
                            <tr className="hover:bg-amber-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    Từ 2 triệu đến 5 triệu
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                        2%
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                        1.5%
                                    </span>
                                </td>
                            </tr>

                            {/* Row 3: > 5M */}
                            <tr className="hover:bg-amber-50/50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    Trên 5 triệu
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                        1.5%
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-bold shadow-sm border border-cyan-100">
                                        1.2%
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Warning Footer */}
                <div className="bg-red-50 text-red-600 p-4 flex items-start gap-3 text-sm border-t border-red-100">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">LƯU Ý:</p>
                        <p>Giá trị tiền hàng để tính phí dịch vụ được tính trên tổng giá trị đơn hàng (không tách lẻ từng link).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
