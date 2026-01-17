# 🚀 Tính Tiền Về Tay v0.2.0

> **Ứng dụng tính toán chi phí nhập hàng từ Trung Quốc về Việt Nam với hệ thống quản trị động**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.48.0-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Tính Năng Chính

### Dành cho Khách hàng
- 🧮 **Calculator Thông Minh**: Tính toán chi phí chi tiết cho 3 phương thức vận chuyển (TMDT, Tiểu Ngạch, Chính Ngạch)
- 📋 **Bảng Giá Công Khai**: Xem giá dịch vụ và vận chuyển tại `/bang-gia`
- 📱 **Responsive**: Tối ưu cho mobile, tablet, desktop
- 📷 **Export Báo Giá**: Tải kết quả dưới dạng hình ảnh

### 🆕 Dành cho Admin (v0.2.0)
- 🔐 **Đăng nhập bảo mật**: Supabase Auth với email/password
- ⚙️ **Cài đặt động**: Thay đổi tỷ giá, hotline, Zalo link real-time
- 💰 **Quản lý giá**: Xem tất cả phí dịch vụ và phí vận chuyển
- 📊 **Dashboard**: Tổng quan và truy cập nhanh

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd tinhtienvetay
npm install
```

### 2. Setup Supabase
Xem hướng dẫn chi tiết: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

**Tóm tắt:**
1. Tạo project tại [app.supabase.com](https://app.supabase.com)
2. Copy URL và Anon Key
3. Thêm vào `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Setup Database
```sql
-- Chạy trong Supabase SQL Editor:
-- 1. supabase-schema.sql (tạo tables)
-- 2. supabase-seed.sql (populate data)
```

### 4. Create Admin User
1. Vào Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Nhập email & password

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Calculator (trang chủ) | ❌ No |
| `/bang-gia` | Bảng giá dịch vụ công khai | ❌ No |
| `/admin` | Dashboard admin | ✅ Yes |
| `/admin/login` | Đăng nhập admin | ❌ No |
| `/admin/settings` | Cài đặt tỷ giá & hotline | ✅ Yes |
| `/admin/pricing` | Xem bảng giá quản trị | ✅ Yes |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.2 (App Router + Turbopack)
- **UI**: React 19 + Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## 📖 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Tài liệu kỹ thuật đầy đủ
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Hướng dẫn setup Supabase
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Checklist kiểm thử

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin system
│   ├── bang-gia/           # Public pricing page
│   └── api/                # API routes
├── components/             # React components
├── hooks/                  # Custom hooks
│   ├── useCostCalculator.ts
│   └── usePricingRules.ts  # React Query hooks
├── lib/                    # Utilities
│   ├── supabase.ts         # Supabase client
│   └── providers.tsx       # React Query provider
└── types/                  # TypeScript types
```

---

## 🔐 Admin Access

**URL**: `http://localhost:3000/admin`

**Credentials**: Tạo trong Supabase Auth Dashboard

**Default capabilities:**
- View dashboard
- Edit exchange rate
- Update contact info (hotline, Zalo)
- View all pricing rules

---

## 🧪 Testing

```bash
# Run production build
npm run build
npm start

# Access pages:
# - http://localhost:3000 (Calculator)
# - http://localhost:3000/bang-gia (Pricing)
# - http://localhost:3000/admin (Admin)
```

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for full checklist.

---

## 📊 Database Schema

### Tables
1. **`global_settings`** - Exchange rate, hotline, Zalo link
2. **`service_fee_rules`** - Service fees by method, order value, deposit %
3. **`shipping_rate_rules`** - Shipping rates (value/weight/volume based)

Full schema: [supabase-schema.sql](./supabase-schema.sql)

---

## 🔄 Version History

### v0.2.0 (2026-01-17) - Current
- ✅ Supabase integration for dynamic pricing
- ✅ Admin authentication system
- ✅ Public pricing page (`/bang-gia`)
- ✅ React Query for data fetching
- ✅ Real-time updates

### v0.1.0 (Initial Release)
- Calculator with 3 shipping methods
- Static pricing from JSON
- Export to image
- Responsive design

---

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- UI by [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**💡 Need Help?**
- Check [DOCUMENTATION.md](./DOCUMENTATION.md) for technical details
- Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup
- Run tests from [TESTING_GUIDE.md](./TESTING_GUIDE.md)

**📞 Support**: Contact via admin panel or repository issues

---

Made with ❤️ using Gemini 2.5 Pro
