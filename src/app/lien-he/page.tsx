"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, staggerItem, scaleOnHover } from "@/components/ui/motion-primitives";
import { Phone, MessageCircle, MapPin, Send, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const contactFormSchema = z.object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Contact form submitted:", data);
        toast.success("Tin nhắn đã được gửi! Chúng tôi sẽ liên hệ lại sớm.");
        reset();
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-amber-50 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Back to Home Navigation */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại trang tính tiền
                    </Link>
                </div>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-slate-900 mb-4">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ ngay để được tư vấn miễn phí!
                    </p>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-5 gap-12 mb-16">
                    {/* Left Column - Contact Info (40%) */}
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="md:col-span-2 space-y-6"
                    >
                        <motion.div variants={staggerItem}>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                Kết nối ngay
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Chọn cách liên hệ thuận tiện nhất cho bạn
                            </p>
                        </motion.div>

                        {/* Hotline Card */}
                        <motion.a
                            href="tel:+84123456789"
                            variants={staggerItem}
                            {...scaleOnHover}
                            className="block bg-white rounded-xl p-6 border border-amber-100 golden-glow-hover transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1">Hotline 24/7</h3>
                                    <p className="text-2xl font-bold text-amber-600 mb-1">0123 456 789</p>
                                    <p className="text-sm text-slate-500">Nhấn để gọi ngay</p>
                                </div>
                            </div>
                        </motion.a>

                        {/* Zalo Card */}
                        <motion.a
                            href="https://zalo.me/0123456789"
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={staggerItem}
                            {...scaleOnHover}
                            className="block bg-white rounded-xl p-6 border border-amber-100 golden-glow-hover transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1">Chat Zalo</h3>
                                    <p className="text-lg font-semibold text-slate-700 mb-1">0123 456 789</p>
                                    <p className="text-sm text-slate-500">Nhắn tin trực tiếp</p>
                                </div>
                            </div>
                        </motion.a>

                        {/* Office Address Card */}
                        <motion.div
                            variants={staggerItem}
                            className="bg-white rounded-xl p-6 border border-amber-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1">Văn phòng</h3>
                                    <p className="text-slate-600">
                                        123 Đường ABC, Phường XYZ
                                        <br />
                                        Quận 1, TP. Hồ Chí Minh
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Email Card */}
                        <motion.a
                            href="mailto:contact@example.com"
                            variants={staggerItem}
                            {...scaleOnHover}
                            className="block bg-white rounded-xl p-6 border border-amber-100 golden-glow-hover transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail size={24} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                                    <p className="text-slate-600">contact@example.com</p>
                                    <p className="text-sm text-slate-500">Phản hồi trong 24h</p>
                                </div>
                            </div>
                        </motion.a>
                    </motion.div>

                    {/* Right Column - Contact Form (60%) */}
                    <motion.div
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        className="md:col-span-3"
                    >
                        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Gửi tin nhắn</h2>
                            <p className="text-slate-600 mb-8">
                                Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Name Input */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("name")}
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                                </div>

                                {/* Phone Input */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("phone")}
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                        placeholder="0123 456 789"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                                </div>

                                {/* Message Textarea */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-900 mb-2">
                                        Nội dung <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register("message")}
                                        id="message"
                                        rows={6}
                                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-y"
                                        placeholder="Tôi cần hỗ trợ về..."
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Google Maps Embed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="rounded-2xl overflow-hidden shadow-xl border border-amber-100"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193500383286!2d106.69746931533384!3d10.790069562252817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location"
                    ></iframe>
                </motion.div>
            </div>
        </div>
    );
}
