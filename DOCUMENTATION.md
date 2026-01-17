# 📦 TÍNH TIỀN VỀ TAY - Documentation

## 📋 Tổng Quan Dự Án

**Tên dự án:** `tinhtienvetay`  
**Phiên bản:** 0.2.0  
**Mô tả:** Ứng dụng tính toán chi phí nhập hàng từ Trung Quốc về Việt Nam với đầy đủ các yếu tố như giá sản phẩm, tỷ giá, phí dịch vụ, phí vận chuyển quốc tế và nội địa. **v0.2.0 bổ sung hệ thống admin với Supabase và trang bảng giá công khai.**

---

## 🛠️ Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next.js** | 16.1.2 | Framework React với App Router |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | ^5 | Type Safety |
| **Tailwind CSS** | ^4 | Styling |
| **Supabase** | ^2.48.0 | 🆕 **Database & Authentication** |
| **TanStack Query** | ^5.62.11 | 🆕 **Data Fetching & Caching** |
| **Zod** | ^4.3.5 | Form Validation Schema |
| **React Hook Form** | ^7.71.1 | Form State Management |
| **Framer Motion** | ^12.26.2 | Animations |
| **Zustand** | ^5.0.10 | State Management |
| **Sonner** | ^2.0.7 | Toast Notifications |
| **html-to-image** | ^1.11.13 | Export kết quả thành ảnh |
| **Lucide React** | ^0.562.0 | Icon Library |

---

## 📂 Cấu Trúc Thư Mục

```
d:\tinhtienvetay\
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # 🆕 Hệ thống quản trị
│   │   │   ├── login/          # 🆕 Trang đăng nhập admin
│   │   │   ├── settings/       # 🆕 Cài đặt tỷ giá & hotline
│   │   │   ├── pricing/        # 🆕 Quản lý bảng giá
│   │   │   ├── layout.tsx      # 🆕 Layout admin với sidebar
│   │   │   └── page.tsx        # 🆕 Dashboard admin
│   │   ├── bang-gia/           # 🆕 Trang bảng giá công khai
│   │   │   └── page.tsx
│   │   ├── api/                # API Routes
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   └── leads/          # Leads API endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout (với Providers)
│   │   └── page.tsx            # Trang chủ (Calculator)
│   │
│   ├── components/
│   │   ├── calculator/         # Calculator Components
│   │   │   ├── Calculator.tsx      # Component chính (React Query)
│   │   │   ├── InputCard.tsx       # Form nhập liệu
│   │   │   ├── ResultCard.tsx      # Hiển thị kết quả
│   │   │   └── DownloadInvoice.tsx # Tải báo giá
│   │   ├── common/             # Shared Components
│   │   └── ui/                 # UI Components
│   │
│   ├── hooks/
│   │   ├── useCostCalculator.ts    # Logic tính toán
│   │   └── usePricingRules.ts      # 🆕 React Query hooks cho pricing
│   │
│   ├── lib/
│   │   ├── supabase.ts             # 🆕 Supabase client config
│   │   ├── providers.tsx           # 🆕 React Query provider
│   │   ├── schemas.ts              # Zod validation schemas
│   │   └── utils.ts                # Utility functions
│   │
│   ├── types/
│   │   ├── index.ts                # Core types
│   │   └── database.types.ts       # 🆕 Supabase table types
│   │
│   └── middleware.ts               # 🆕 Route protection
│
├── data/
│   └── pricing.json            # ⚠️ Deprecated (moved to Supabase)
│
├── supabase-schema.sql         # 🆕 Database schema
├── supabase-seed.sql           # 🆕 Initial data
├── SUPABASE_SETUP.md           # 🆕 Setup guide
├── TESTING_GUIDE.md            # 🆕 Testing checklist
├── DOCUMENTATION.md            # This file
└── README.md                   # Quick start guide
```

---

## 🏗️ Kiến Trúc Hệ Thống (v0.2.0)

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    User (Browser)                         │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Calculator │  │  Bảng Giá    │  │ Admin Panel  │     │
│  │     /      │  │  /bang-gia   │  │   /admin     │     │
│  └────────────┘  └──────────────┘  └──────────────┘     │
└────────┬──────────────────┬───────────────┬─────────────┘
         │                  │               │
         ▼                  ▼               ▼
┌────────────────────────────────────────────────────────┐
│              Next.js Application (Port 3000)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Query (TanStack Query)              │  │
│  │  - Caching (2min stale time)                      │  │
│  │  - Auto-refetch on mutations                      │  │
│  │  - Loading/Error states                           │  │
│  └────────────────┬──────────────────────────────────┘  │
│                   │                                      │
│  ┌────────────────▼──────────────────────────────────┐  │
│  │         Supabase JS Client                        │  │
│  │  - Auth (email/password)                          │  │
│  │  - Database queries                               │  │
│  │  - Real-time subscriptions (future)               │  │
│  └────────────────┬──────────────────────────────────┘  │
└────────────────────┼──────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Supabase Backend    │
         │  ┌─────────────────┐  │
         │  │   PostgreSQL    │  │
         │  │  ┌───────────┐  │  │
         │  │  │ Settings  │  │  │
         │  │  ├───────────┤  │  │
         │  │  │ Fees      │  │  │
         │  │  ├───────────┤  │  │
         │  │  │ Rates     │  │  │
         │  │  └───────────┘  │  │
         │  └─────────────────┘  │
         │  ┌─────────────────┐  │
         │  │  Supabase Auth  │  │
         │  │  - Admin Users  │  │
         │  │  - Sessions     │  │
         │  └─────────────────┘  │
         └───────────────────────┘
```

---

## 🗄️ Database Schema (Supabase)

### Tables

#### 1. `global_settings`
Cài đặt toàn cục (tỷ giá, hotline, Zalo link)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `key` | text | Setting key (unique) |
| `value` | text | Setting value |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-updated |

**Sample Data:**
```sql
key: 'exchange_rate', value: '3960'
key: 'hotline', value: '0912345678'
key: 'zalo_link', value: 'https://zalo.me/...'
```

#### 2. `service_fee_rules`
Phí dịch vụ theo phương thức, giá trị đơn, và % cọc

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `method` | text | TMDT / TieuNgach / ChinhNgach |
| `min_order_value` | numeric | Giá trị đơn tối thiểu (VND) |
| `max_order_value` | numeric | Giá trị đơn tối đa (VND) |
| `deposit_percent` | integer | % đặt cọc (70 hoặc 80) |
| `fee_percent` | numeric | % phí dịch vụ |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-updated |

#### 3. `shipping_rate_rules`
Phí vận chuyển quốc tế (linh hoạt cho nhiều loại)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `method` | text | TMDT / TieuNgach / ChinhNgach |
| `type` | text | value_based / weight_based / volume_based |
| `subtype` | text | NULL / 'heavy' / 'bulky' |
| `warehouse` | text | HN / HCM |
| `min_value` | numeric | Min (giá trị/kg/m³) |
| `max_value` | numeric | Max (giá trị/kg/m³) |
| `price` | numeric | Giá vận chuyển |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-updated |

---

## 🔑 Core Types & Interfaces

### Database Types (`src/types/database.types.ts`)
```typescript
export interface GlobalSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceFeeRule {
  id: string;
  method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
  min_order_value: number;
  max_order_value: number;
  deposit_percent: number;
  fee_percent: number;
  created_at: string;
  updated_at: string;
}

export interface ShippingRateRule {
  id: string;
  method: 'TMDT' | 'TieuNgach' | 'ChinhNgach';
  type: 'value_based' | 'weight_based' | 'volume_based';
  subtype: string | null;
  warehouse: 'HN' | 'HCM';
  min_value: number;
  max_value: number;
  price: number;
  created_at: string;
  updated_at: string;
}
```

### Calculator Types (`src/types/index.ts`)
```typescript
export type Warehouse = 'HN' | 'HCM';
export type ShippingMethod = 'TMDT' | 'TieuNgach' | 'ChinhNgach';

export interface Product {
  priceInCNY: number;
  quantity: number;
  weight: number;
  volume: number;
}

export interface OrderDetails {
  products: Product[];
  warehouse: Warehouse;
  shippingMethod: ShippingMethod;
  depositPercent: number;
}

export interface CostBreakdown {
  totalProductCost: { cny: number; vnd: number };
  internationalShipping: number;
  serviceFee: number;
  domesticShipping: number;
  totalCost: number;
  depositAmount: number;
  remainingAmount: number;
}

export interface PricingConfig {
  exchange_rate: number;
  normal_shipping: NormalShippingTier[];
  tmdt_shipping: TMDTShippingTier[];
  official_shipping: {
    heavy: OfficialShippingTier[];
    bulky: OfficialShippingTier[];
  };
}
```

---

## 🔄 Data Flow (v0.2.0)

### 1. Calculator Page (`/`)

```
User fills form
     ↓
React Hook Form validates (Zod schema)
     ↓
usePricingRules() fetches pricing from Supabase (React Query)
     ↓
useCostCalculator(orderDetails, pricingConfig)
     ↓
Calculate breakdown
     ↓
Display ResultCard
```

### 2. Admin Settings Update

```
Admin logs in (Supabase Auth)
     ↓
Navigate to /admin/settings
     ↓
useGlobalSettings() loads current values
     ↓
Admin changes exchange rate
     ↓
useUpdateGlobalSetting() mutation
     ↓
Supabase updates global_settings table
     ↓
React Query invalidates cache
     ↓
Calculator auto-refetches new pricing
```

### 3. Public Pricing Page (`/bang-gia`)

```
User visits /bang-gia
     ↓
usePricingRules() fetches all pricing
     ↓
Transform data to table format
     ↓
Render responsive tables
```

---

## 🎯 Key Features

### v0.1.0
- ✅ Calculator với nhiều phương thức vận chuyển
- ✅ Tính phí theo giá trị đơn / trọng lượng / thể tích
- ✅ Export kết quả thành ảnh
- ✅ Responsive design
- ✅ Form validation với Zod
- ✅ Animations với Framer Motion

### 🆕 v0.2.0
- ✅ **Supabase Integration**: Database thay thế JSON tĩnh
- ✅ **Admin System**: 
  - Login với Supabase Auth email/password
  - Protected routes với middleware
  - Dashboard tổng quan
  - Settings editor (tỷ giá, hotline, Zalo)
  - Pricing viewer (xem tất cả bảng giá)
- ✅ **Public Pricing Page** (`/bang-gia`):
  - Hiển thị bảng giá công khai
  - Responsive tables
  - Real-time data từ Supabase
- ✅ **React Query**: 
  - Auto-caching (2min stale time)
  - Optimistic updates
  - Loading/Error states
- ✅ **Real-time Updates**: Admin thay đổi → Calculator cập nhật ngay

---

## 🔐 Authentication & Authorization

### Supabase Auth
- **Provider**: Email/Password
- **Admin Users**: Tạo trong Supabase Dashboard → Authentication → Users
- **Session Management**: HTTP-only cookies (`sb-access-token`, `sb-refresh-token`)
- **Middleware**: Bảo vệ tất cả routes `/admin/*` (trừ `/admin/login`)

### Protected Routes
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  // Check for Supabase auth tokens
  const token = request.cookies.get('sb-access-token')?.value;
  
  if (!token) {
    // Redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

---

## 📡 API Routes

### Public API
- `GET /api/leads` - Submit lead form (unchanged)
- `GET /api/admin/settings` - Get settings (legacy, now uses Supabase directly)
- `GET /api/admin/pricing` - Get pricing (legacy, now uses Supabase directly)

### Supabase Direct Queries (v0.2.0)
Client-side components now query Supabase directly via React Query hooks:
- `useGlobalSettings()` - Fetch settings
- `useServiceFeeRules()` - Fetch service fees
- `useShippingRateRules()` - Fetch shipping rates
- `usePricingRules()` - Fetch all pricing (transformed)

---

## 🛠️ Environment Variables

```env
# Google Sheets API (for lead submissions)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/...

# Admin Password (legacy - không còn dùng trong v0.2.0)
ADMIN_PASSWORD=123456

# Supabase Configuration (v0.2.0)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Development

### Setup
```bash
# Install dependencies
npm install

# Add Supabase credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Run database migrations (in Supabase SQL Editor)
# 1. Run supabase-schema.sql
# 2. Run supabase-seed.sql

# Create admin user in Supabase Auth Dashboard

# Start dev server
npm run dev
```

### Build
```bash
npm run build
npm start
```

---

## 📝 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive test checklist.

**Quick Tests:**
1. Calculator: `http://localhost:3000`
2. Pricing: `http://localhost:3000/bang-gia`
3. Admin: `http://localhost:3000/admin` (login required)

---

## 🔄 Migration from v0.1.0 → v0.2.0

### Breaking Changes
- ❌ `data/pricing.json` no longer used
- ❌ Admin password auth replaced with Supabase Auth
- ❌ API routes `/api/admin/pricing` and `/api/admin/settings` still work but are deprecated

### Migration Steps
1. Set up Supabase project
2. Run `supabase-schema.sql` to create tables
3. Run `supabase-seed.sql` to populate initial data
4. Update `.env.local` with Supabase credentials
5. Create admin users in Supabase Auth
6. Test calculator and admin panel

---

## 📚 Additional Documentation

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed Supabase setup guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing checklist for v0.2.0
- [walkthrough.md](file:///C:/Users/ADMIN/.gemini/antigravity/brain/faaf8693-78a8-4c1a-b0b8-ecd2f47cdab0/walkthrough.md) - Implementation walkthrough (in artifacts)

---

## 🐛 Known Issues

1. **Middleware Deprecation Warning**
   - Next.js shows warning about "middleware" convention
   - Non-blocking, will migrate to "proxy" in Next.js 15

2. **No Inline Editing**
   - Admin pricing page is view-only
   - Edit pricing via Supabase Table Editor

---

## 🎯 Future Enhancements

- [ ] Inline editing for pricing tables in admin
- [ ] Add/delete pricing rules via admin UI
- [ ] Real-time sync with Supabase subscriptions
- [ ] Pricing change history/audit log
- [ ] Export pricing to PDF/CSV
- [ ] Multi-language support (EN/VI)
- [ ] Mobile app version

---

**Last Updated:** 2026-01-17  
**Version:** 0.2.0  
**Author:** Developed with Gemini 2.5 Pro
