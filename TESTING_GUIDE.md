# Complete Testing Guide (v0.2.0 - v0.4.0)

## Quick Test Checklist

### ✅ 1. Calculator Page (/)
- [ ] Visit `http://localhost:3000`
- [ ] Page loads without errors
- [ ] Button shows "XEM BÁO GIÁ CHI TIẾT" (not loading spinner)
- [ ] Enter product details and calculate
- [ ] Results display correctly
- [ ] Try all 3 shipping methods (TMDT, TieuNgach, ChinhNgach)
- [ ] Verify calculations match expected values

### ✅ 2. Public Pricing Page (/bang-gia)
- [ ] Visit `http://localhost:3000/bang-gia`
- [ ] Exchange rate banner displays (e.g., 1¥ = 3,960₫)
- [ ] TMDT table shows with correct rates
- [ ] TieuNgach table shows with correct rates  
- [ ] ChinhNgach Heavy table shows (by kg)
- [ ] ChinhNgach Bulky table shows (by m³)
- [ ] All prices match Supabase data
- [ ] "Tính phí ngay" button links to home
- [ ] Responsive on mobile (open DevTools, toggle mobile view)

### ✅ 3. Admin Login (/admin/login)
- [ ] Visit `http://localhost:3000/admin`
- [ ] Redirects to `/admin/login?redirect=%2Fadmin`
- [ ] Enter email and password (created in Supabase Auth)
- [ ] Login succeeds and redirects to dashboard
- [ ] Session persists on page refresh
- [ ] Invalid credentials show error message

### ✅ 4. Admin Dashboard (/admin)
- [ ] Dashboard loads after login
- [ ] Sidebar shows on desktop
- [ ] Hamburger menu works on mobile
- [ ] User email displays in sidebar
- [ ] Stats cards display (4 cards)
- [ ] Quick action cards are clickable
- [ ] "Xem trang công khai" opens in new tab

### ✅ 5. Admin Settings (/admin/settings)
- [ ] Click "Cài đặt chung" in sidebar
- [ ] Current exchange rate loads from Supabase
- [ ] Change exchange rate value
- [ ] Click "Lưu thay đổi"
- [ ] Toast notification shows "Đã lưu cài đặt!"
- [ ] Click "Làm mới" to reload

### ✅ 6. Admin Pricing (/admin/pricing)
- [ ] Click "Quản lý giá" in sidebar
- [ ] Service Fees tab shows by default
- [ ] TMDT, TieuNgach, ChinhNgach tables display
- [ ] Switch to "Phí vận chuyển" tab
- [ ] Shipping rates summary displays
- [ ] All data matches Supabase database

### ✅ 7. Admin Logout
- [ ] Click "Đăng xuất" button in sidebar
- [ ] Confirms logout (check toast)
- [ ] Redirects to `/admin/login`
- [ ] Try accessing `/admin` → redirects to login
- [ ] Session cleared (cookies removed)

### ✅ 8. Real-time Updates Test
**This is the KEY test for v0.2.0!**

1. **Prepare two browser tabs:**
   - Tab 1: `http://localhost:3000` (Calculator)
   - Tab 2: `http://localhost:3000/admin/settings`

2. **Test exchange rate update:**
   - [ ] In Tab 2 (Admin), change exchange rate to 4000
   - [ ] Click "Lưu thay đổi"
   - [ ] Wait for success toast
   - [ ] In Tab 1 (Calculator), refresh the page
   - [ ] Enter a product (e.g., 100 CNY)
   - [ ] Verify: 100 × 4000 = 400,000 VND displayed

3. **Test pricing page update:**
   - [ ] Open Tab 3: `http://localhost:3000/bang-gia`
   - [ ] Refresh the page
   - [ ] Verify exchange rate banner shows "1¥ = 4,000₫"

### ✅ 9. Different Shipping Methods
- [ ] TMDT: Order value 1M VND → Check rate applies correctly
- [ ] TMDT: Order value 6M VND → Check different rate tier
- [ ] TieuNgach: Order value 1M VND → Verify lower rates than TMDT
- [ ] ChinhNgach: 100kg order → Verify weight-based pricing
- [ ] ChinhNgach: 1000kg order → Verify different tier applies

### ✅ 10. Mobile Responsiveness
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select "iPhone 12 Pro" or similar
- [ ] Test all pages:
  - [ ] Calculator works on mobile
  - [ ] Pricing page tables are scrollable
  - [ ] Admin sidebar becomes hamburger menu
  - [ ] All buttons are tappable (not too small)

### ✅ 11. Error Handling
- [ ] Disconnect internet (or pause Supabase)
- [ ] Visit calculator → Should show error state gracefully
- [ ] Visit `/bang-gia` → Should show error message
- [ ] Reconnect → Everything works again

### ✅ 12. Production Build Test
```bash
npm run build
```
- [ ] Build completes with exit code 0
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All 14 routes generated
- [ ] Bundle size reasonable

```bash
npm start
```
- [ ] Production build runs on port 3000
- [ ] All pages work in production mode
- [ ] Performance is good

---

## 🆕 v0.3.0 & v0.4.0 Feature Tests

### ✅ 13. Blog Posts Management (/admin/posts)
- [ ] Visit `/admin/posts` (login required)
- [ ] See empty table or existing posts
- [ ] Click "Tạo bài viết mới"
- [ ] Fill in post form:
  - Title: "Test Blog Post"
  - Slug: Auto-generated (can edit)
  - Excerpt: Short summary
  - Content: Use Rich Text Editor (see section 14)
  - Thumbnail URL: Valid image URL
  - Category: Select from dropdown (v0.4.0)
  - Tags: Comma-separated list (v0.4.0)
  - Publish: Check to publish immediately
- [ ] Click "Tạo bài viết"
- [ ] Toast shows success
- [ ] Redirects to posts list
- [ ] New post appears in table
- [ ] Click "Sửa" to edit existing post
- [ ] Make changes and save
- [ ] Click "Xóa" to delete
- [ ] Confirm deletion works

### ✅ 14. Rich Text Editor (v0.4.0)
- [ ] In post editor, verify toolbar appears
- [ ] Test Bold formatting (Ctrl+B)
- [ ] Test Italic formatting (Ctrl+I)
- [ ] Test Headings (H1, H2, H3 buttons)
- [ ] Test Bullet list
- [ ] Test Numbered list
- [ ] Test Blockquote
- [ ] Test Horizontal rule
- [ ] Test image insertion:
  - Click image icon
  - Enter URL: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d`
  - Image appears inline
- [ ] Test Undo (Ctrl+Z)
- [ ] Test Redo (Ctrl+Shift+Z)
- [ ] Save post and verify formatting persists
- [ ] View on public blog → formatting displays correctly

### ✅ 15. Categories Management (v0.4.0)
- [ ] Visit `/admin/categories`
- [ ] See categories table (or empty)
- [ ] Fill in create form:
  - Name: "Hướng dẫn cơ bản"
  - Slug: Auto-generated as `huong-dan-co-ban`
  - Description: Optional description
- [ ] Click "Tạo danh mục"
- [ ] New category appears in table
- [ ] Create 2-3 more categories for testing
- [ ] Edit existing category
- [ ] Delete unused category (works)
- [ ] Try to delete category used by posts (should prevent or cascade)

### ✅ 16. Tags System (v0.4.0)
- [ ] In post editor (`/admin/posts/new`)
- [ ] Find "Tags" input field
- [ ] Enter: `nhập hàng, tiết kiệm, TMDT, Taobao`
- [ ] Save post
- [ ] Navigate to blog detail page
- [ ] Verify tags display as amber badges
- [ ] Go to Supabase Table Editor
- [ ] Check `tags` table → Tags created automatically
- [ ] Check `post_tags` table → Junction entries created
- [ ] Edit post and remove a tag
- [ ] Save → Junction entry deleted (tag remains in `tags` table)

### ✅ 17. Public Blog Index (/meo-nhap-hang)
- [ ] Visit `/meo-nhap-hang`
- [ ] See grid of published posts (3 columns on desktop)
- [ ] Each card shows:
  - Thumbnail image
  - Title
  - Excerpt
  - "Đọc thêm" button
- [ ] Hover over card → Golden glow animation
- [ ] Click "Đọc thêm" → Opens detail page
- [ ] Test responsive:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns

### ✅ 18. Blog Detail Page (/meo-nhap-hang/[slug])
- [ ] Click on any blog post
- [ ] Title displays correctly
- [ ] Thumbnail shows (if set)
- [ ] Content renders with Rich Text formatting
- [ ] Category badge displays (v0.4.0)
- [ ] Tags display as amber badges (v0.4.0)
- [ ] Typography styling looks good (Tailwind prose)
- [ ] "← Quay lại" link works
- [ ] CTA section at bottom (golden button)
- [ ] Comment form appears at bottom (v0.4.0)
- [ ] Approved comments display above form (v0.4.0)

### ✅ 19. Search & Filter (v0.4.0)
- [ ] Go to `/meo-nhap-hang`
- [ ] **Search box**:
  - Type partial title → Results filter instantly
  - Type partial excerpt → Also filters
  - Clear search → All posts return
- [ ] **Category dropdown**:
  - Select category → Only posts from that category show
  - Select "Tất cả" → All posts return
- [ ] **Combined filter**:
  - Search + Category filter together
  - Results match both criteria
- [ ] **URL params**:
  - Apply filters → URL updates to `?q=...&cat=...`
  - Copy URL and paste in new tab → Filters persist
  - Share URL with someone → They see filtered results

### ✅ 20. Comments System - User Side (v0.4.0)
- [ ] Open any blog detail page
- [ ] Scroll to "Bình luận" section
- [ ] Fill in comment form:
  - Tên: "Test User"
  - Email: "test@example.com" (optional)
  - Bình luận: "This is a test comment."
- [ ] Submit form
- [ ] Toast shows "Bình luận đã được gửi! Chờ kiểm duyệt."
- [ ] Comment **does NOT** appear yet (pending approval)
- [ ] Form clears after submission
- [ ] Test validation:
  - Submit without name → Error
  - Submit without comment → Error
  - Invalid email → Error

### ✅ 21. Comments Moderation - Admin Side (v0.4.0)
- [ ] Login as admin
- [ ] Visit `/admin/comments`
- [ ] See list of all comments
- [ ] **Filter tabs**:
  - Click "Tất cả" → Shows all comments
  - Click "Đang chờ" → Shows only pending (yellow badge)
  - Click "Đã duyệt" → Shows only approved (green badge)
- [ ] For pending comment:
  - Click "Duyệt" (green button)
  - Toast shows success
  - Badge changes to "Đã duyệt"
  - Comment moves to approved filter
- [ ] For any comment:
  - Click "Xóa" (red button)
  - Comment removed from table
- [ ] Return to public blog post
- [ ] Approved comments now visible
- [ ] Comments display with name, date, content

### ✅ 22. Contact Page (/lien-he)
- [ ] Visit `/lien-he`
- [ ] **Layout**:
  - Desktop: 2 columns (40% info, 60% form)
  - Mobile: Stacked (info on top, form below)
- [ ] **Info cards**:
  - Hotline (click-to-call link)
  - Zalo (opens Zalo link)
  - Email (mailto link)
  - Office address
- [ ] **Contact form**:
  - Fill in name, phone, message
  - Submit → Success toast appears
- [ ] **Google Maps** embed at bottom loads
- [ ] Hover effects on info cards work
- [ ] Golden theme consistent

### ✅ 23. Performance & Animations (v0.3.0+)
- [ ] Page transitions smooth (fadeInUp animation)
- [ ] Blog cards have stagger animation on load
- [ ] Hover effects:
  - Cards lift with golden glow
  - Buttons scale slightly
- [ ] Mobile footer "Gọi Ngay" button sticky
- [ ] No layout shift (CLS) issues
- [ ] No unnecessary re-renders
- [ ] React Query cache working (check Network tab)

---

## Expected Results Summary

**All Tests Passing** ✅ = Production Ready!

**Critical Features (Must Work)**:
- ✅ Calculator with dynamic pricing
- ✅ Admin can edit settings and pricing
- ✅ Blog CMS fully functional
- ✅ Rich Text Editor works
- ✅ Categories and Tags system
- ✅ Comments with moderation
- ✅ Search and filter
- ✅ Responsive on all devices

**Optional Features (Nice to Have)**:
- ✅ Animations smooth
- ✅ Performance optimized
- ✅ SEO metadata (if implemented)

If you encounter any issues:
1. Check browser console for errors
2. Check terminal for server errors
3. Verify Supabase credentials in `.env.local`
4. Confirm all migrations ran successfully
5. Check Supabase Dashboard → Table Editor to verify data
6. Clear browser cache and try again

---

## Expected Results Summary

**All Green** ✅ = Production Ready!

If you encounter any issues:
1. Check browser console for errors
2. Check terminal for server errors
3. Verify Supabase credentials in `.env.local`
4. Confirm database tables have data (run seed script)
5. Check Supabase Dashboard → Table Editor to verify data

---

## Performance Benchmarks

**Good Metrics:**
- Calculator page load: < 2s
- Pricing page load: < 2s
- Admin dashboard load: < 2s
- Data fetch from Supabase: < 500ms

**React Query Cache:**
- First load: Fetches from Supabase
- Subsequent loads: Uses cache (instant)
- Cache invalidates: On admin mutations

---

## Known Issues (Minor)

1. **Middleware Warning**: "middleware is deprecated"
   - ⚠️ Non-blocking warning
   - 🔧 Fix: Migrate to Next.js 15 "proxy" in future

2. ~~**No Inline Editing**~~ ✅ **FIXED in v0.2.1**
   - ~~Pricing tables are view-only in admin~~
   - ~~Edit via Supabase Table Editor directly~~
   - **Now supports full editing via UI dialogs**

3. **Markdown to Rich Text Migration** (v0.4.0)
   - Old posts (if any) with markdown won't render properly
   - 🔧 Re-edit old posts in Rich Text Editor to update

---

**Testing Complete?** 🎉  
Mark all checkboxes (including v0.4.0 tests) and you're ready for production deployment!
