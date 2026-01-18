# 🚀 Tính Tiền Về Tay v0.4.2

> **Ứng dụng tính toán chi phí nhập hàng từ Trung Quốc về Việt Nam với hệ thống quản trị động, Blog CMS đầy đủ và UI/UX tối ưu**

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
- 📝 **Blog CMS**: Đọc mẹo nhập hàng tại `/meo-nhap-hang` với tìm kiếm và lọc theo danh mục
- 💬 **Bình luận**: Để lại bình luận trên bài viết (có kiểm duyệt)
- 📱 **Responsive**: Tối ưu cho mobile, tablet, desktop
- 📷 **Export Báo Giá**: Tải kết quả dưới dạng hình ảnh

### 🆕 Dành cho Admin (v0.4.0)
- 🔐 **Đăng nhập bảo mật**: Supabase Auth với email/password
- ⚙️ **Cài đặt động**: Thay đổi tỷ giá, hotline, Zalo link real-time
- 💰 **Quản lý giá**: Chỉnh sửa phí dịch vụ và phí vận chuyển
- 📊 **Dashboard**: Tổng quan và truy cập nhanh
- 📚 **Blog Management**:
  - ✏️ Rich Text Editor (TipTap) với formatting, lists, images
  - 🏷️ Category & Tag management
  - 📝 Draft/Publish workflow
- 💬 **Comment Moderation**: Duyệt/xóa bình luận từ người dùng

### ✨ v0.4.2 - UI/UX Excellence (Latest)
- 🎨 **Pixel-Perfect Official Line Table**: Navy blue + gold design
- 👌 **Floating CTA**: Sticky "Tính Giá Ngay" button
- 📊 **Enhanced Exchange Rate**: Pulsing glow + animations
- 🎯 **Better Headers**: Icon badges + subtitles
- 🧤 **Zebra Striping**: Alternating table rows
- 🧹 **Calculator Cleanup**: Simplified 3-column layout

### ✨ v0.4.0 - Content Powerhouse
- 📝 **Rich Text Editor**: TipTap với formatting đầy đủ
- 🏷️ **Categories & Tags**: Quản lý danh mục
- 🔍 **Search & Filter**: Tìm kiếm bài viết
- 💬 **Comments**: Bình luận có kiểm duyệt
- 🎨 **Golden Theme**: Giao diện vàng sang trọng
- ⚡ **Animations**: Framer Motion toàn app

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
-- Chạy trong Supabase SQL Editor (theo thứ tự):
-- 1. supabase/migrations/001_initial_schema.sql (tạo tables cơ bản)
-- 2. supabase/migrations/002_update_rls_policies.sql (RLS policies)
-- 3. supabase/migrations/003_create_blog_tables.sql (blog tables)
-- 4. supabase/migrations/004_create_cms_tables.sql (CMS: categories, tags, comments)
-- 5. supabase-seed.sql (populate data)
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
| `/meo-nhap-hang` | Blog index với search & filter | ❌ No |
| `/meo-nhap-hang/[slug]` | Blog detail với comments | ❌ No |
| `/lien-he` | Trang liên hệ | ❌ No |
| `/admin` | Dashboard admin | ✅ Yes |
| `/admin/login` | Đăng nhập admin | ❌ No |
| `/admin/settings` | Chỉnh sửa tỷ giá & hotline | ✅ Yes |
| `/admin/pricing` | Chỉnh sửa bảng giá | ✅ Yes |
| `/admin/posts` | Quản lý bài viết | ✅ Yes |
| `/admin/posts/new` | Tạo bài viết mới | ✅ Yes |
| `/admin/posts/[id]/edit` | Chỉnh sửa bài viết | ✅ Yes |
| `/admin/categories` | Quản lý danh mục | ✅ Yes |
| `/admin/comments` | Kiểm duyệt bình luận | ✅ Yes |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.2 (App Router + Turbopack)
- **UI**: React 19 + Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Rich Text**: TipTap (Starter Kit + Image Extension)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner

---

## 📖 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Tài liệu kỹ thuật đầy đủ
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Hướng dẫn setup Supabase
- **[SETUP_V0.4.0.md](./SETUP_V0.4.0.md)** - 🆕 Hướng dẫn CMS features (Rich Text, Categories, Tags, Comments)
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Checklist kiểm thử

---

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin system
│   │   ├── posts/          # Blog management
│   │   ├── categories/     # Category management
│   │   ├── comments/       # Comment moderation
│   │   ├── settings/       # Global settings
│   │   └── pricing/        # Pricing management
│   ├── meo-nhap-hang/      # Public blog
│   ├── bang-gia/           # Public pricing page
│   ├── lien-he/            # Contact page
│   └── api/                # API routes
├── components/             # React components
│   ├── admin/              # Admin components
│   │   └── editor/         # TipTap RichTextEditor
│   ├── blog/               # Blog components
│   │   ├── CommentForm.tsx
│   │   └── CommentList.tsx
│   ├── calculator/         # Calculator components
│   └── ui/                 # UI primitives
├── hooks/                  # Custom hooks
│   ├── useCostCalculator.ts
│   ├── usePricingRules.ts
│   ├── useBlog.ts          # Blog queries
│   ├── useCMS.ts           # Categories & Tags
│   └── useComments.ts      # Comment system
├── lib/                    # Utilities
│   ├── supabase/           # Supabase clients
│   ├── blog-actions.ts     # Blog server actions
│   ├── comment-actions.ts  # Comment server actions
│   └── utils.ts            # Helpers
└── types/                  # TypeScript types
    ├── database.types.ts   # Database types
    └── blog.ts             # Blog types
```

---

## 🔐 Admin Access

**URL**: `http://localhost:3000/admin`

**Credentials**: Tạo trong Supabase Auth Dashboard

**Admin capabilities (v0.4.0):**
- View dashboard
- Edit exchange rate, hotline, Zalo link
- Edit service fees and shipping rates
- **Create/Edit/Delete blog posts with Rich Text Editor**
- **Manage categories and tags**
- **Moderate comments (approve/delete)**
- Real-time UI updates after edits

---

## 🧪 Testing

```bash
# Run production build
npm run build
npm start

# Access pages:
# - http://localhost:3000 (Calculator)
# - http://localhost:3000/bang-gia (Pricing)
# - http://localhost:3000/meo-nhap-hang (Blog)
# - http://localhost:3000/admin (Admin)
```

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for full checklist.

---

## 📊 Database Schema

### Tables
1. **`global_settings`** - Exchange rate, hotline, Zalo link
2. **`service_fee_rules`** - Service fees by method, order value, deposit %
3. **`shipping_rate_rules`** - Shipping rates (value/weight/volume based)
4. **`posts`** - Blog posts with rich content
5. **`categories`** - Blog categories (v0.4.0)
6. **`tags`** - Blog tags (v0.4.0)
7. **`post_tags`** - Many-to-many junction table (v0.4.0)
8. **`comments`** - User comments with moderation (v0.4.0)

Full schema: [supabase/migrations](./supabase/migrations/)

---

## 🔄 Version History

### v0.4.2 (Current - 2026-01-18) - UI/UX Excellence ⭐
- ✅ Floating CTA button with fade-in animation
- ✅ Enhanced exchange rate display (pulsing glow)
- ✅ Improved section headers with icons
- ✅ Zebra striping on all pricing tables
- ✅ Official Line table redesign (navy + gold)
- ✅ Calculator cleanup (removed negotiated price)
- ✅ Better spacing and visual hierarchy

### v0.4.0 (2026-01-18) - Content Powerhouse
- ✅ Rich Text Editor (TipTap) integrated into Blog CMS
- ✅ Categories & Tags management system
- ✅ Blog search and category filtering
- ✅ Comments system with admin moderation
- ✅ Enhanced public blog UI with tags display
- ✅ Database migrations for CMS tables

### v0.3.0 (2026-01-18) - Golden Era & Blog CMS
- ✅ Golden luxury design system (Amber theme)
- ✅ Full Blog CMS with create/edit/delete
- ✅ Premium contact page
- ✅ Framer Motion animations
- ✅ Auto-slug generation for Vietnamese

### v0.2.1 (2026-01-17)
- ✅ Admin can edit all pricing directly in UI
- ✅ Modal dialog forms with validation
- ✅ Automatic data refresh after mutations

### v0.2.0 (2026-01-17)
- ✅ Supabase integration for dynamic pricing
- ✅ Admin authentication system
- ✅ Public pricing page (`/bang-gia`)
- ✅ React Query for data fetching

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
- Rich Text by [TipTap](https://tiptap.dev/)

---

**💡 Need Help?**
- Check [DOCUMENTATION.md](./DOCUMENTATION.md) for technical details
- Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup
- Run tests from [TESTING_GUIDE.md](./TESTING_GUIDE.md)

**📞 Support**: Contact via admin panel or repository issues

---

Made with ❤️ using Claude 3.5 Sonnet Thinking
