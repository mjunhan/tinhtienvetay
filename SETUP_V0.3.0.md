# v0.3.0 Setup Guide

## ⚠️ CRITICAL: Database Migration Required

Before testing the blog features, you **MUST** run the database migration.

### Step-by-Step Migration Process

#### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy Migration SQL**
   - Open: `supabase/migrations/003_create_posts_table.sql`
   - Copy the entire file contents

4. **Execute Migration**
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for success message

5. **Verify Migration**
   - Go to "Table Editor"
   - Confirm `posts` table exists
   - Check columns: id, title, slug, excerpt, content, thumbnail_url, is_published, created_at, updated_at

6. **Verify RLS Policies**
   - Go to "Authentication" → "Policies"
   - Confirm 5 policies for `posts` table:
     - Public can view published posts
     - Admin can insert posts
     - Admin can update posts
     - Admin can delete posts
     - Admin can view all posts

#### Option 2: Supabase CLI (Alternative)

```bash
# If you have Supabase CLI installed
npx supabase migration up --local

# Or for production
npx supabase db push
```

---

## 🧪 Testing the Blog System

### 1. Create Your First Blog Post

1. **Login to Admin**
   - Navigate to `/admin/login`
   - Use your Supabase credentials

2. **Access Posts Manager**
   - Go to `/admin/posts`
   - Click "Tạo bài viết mới"

3. **Fill in Post Details**
   - **Title**: "5 Mẹo Tiết Kiệm Chi Phí Khi Nhập Hàng Từ Trung Quốc"
   - **Slug**: Auto-generated (you can edit)
   - **Excerpt**: "Khám phá những bí quyết giúp bạn tiết kiệm hàng triệu đồng khi nhập hàng..."
   - **Content**: Add some HTML or plain text content
   - **Thumbnail URL**: Use a sample image URL (e.g., from Unsplash)
   - **Publish**: Check the box to make it public

4. **Save Post**
   - Click "Tạo bài viết"
   - Verify redirect to posts list
   - See your new post in the table

### 2. View Public Blog

1. **Navigate to Blog**
   - Visit `/meo-nhap-hang`
   - See your published post as a card

2. **Open Blog Detail**
   - Click "Đọc thêm"
   - View full post with styled typography

3. **Test Animations**
   - Hover over cards (golden glow effect)
   - Navigate between pages (smooth transitions)

### 3. Test Contact Form

1. **Open Contact Page**
   - Visit `/lien-he`

2. **Test Form Validation**
   - Submit empty form → See error messages
   - Fill with invalid phone → See validation error

3. **Submit Valid Form**
   - Name: "Nguyễn Văn A"
   - Phone: "0123456789"
   - Message: "Tôi cần hỗ trợ tư vấn về dịch vụ nhập hàng"
   - Click "Gửi tin nhắn"
   - Verify success toast notification

---

## 🎨 Theme Verification

### Visual Checklist

- [ ] Background is light cream (amber-50), not blue-gray
- [ ] Submit buttons have amber gradient (yellow-orange), not purple
- [ ] Cards have amber borders, not pink
- [ ] Hover effects show golden glow
- [ ] Text is readable (no white-on-yellow violations)

### Page-by-Page Check

1. **Home/Calculator** (`/`)
   - Button: Golden gradient
   - Background: Amber-50

2. **Blog Index** (`/meo-nhap-hang`)
   - Cards: White with amber borders
   - Hover: Golden glow + lift effect
   - Badge: Amber background

3. **Blog Detail** (`/meo-nhap-hang/[slug]`)
   - CTA Footer: Golden gradient
   - Link color: Amber
   - Blockquotes: Amber accent

4. **Contact** (`/lien-he`)
   - Form borders: Amber
   - Submit button: Golden gradient
   - Info cards: Colored gradients (phone, zalo, etc.)

5. **Admin Posts** (`/admin/posts`)
   - Table header: Amber-50 background
   - Status badges: Green/Gray
   - Action buttons: Amber/Red

---

## 🐛 Troubleshooting

### "Failed to fetch posts"

**Problem**: Blog pages show error when loading posts.

**Solution**:
1. Verify database migration ran successfully
2. Check RLS policies are enabled
3. Ensure Supabase credentials in `.env.local` are correct
4. Try logging in/out to refresh auth session

### "A post with this slug already exists"

**Problem**: Can't create post with duplicate slug.

**Solution**:
- Slugs must be unique
- Edit the auto-generated slug to make it different
- Or delete the existing post with that slug

### Images not showing

**Problem**: Thumbnail images don't display.

**Solution**:
- Ensure URL is valid and publicly accessible
- Use HTTPS URLs (not HTTP)
- Try Unsplash/Pexels URLs for testing
- Example: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d`

### Contact form doesn't submit

**Problem**: Form validation errors on all fields.

**Solution**:
- Name must be at least 2 characters
- Phone must be at least 10 characters
- Message must be at least 10 characters
- Currently form just logs to console (no backend save)

---

## 📱 Responsive Testing

### Mobile (375px - 768px)
- [ ] Blog grid: Single column
- [ ] Contact page: Stacked layout (info cards on top, form below)
- [ ] Calculator: Full width
- [ ] Navigation: Hamburger menu (if applicable)

### Tablet (768px - 1024px)
- [ ] Blog grid: 2 columns
- [ ] Contact page: Transitioning to side-by-side

### Desktop (1024px+)
- [ ] Blog grid: 3 columns
- [ ] Contact page: 40/60 split layout
- [ ] Everything aligned and centered

---

## 🚀 Next Steps

1. **✅ Run database migration** (most important!)
2. **✅ Create 2-3 sample blog posts** with real content
3. **✅ Test all animations** and verify smooth performance
4. **✅ Update contact info** in `/lien-he/page.tsx`:
   - Real phone number (currently `0123 456 789`)
   - Real Zalo link
   - Real office address
   - Real email address
5. **✅ Update Google Maps** embed to your actual location
6. **Optional**: Update Navbar and Footer with golden accents

---

## 📦 Files Modified/Created

### New Files (28)
- `supabase/migrations/003_create_posts_table.sql`
- `src/types/blog.ts`
- `src/lib/blog-actions.ts`
- `src/lib/supabase/server.ts`
- `src/hooks/useBlog.ts`
- `src/components/ui/motion-primitives.tsx`
- `src/components/admin/PostForm.tsx`
- `src/app/template.tsx`
- `src/app/admin/posts/page.tsx`
- `src/app/admin/posts/new/page.tsx`
- `src/app/admin/posts/[id]/edit/page.tsx`
- `src/app/meo-nhap-hang/page.tsx`
- `src/app/meo-nhap-hang/[slug]/page.tsx`
- `src/app/lien-he/page.tsx`

### Modified Files (4)
- `src/app/globals.css` - Golden theme + typography
- `src/app/layout.tsx` - Amber background + metadata
- `src/components/calculator/Calculator.tsx` - Golden button
- `package.json` - New dependencies

---

## 💡 Tips for Content Creation

### Sample Blog Post Ideas
1. "5 Mẹo Tiết Kiệm Chi Phí Khi Nhập Hàng Từ Trung Quốc"
2. "Hướng Dẫn Tính Phí Vận Chuyển Chính Xác Nhất"
3. "Những Sai Lầm Thường Gặp Khi Đặt Hàng Taobao"
4. "So Sánh TMDT vs Chính Ngạch vs Tiểu Ngạch"
5. "Cách Chọn Kho Hàng Tốt Nhất (HN vs HCM)"

### Content Structure
```markdown
## Introduction
Brief overview of the topic...

## Main Point 1
Detailed explanation...

## Main Point 2
More details...

## Conclusion
Summary and call-to-action...quail
```

### Image Recommendations
- Use high-quality images (min 1200x630px)
- Relevant to shipping/logistics
- Free sources: Unsplash, Pexels, Pixabay
- Ensure images are optimized (under 200KB)

---

**Ready to test! Run that migration and explore v0.3.0! 🎉**
