"use client";

import Calculator from "@/components/calculator/Calculator";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/ui/motion-primitives";
import Link from "next/link";
import { Calculator as CalcIcon, BookOpen, Phone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-amber-50 pb-20">
      {/* Header / Navbar with Glassmorphism */}
      <header className="glass sticky top-0 z-40 border-b border-amber-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all">
              <CalcIcon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
                Tính Tiền Vé Tàu
              </h1>
              <p className="text-xs text-slate-500 -mt-0.5">v0.3.0 Golden Era</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/meo-nhap-hang"
              className="flex items-center gap-1.5 text-slate-700 hover:text-amber-600 transition-colors"
            >
              <BookOpen size={16} />
              Mẹo nhập hàng
            </Link>
            <Link
              href="/bang-gia"
              className="text-slate-700 hover:text-amber-600 transition-colors"
            >
              Bảng giá
            </Link>
            <Link
              href="/lien-he"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Phone size={16} />
              Liên hệ
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="pt-12 pb-8"
      >
        <div className="text-center mb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-semibold text-sm mb-6">
              <CalcIcon size={16} />
              Công cụ tính chi phí
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Tính tiền về tay
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Công cụ tính giá nhập hàng Trung Quốc về Việt Nam chính xác, cập nhật tỷ giá Real-time.
            </p>
          </motion.div>
        </div>

        <Calculator />
      </motion.div>
    </main>
  );
}
