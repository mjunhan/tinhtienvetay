"use client";

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Control } from 'react-hook-form';
import { toast } from 'sonner';
import { PricingConfig } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';

export default function PricingPage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'normal' | 'tmdt' | 'official'>('normal');

    const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<PricingConfig>();

    useEffect(() => {
        fetch('/api/admin/pricing')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                reset(data);
            })
            .catch(err => {
                console.error(err);
                toast.error("Không thể tải dữ liệu bảng giá");
            })
            .finally(() => setLoading(false));
    }, [reset]);

    const onSubmit = async (data: PricingConfig) => {
        try {
            const res = await fetch('/api/admin/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.error) throw new Error(result.error);
            toast.success("Đã lưu thay đổi thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lưu dữ liệu");
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Bảng Giá & Tỷ Giá</h1>
                <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Lưu Thay Đổi
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-4 bg-blue-50 border-blue-100">
                    <label className="text-sm font-semibold text-blue-800 mb-2 block">Tỷ giá (1 Tệ = VND)</label>
                    <Input
                        type="number"
                        {...register('exchange_rate', { valueAsNumber: true })}
                        className="bg-white text-lg font-bold"
                    />
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('normal')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'normal' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Vận Chuyển Thường (Tiểu Ngạch)
                </button>
                <button
                    onClick={() => setActiveTab('tmdt')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'tmdt' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Line TMĐT
                </button>
                <button
                    onClick={() => setActiveTab('official')}
                    className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'official' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Line Chính Ngạch
                </button>
            </div>

            <div className="space-y-8">
                {activeTab === 'normal' && <NormalShippingEditor control={control} register={register} />}
                {activeTab === 'tmdt' && <TMDTShippingEditor control={control} register={register} />}
                {activeTab === 'official' && <OfficialShippingEditor control={control} register={register} />}
            </div>
        </div>
    );
}

// Sub-components for cleaner code
function NormalShippingEditor({ control, register }: { control: Control<PricingConfig>, register: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "normal_shipping"
    });

    return (
        <Card title="Cấu hình Vận Chuyển Thường" className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Min Value (VND)</th>
                            <th className="px-4 py-3">Max Value (VND)</th>
                            <th className="px-4 py-3 text-center">Phí DV (%)</th>
                            <th className="px-4 py-3 text-center">HN (Thực)</th>
                            <th className="px-4 py-3 text-center">HN (QĐ)</th>
                            <th className="px-4 py-3 text-center">HCM (Thực)</th>
                            <th className="px-4 py-3 text-center">HCM (QĐ)</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50/50">
                                <td className="p-2"><Input type="number" {...register(`normal_shipping.${index}.min_value`, { valueAsNumber: true })} /></td>
                                <td className="p-2"><Input type="number" {...register(`normal_shipping.${index}.max_value`, { valueAsNumber: true })} /></td>
                                <td className="p-2 w-24"><Input type="number" step="0.1" {...register(`normal_shipping.${index}.fee_percent`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 w-28"><Input type="number" {...register(`normal_shipping.${index}.hn_actual`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 w-28"><Input type="number" {...register(`normal_shipping.${index}.hn_converted`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 w-28"><Input type="number" {...register(`normal_shipping.${index}.hcm_actual`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 w-28"><Input type="number" {...register(`normal_shipping.${index}.hcm_converted`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 text-center">
                                    <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => append({ min_value: 0, max_value: 0, fee_percent: 0, hn_actual: 0, hn_converted: 0, hcm_actual: 0, hcm_converted: 0 })} className="flex gap-2">
                    <Plus className="w-4 h-4" /> Thêm dòng
                </Button>
            </div>
        </Card>
    );
}

function TMDTShippingEditor({ control, register }: { control: Control<PricingConfig>, register: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "tmdt_shipping"
    });

    return (
        <Card title="Cấu hình Line TMĐT" className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Min Value (VND)</th>
                            <th className="px-4 py-3">Max Value (VND)</th>
                            <th className="px-4 py-3 text-center">Phí DV (%)</th>
                            <th className="px-4 py-3 text-center">HN (Thực)</th>
                            <th className="px-4 py-3 text-center">HCM (Thực)</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50/50">
                                <td className="p-2"><Input type="number" {...register(`tmdt_shipping.${index}.min_value`, { valueAsNumber: true })} /></td>
                                <td className="p-2"><Input type="number" {...register(`tmdt_shipping.${index}.max_value`, { valueAsNumber: true })} /></td>
                                <td className="p-2 w-24"><Input type="number" step="0.1" {...register(`tmdt_shipping.${index}.fee_percent`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 w-32"><Input type="number" {...register(`tmdt_shipping.${index}.hn_actual`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 w-32"><Input type="number" {...register(`tmdt_shipping.${index}.hcm_actual`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 text-center">
                                    <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => append({ min_value: 0, max_value: 0, fee_percent: 0, hn_actual: 0, hcm_actual: 0 })} className="flex gap-2">
                    <Plus className="w-4 h-4" /> Thêm dòng
                </Button>
            </div>
        </Card>
    );
}

function OfficialShippingEditor({ control, register }: { control: Control<PricingConfig>, register: any }) {
    return (
        <div className="space-y-8">
            <OfficialHeavyEditor control={control} register={register} />
            <OfficialBulkyEditor control={control} register={register} />
        </div>
    );
}

function OfficialHeavyEditor({ control, register }: { control: Control<PricingConfig>, register: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "official_shipping.heavy"
    });

    return (
        <Card title="Hàng Nặng (Tính theo KG)" className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Min Weight (KG)</th>
                            <th className="px-4 py-3">Max Weight (KG)</th>
                            <th className="px-4 py-3 text-center">Giá HN (VND/KG)</th>
                            <th className="px-4 py-3 text-center">Giá HCM (VND/KG)</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50/50">
                                <td className="p-2"><Input type="number" {...register(`official_shipping.heavy.${index}.min_weight`, { valueAsNumber: true })} /></td>
                                <td className="p-2"><Input type="number" {...register(`official_shipping.heavy.${index}.max_weight`, { valueAsNumber: true })} /></td>
                                <td className="p-2"><Input type="number" {...register(`official_shipping.heavy.${index}.price_hn`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2"><Input type="number" {...register(`official_shipping.heavy.${index}.price_hcm`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 text-center">
                                    <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => append({ min_weight: 0, max_weight: 0, price_hn: 0, price_hcm: 0 })} className="flex gap-2">
                    <Plus className="w-4 h-4" /> Thêm dòng
                </Button>
            </div>
        </Card>
    );
}

function OfficialBulkyEditor({ control, register }: { control: Control<PricingConfig>, register: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "official_shipping.bulky"
    });

    return (
        <Card title="Hàng Cồng Kềnh (Tính theo m3)" className="overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Min Vol (m3)</th>
                            <th className="px-4 py-3">Max Vol (m3)</th>
                            <th className="px-4 py-3 text-center">Giá HN (VND/m3)</th>
                            <th className="px-4 py-3 text-center">Giá HCM (VND/m3)</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {fields.map((field, index) => (
                            <tr key={field.id} className="hover:bg-slate-50/50">
                                <td className="p-2"><Input type="number" {...register(`official_shipping.bulky.${index}.min_volume`, { valueAsNumber: true })} /></td>
                                <td className="p-2"><Input type="number" {...register(`official_shipping.bulky.${index}.max_volume`, { valueAsNumber: true })} /></td>
                                <td className="p-2"><Input type="number" {...register(`official_shipping.bulky.${index}.price_hn`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2"><Input type="number" {...register(`official_shipping.bulky.${index}.price_hcm`, { valueAsNumber: true })} className="text-center" /></td>
                                <td className="p-2 text-center">
                                    <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => append({ min_volume: 0, max_volume: 0, price_hn: 0, price_hcm: 0 })} className="flex gap-2">
                    <Plus className="w-4 h-4" /> Thêm dòng
                </Button>
            </div>
        </Card>
    );
}
