# 📦 TÍNH TIỀN VỀ TAY - Documentation

## 📋 Tổng Quan Dự Án

**Tên dự án:** `tinhtienvetay`  
**Phiên bản:** 0.4.0 "Content Powerhouse"  
**Mô tả:** Ứng dụng tính toán chi phí nhập hàng từ Trung Quốc về Việt Nam với đầy đủ các yếu tố như giá sản phẩm, tỷ giá, phí dịch vụ, phí vận chuyển quốc tế và nội địa. **v0.4.0 nâng cấp Blog CMS với Rich Text Editor (TipTap), hệ thống danh mục & thẻ, tìm kiếm & lọc, và bình luận có kiểm duyệt.**

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
| **TipTap** | ^2.x | **Rich Text Editor** ✨ v0.4.0 |
| **Framer Motion** | ^12.26.2 | Animations |
| **Zustand** | ^5.0.10 | State Management |
| **Sonner** | ^2.0.7 | Toast Notifications |
| **html-to-image** | ^1.11.13 | Export kết quả thành ảnh |
| **Lucide React** | ^0.562.0 | Icon Library |
| **date-fns** | ^4.x | Date Formatting |

---

## 📂 Cấu Trúc Thư Mục

```
d:\tinhtienvetay\
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # 🆕 Hệ thống quản trị
│   │   │   ├── login/          # 🆕 Trang đăng nhập admin
│   │   │   ├── settings/       # ✨ Cài đặt tỷ giá & hotline (editable v0.2.1)
│   │   │   ├── pricing/        # ✨ Quản lý bảng giá (editable v0.2.1)
│   │   │   ├── posts/          # 📝 Quản lý bài viết (v0.3.0)
│   │   │   ├── categories/     # 🏷️ Quản lý danh mục (v0.4.0)
│   │   │   ├── comments/       # 💬 Kiểm duyệt bình luận (v0.4.0)
│   │   │   ├── layout.tsx      # 🆕 Layout admin với sidebar
│   │   │   └── page.tsx        # 🆕 Dashboard admin
│   │   ├── meo-nhap-hang/      # 📝 Blog công khai (v0.3.0)
│   │   │   ├── [slug]/         # Blog detail page
│   │   │   └── page.tsx        # Blog index
│   │   ├── bang-gia/           # 🆕 Trang bảng giá công khai
│   │   │   └── page.tsx
│   │   ├── lien-he/            # 📞 Trang liên hệ (v0.3.0)
│   │   │   └── page.tsx
│   │   ├── api/                # API Routes
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   └── leads/          # Leads API endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout (với Providers)
│   │   └── page.tsx            # Trang chủ (Calculator)
│   │
│   ├── components/
│   │   ├── admin/              # ✨ Admin Components
│   │   │   ├── editor/         # 📝 Rich Text Editor (v0.4.0)
│   │   │   │   └── RichTextEditor.tsx  # TipTap editor
│   │   │   ├── pricing/
│   │   │   │   ├── EditServiceFeeDialog.tsx
│   │   │   │   └── EditShippingRateDialog.tsx
│   │   │   └── PostForm.tsx    # Blog post form
│   │   ├── blog/               # 📝 Blog Components (v0.4.0)
│   │   │   ├── CommentForm.tsx     # Comment submission
│   │   │   └── CommentList.tsx     # Comment display
│   │   ├── calculator/         # Calculator Components
│   │   │   ├── Calculator.tsx      # Component chính (React Query)
│   │   │   ├── InputCard.tsx       # Form nhập liệu
│   │   │   ├── ResultCard.tsx      # Hiển thị kết quả
│   │   │   └── DownloadInvoice.tsx # Tải báo giá
│   │   ├── common/             # Shared Components
│   │   └── ui/                 # UI Components
│   │       ├── Dialog.tsx          # ✨ Modal component (v0.2.1)
│   │       ├── Label.tsx           # ✨ Form label (v0.2.1)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── ...
│   │
│   ├── hooks/
│   │   ├── useCostCalculator.ts    # Logic tính toán
│   │   ├── usePricingRules.ts      # React Query hooks cho pricing
│   │   ├── useBlog.ts              # Blog CRUD hooks (v0.3.0)
│   │   ├── useCMS.ts               # Categories & Tags hooks (v0.4.0)
│   │   ├── useComments.ts          # Comment hooks (v0.4.0)
│   │   └── useAdminMutations.ts    # Admin mutations
│   │
│   ├── lib/
│   │   ├── supabase/               # Supabase clients
│   │   │   ├── client.ts           # Client-side
│   │   │   └── server.ts           # Server-side
│   │   ├── blog-actions.ts         # Blog server actions (v0.3.0+)
│   │   ├── comment-actions.ts      # Comment server actions (v0.4.0)
│   │   ├── providers.tsx           # React Query provider
│   │   ├── schemas.ts              # Zod validation schemas
│   │   └── utils.ts                # Utility functions
│   │
│   ├── schemas/
│   │   └── admin.ts                # ✨ Admin form schemas (v0.2.1)
│   │
│   ├── types/
│   │   ├── index.ts                # Core calculator types
│   │   ├── database.types.ts       # Supabase table types
│   │   └── blog.ts                 # Blog types (v0.3.0)
│   │
│   └── middleware.ts               # 🆕 Route protection
│
├── data/
│   └── pricing.json            # ⚠️ Deprecated (moved to Supabase)
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql          # Initial pricing tables
│       ├── 002_update_rls_policies.sql     # v0.2.1 RLS updates
│       ├── 003_create_blog_tables.sql      # v0.3.0 blog tables
│       └── 004_create_cms_tables.sql       # v0.4.0 categories, tags, comments
│
├── supabase-schema.sql         # 🆕 Database schema
├── supabase-seed.sql           # 🆕 Initial data
├── SUPABASE_SETUP.md           # 🆕 Setup guide
├── TESTING_GUIDE.md            # 🆕 Testing checklist
├── DOCUMENTATION.md            # This file
└── README.md                   # Quick start guide
```

---

## 🏗️ Kiến Trúc Hệ Thống (v0.2.1)

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

#### 4. `posts` (v0.3.0, Updated v0.4.0)
Blog posts for "Mẹo nhập hàng" section

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Post title |
| `slug` | text | URL-friendly slug (unique) |
| `excerpt` | text | Short summary (nullable) |
| `content` | text | Full content HTML (nullable) |
| `thumbnail_url` | text | Featured image URL (nullable) |
| `category_id` | uuid | Foreign key to categories (v0.4.0) |
| `is_published` | boolean | Publish status (default: false) |
| `created_at` | timestamp | Auto-generated |
| `updated_at` | timestamp | Auto-updated via trigger |

**RLS Policies**:
- Public SELECT on `is_published = true`
- Authenticated users (admin) can perform all operations
- Auto-update trigger on `updated_at` column

#### 5. `categories` (v0.4.0)
Blog categories

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Category name |
| `slug` | text | URL-friendly slug (unique) |
| `description` | text | Category description (nullable) |
| `created_at` | timestamp | Auto-generated |

#### 6. `tags` (v0.4.0)
Blog tags

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Tag name |
| `slug` | text | URL-friendly slug (unique) |
| `created_at` | timestamp | Auto-generated |

#### 7. `post_tags` (v0.4.0)
Many-to-many junction table for posts and tags

| Column | Type | Description |
|--------|------|-------------|
| `post_id` | uuid | Foreign key to posts |
| `tag_id` | uuid | Foreign key to tags |

**Primary Key**: Composite `(post_id, tag_id)`

#### 8. `comments` (v0.4.0)
User comments on blog posts

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `post_id` | uuid | Foreign key to posts |
| `user_name` | text | Commenter's name |
| `user_email` | text | Commenter's email |
| `content` | text | Comment content |
| `is_approved` | boolean | Approval status (default: false) |
| `created_at` | timestamp | Auto-generated |

**RLS Policies**:
- Public INSERT (anyone can submit)
- Public SELECT on `is_approved = true`
- Authenticated users (admin) can UPDATE and DELETE

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

### ✨ v0.2.1 - Admin Editing Capabilities
- ✅ **Full CRUD (Update) Operations**:
  - Edit exchange rate, hotline, Zalo link directly in UI
  - Edit service fee rules (min/max value, deposit %, fee %)
  - Edit shipping rates (all methods: TMDT, Tiểu Ngạch, Chính Ngạch)
- ✅ **Modal Dialog UX**:
  - Edit forms open in modal dialogs
  - Pre-filled with existing data
  - Smooth animations (fade-in, zoom-in)
  - Close on escape or outside click
- ✅ **Form Validation**:
  - React Hook Form + Zod schemas
  - Inline error messages
  - Prevent negative numbers
  - Cross-field validation (min ≤ max)
- ✅ **Enhanced UX**:
  - Loading spinners during save
  - Success/error toast notifications
  - Automatic data refresh after edits
  - VND formatting (e.g., 3,000,000)
- ✅ **Security**:
  - RLS policies restrict UPDATE to authenticated users
  - Secure mutation hooks with proper error handling
- ✅ **New Components**:
  - `Dialog.tsx` - Reusable modal component
  - `Label.tsx` - Form label with required indicator
  - `EditServiceFeeDialog.tsx` - Service fee editor
  - `EditShippingRateDialog.tsx` - Shipping rate editor with dynamic units

### 🚀 v0.4.0 - Content Powerhouse (Current)
- ✅ **Rich Text Editor (TipTap)**:
  - Complete toolbar: Bold, Italic, Headings, Lists, Blockquotes, Images
  - Image insertion via URL input
  - Undo/Redo functionality
  - Tailwind Typography (`prose-amber`) styling
  - Server-side rendering safe
- ✅ **Categories & Tags System**:
  - Category management at `/admin/categories`
  - Create, edit, delete categories with slug auto-generation
  - Tag support with comma-separated input
  - Auto-create tags on post save
  - Many-to-many relationship (post_tags junction table)
- ✅ **Search & Filter**:
  - Real-time search on blog index page
  - Category filtering with URL params
  - Tag filtering capability (backend ready)
  - Shareable filtered URLs (`?q=...&cat=...`)
- ✅ **Comments System**:
  - Public comment submission form with validation
  - Admin moderation page at `/admin/comments`
  - Filter by status: All / Pending / Approved
  - One-click approve/delete actions
  - Display approved comments on blog detail pages
  - RLS policies for security
- ✅ **Enhanced Blog UX**:
  - Tag display on blog detail pages
  - Category selection in post editor
  - Tag input in post editor (comma-separated)
  - Improved form validation
  - Toast notifications for all actions

### ⭐ v0.3.0 - Golden Era & Blog CMS
- ✅ **Golden Luxury Design System**:
  - Complete visual overhaul from Purple/Violet to Golden/Amber theme
  - Color Palette: Amber-500 (#F59E0B) primary, Amber-50 (#FFFBEB) background
  - Glassmorphism effects (`glass` utility class)
  - Golden glow shadows for premium elements
  - Gradient buttons: `bg-gradient-to-r from-amber-500 to-amber-600`
  - Updated all pages: Home, Contact, Pricing, Blog, Admin
- ✅ **Full-Featured Blog CMS ("Mẹo nhập hàng")**:
  - **Database**: New `posts` table with RLS policies
  - **Admin Interface** (`/admin/posts`):
    - List view with thumbnails, status badges, edit/delete actions
    - Create new post at `/admin/posts/new`
    - Edit existing at `/admin/posts/[id]/edit`
    - Auto-slug generation from Vietnamese titles
    - Rich text content support
    - Image URL input with live preview
    - Publish/Draft toggle
    - Form validation with Zod
  - **Public Pages**:
    - Blog index at `/meo-nhap-hang` (grid of cards)
    - Blog detail at `/meo-nhap-hang/[slug]`
    - Styled with `@tailwindcss/typography` prose classes
    - Golden theme accents
    - Reading time estimation
    - Back navigation
- ✅ **Premium Contact Page** (`/lien-he`):
  - Two-column responsive layout (40% info / 60% form)
  - Contact cards: Hotline (click-to-call), Zalo, Email, Office address
  - Validated contact form (name, phone, message)
  - Golden gradient submit button
  - Google Maps embed at bottom
  - Hover animations on cards
- ✅ **Framer Motion Animations**:
  - Page transitions via `template.tsx` (fadeInUp on route changes)
  - Reusable motion primitives: `fadeIn`, `staggerContainer`, `liftWithGlow`, `scaleOnHover`
  - Blog grid stagger animations
  - Admin table row stagger
  - Contact card animations
  - Navbar glassmorphism
  - Mobile footer slide-up entrance
- ✅ **UI Component Updates**:
  - Home page navbar: Golden gradient logo, version badge, improved links
  - Sticky footer: Golden "Gọi Ngay" button with tap animations
  - Pricing page: Golden banner, CTA section, animations
  - Calculator: Golden submit button
- ✅ **Technical Enhancements**:
  - Tailwind CSS v4 setup (`@import "tailwindcss"`)
  - Server-side Supabase client for SSR (`@supabase/ssr`)
  - Blog server actions in `lib/blog-actions.ts`
  - Blog React Query hooks in `hooks/useBlog.ts`
  - Vietnamese date formatting with `date-fns`
  - Slug generation utility for Vietnamese characters
  - Type-safe blog types in `types/blog.ts`
- ✅ **New Database Tables**:
  - `posts` table with auto-updated `updated_at` trigger
  - RLS policies: Public read (published only), Admin full access
  - Indexes on `slug` and `is_published` for performance

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

### Supabase Direct Queries (v0.2.0+)
Client-side components now query Supabase directly via React Query hooks:

**Read Operations:**
- `useGlobalSettings()` - Fetch settings
- `useServiceFeeRules()` - Fetch service fees
- `useShippingRateRules()` - Fetch shipping rates
- `usePricingRules()` - Fetch all pricing (transformed)

**Write Operations (v0.2.1):**
- `useUpdateGlobalSetting()` - Update exchange rate, hotline, Zalo link
- `useUpdateServiceFee()` - Update service fee rules
- `useUpdateShippingRate()` - Update shipping rate rules

All mutations automatically invalidate related queries to trigger UI refresh.

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
- [SETUP_V0.4.0.md](./SETUP_V0.4.0.md) - 🆕 v0.4.0 CMS Features Setup (Rich Text, Categories, Tags, Comments)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing checklist for all versions
- [walkthrough.md](file:///C:/Users/ADMIN/.gemini/antigravity/brain/faaf8693-78a8-4c1a-b0b8-ecd2f47cdab0/walkthrough.md) - Implementation walkthrough (in artifacts)

---

## 🐛 Known Issues

1. **Middleware Deprecation Warning**
   - Next.js shows warning about "middleware" convention
   - Non-blocking, will migrate to "proxy" in Next.js 15

2. ~~**No Inline Editing**~~ ✅ **FIXED in v0.2.1**
   - ~~Admin pricing page is view-only~~
   - ~~Edit pricing via Supabase Table Editor~~
   - **Now supports full editing via UI dialogs**

---

## 🎯 Future Enhancements

- [x] ~~Inline editing for pricing tables in admin~~ ✅ **Completed in v0.2.1**
- [x] ~~Blog CMS system~~ ✅ **Completed in v0.3.0**
- [x] ~~Premium contact page~~ ✅ **Completed in v0.3.0**
- [x] ~~Golden luxury design system~~ ✅ **Completed in v0.3.0**
- [x] ~~Rich text editor for blog content~~ ✅ **Completed in v0.4.0 (TipTap)**
- [x] ~~Blog categories and tags~~ ✅ **Completed in v0.4.0**
- [x] ~~Blog search functionality~~ ✅ **Completed in v0.4.0**
- [x] ~~Blog comments system~~ ✅ **Completed in v0.4.0**
- [ ] Enhanced tag UI (multi-select, auto-complete)
- [ ] Admin Tags management page
- [ ] Add/delete pricing rules via admin UI (CREATE/DELETE operations)
- [ ] Bulk import/export for pricing data via CSV
- [ ] Real-time sync with Supabase subscriptions
- [ ] Pricing change history/audit log
- [ ] Version control for pricing changes
- [ ] Price preview showing impact on sample calculations
- [ ] Export pricing to PDF/CSV
- [ ] Advanced table filters (search, sort, pagination)
- [ ] Multi-language support (EN/VI)
- [ ] Mobile app version
- [ ] SEO optimization for blog pages
- [ ] Social media sharing for blog posts

---

**Last Updated:** 2026-01-18  
**Version:** 0.4.0 "Content Powerhouse" (Current)  
**Author:** Developed with Claude 3.5 Sonnet Thinking
