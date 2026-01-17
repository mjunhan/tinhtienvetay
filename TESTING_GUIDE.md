# v0.2.0 Testing Guide

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

2. **No Inline Editing**
   - 📝 Pricing tables are view-only in admin
   - 🔧 Edit via Supabase Table Editor directly

---

**Testing Complete?** 🎉  
Mark all checkboxes and you're ready for production deployment!
