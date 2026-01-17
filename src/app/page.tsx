import Calculator from "@/components/calculator/Calculator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header / Hero */}
      <header className="bg-white border-b border-slate-100 mb-8 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              L
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Logistics Cost Estimator
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-main">
            <a href="#" className="hover:text-primary transition-colors">Hướng dẫn</a>
            <a href="/bang-gia" className="hover:text-primary transition-colors">Bảng giá</a>
            <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
          </nav>
        </div>
      </header>

      <div className="pt-4">
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-3">
            Tính tiền về tay
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Công cụ tính giá nhập hàng Trung Quốc về Việt Nam chính xác, cập nhật tỷ giá Real-time.
          </p>
        </div>

        <Calculator />
      </div>
    </main>
  );
}
