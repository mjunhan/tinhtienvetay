# v0.4.0 Setup Guide - Content Powerhouse

## ⚠️ CRITICAL: Database Migration Required

Before testing the v0.4.0 CMS features, you **MUST** run the new database migration for categories, tags, and comments.

### Step-by-Step Migration Process

#### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy Migration SQL**
   - Open: `supabase/migrations/004_create_cms_tables.sql`
   - Copy the entire file contents

4. **Execute Migration**
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for success message

5. **Verify Migration**
   - Go to "Table Editor"
   - Confirm new tables exist:
     - `categories`
     - `tags`
     - `post_tags` (junction table)
     - `comments`
   - Check `posts` table has new column: `category_id`

6. **Verify RLS Policies**
   - Go to "Authentication" → "Policies"
   - Confirm policies for new tables:
     - **Categories**: Public read, Admin write/update/delete
     - **Tags**: Public read, Admin write/update/delete
     - **Post Tags**: Public read, Admin write/delete
     - **Comments**: Public read (approved only), Everyone can insert, Admin can update/delete

---

## 🎨 v0.4.0 New Features

### 1. Rich Text Editor (TipTap)

**Location**: `/admin/posts/new` or `/admin/posts/[id]/edit`

**Features**:
- Complete formatting toolbar
- Bold, Italic, Strike-through
- Headings (H1, H2, H3)
- Bullet lists, Ordered lists
- Blockquotes
- Horizontal rules
- Image insertion (via URL)
- Undo/Redo

**How to Use**:
1. Login to admin
2. Navigate to "Quản lý bài viết"
3. Click "Tạo bài viết mới"
4. Use the toolbar to format your content
5. Click image button to insert images (enter URL)
6. Content is saved as HTML in database

---

### 2. Categories & Tags System

#### Categories Management

**Location**: `/admin/categories`

**Actions**:
- View all categories in a table
- Create new category with auto-slug generation
- Edit existing categories
- Delete categories (if not in use by posts)

**How to Create Category**:
1. Go to `/admin/categories`
2. Fill in form:
   - **Name**: "Mẹo vận chuyển"
   - **Slug**: Auto-generated as `meo-van-chuyen` (editable)
   - **Description**: "Các mẹo tiết kiệm chi phí vận chuyển"
3. Click "Tạo danh mục"
4. Category appears in table

#### Tags in Post Editor

**Location**: `/admin/posts/new` or `/admin/posts/[id]/edit`

**How to Add Tags**:
1. In post editor, find "Tags" field
2. Enter comma-separated tags:
   ```
   nhập hàng, tiết kiệm, TMDT, Taobao
   ```
3. Tags are auto-created if they don't exist
4. Spaces are trimmed, duplicates removed
5. Slug auto-generated for each tag

**Tag Display**:
- Blog detail page shows all tags for a post
- Tags display as amber badges
- Clicking tag (future feature) will filter posts

---

### 3. Search & Filter System

**Location**: `/meo-nhap-hang` (public blog index)

**Features**:
- **Search**: Real-time search by title or excerpt
- **Category Filter**: Dropdown to filter by category
- **URL Params**: Shareable filtered URLs
  - Example: `/meo-nhap-hang?q=vận chuyển&cat=meo-van-chuyen`

**How to Test**:
1. Create 3-4 blog posts with different categories
2. Go to `/meo-nhap-hang`
3. Type in search box → See results update instantly
4. Select category from dropdown → See filtered posts
5. Copy URL → Share with others (filter persists)

---

### 4. Comments System

#### Public Comment Submission

**Location**: Any blog detail page `/meo-nhap-hang/[slug]`

**How to Submit Comment**:
1. Navigate to any published blog post
2. Scroll to bottom "Bình luận" section
3. Fill in form:
   - **Tên của bạn**: "Nguyễn Văn A"
   - **Email**: "email@example.com" (optional)
   - **Bình luận**: Your comment text
4. Click "Gửi bình luận"
5. Success message appears
6. Comment is **pending approval** (not visible yet)

#### Admin Comment Moderation

**Location**: `/admin/comments`

**Features**:
- View all comments (pending + approved)
- Filter by status: All / Pending / Approved
- One-click approve button
- One-click delete button
- Shows post title, commenter info, timestamp

**How to Moderate**:
1. Go to `/admin/comments`
2. See list of all comments
3. Filter by "Đang chờ" to see pending comments
4. Click **"Duyệt"** (green button) → Comment becomes public
5. Or click **"Xóa"** (red button) → Comment deleted permanently
6. Approved comments appear on blog post immediately

---

## 🧪 Complete Testing Workflow

### Test 1: Create Complete Blog Post

1. **Create Category**
   - `/admin/categories`
   - Create "Hướng dẫn nhập hàng"

2. **Create Post with All Features**
   - `/admin/posts/new`
   - Title: "10 Mẹo Tiết Kiệm Khi Nhập Hàng Từ Trung Quốc"
   - Category: Select "Hướng dẫn nhập hàng"
   - Tags: `nhập hàng, tiết kiệm, Trung Quốc, TMDT`
   - Use Rich Text Editor:
     - Add H2 heading: "## 1. Chọn Phương Thức Vận Chuyển Phù Hợp"
     - Add paragraph with bold/italic formatting
     - Add bullet list
     - Insert image via URL
   - Thumbnail URL: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d`
   - Check "Publish"
   - Click "Tạo bài viết"

3. **View Public Post**
   - Navigate to `/meo-nhap-hang`
   - See your post in grid
   - Click "Đọc thêm"
   - Verify:
     - Rich text formatting displays correctly
     - Image loads
     - Category and tags show as badges
     - Comment form appears at bottom

4. **Submit Comment**
   - Fill comment form on post detail page
   - Submit
   - Verify success toast

5. **Moderate Comment**
   - Go to `/admin/comments`
   - See your comment with "Đang chờ" badge
   - Click "Duyệt"
   - Return to public post
   - Verify comment now appears

6. **Test Search & Filter**
   - Go to `/meo-nhap-hang`
   - Search for "tiết kiệm" → See your post
   - Filter by category → See relevant posts
   - Clear filters → See all posts

---

## 🎨 Theme Verification (Golden Luxury)

All v0.4.0 pages maintain the golden theme from v0.3.0:

### Visual Checklist

- [ ] Background: Cream/Amber-50 (not blue-gray)
- [ ] Primary buttons: Golden gradient (amber-500 to amber-600)
- [ ] Cards: White with amber borders
- [ ] Hover effects: Golden glow shadow
- [ ] Badges: Amber background for tags/categories
- [ ] Status badges: Green (approved), yellow (pending), red (delete)

### Page-Specific Checks

1. **Categories Page** (`/admin/categories`)
   - Table header: Amber-50 background
   - Create button: Golden gradient
   - Edit/Delete buttons: Amber/Red

2. **Post Editor** (`/admin/posts/new`)
   - Rich Text Editor toolbar: Light gray background
   - Category dropdown: Proper styling
   - Tags input: Input with amber focus ring

3. **Comments Page** (`/admin/comments`)
   - Filter tabs: Amber active state
   - Action buttons: Green (approve), Red (delete)

4. **Blog Detail with Comments** (`/meo-nhap-hang/[slug]`)
   - Comment section: White card on amber background
   - Submit button: Golden gradient
   - Approved comments: Clean list display

---

## 🐛 Troubleshooting

### "Failed to fetch categories"

**Problem**: Category dropdown shows error

**Solution**:
1. Verify `004_create_cms_tables.sql` migration ran successfully
2. Check RLS policies are enabled for `categories` table
3. Try creating a category manually in Supabase Table Editor

### "Comment not appearing after approval"

**Problem**: Clicked "Duyệt" but comment still not visible

**Solution**:
1. Refresh the page (might need cache clear)
2. Check if `is_approved` column is `true` in Supabase Table Editor
3. Verify RLS policy allows public read for approved comments

### "Rich Text Editor not loading"

**Problem**: Editor shows blank or loading forever

**Solution**:
1. Check browser console for errors
2. Verify `@tiptap/*` packages installed: `npm list @tiptap/react`
3. Editor is client-side only (needs `'use client'` directive)

### "Tags not saving"

**Problem**: Enter tags but they disappear after save

**Solution**:
1. Tags must be comma-separated: `tag1, tag2, tag3`
2. Check `tags` and `post_tags` tables exist in database
3. Verify RLS policies allow insert on both tables

---

## 📱 Responsive Testing

### Mobile (375px - 768px)
- [ ] Rich Text Editor toolbar: Scrollable
- [ ] Category management: Single column table
- [ ] Comment form: Stacked layout
- [ ] Blog cards: Single column grid

### Tablet (768px - 1024px)
- [ ] Blog grid: 2 columns
- [ ] Comment moderation: Compact table

### Desktop (1024px+)
- [ ] Blog grid: 3 columns
- [ ] Category table: Full width with all columns
- [ ] Rich Text Editor: Full toolbar visible
- [ ] Comment moderation: Spacious table

---

## 🚀 Next Steps

1. **✅ Run database migration** `004_create_cms_tables.sql`
2. **✅ Create 3-5 categories** for organizing posts
3. **✅ Create 5-10 sample blog posts** with:
   - Different categories
   - Multiple tags each
   - Rich formatted content
   - Images
4. **✅ Test comment workflow**:
   - Submit as public user
   - Moderate as admin
   - Verify display
5. **✅ Test search & filter** with various queries
6. **Optional**: Update Navbar to link to categories

---

## 📦 New Files in v0.4.0

### Database
- `supabase/migrations/004_create_cms_tables.sql`

### Components
- `src/components/admin/editor/RichTextEditor.tsx`
- `src/components/blog/CommentForm.tsx`
- `src/components/blog/CommentList.tsx`

### Pages
- `src/app/admin/categories/page.tsx`
- `src/app/admin/comments/page.tsx`

### Hooks
- `src/hooks/useCMS.ts` (categories & tags)
- `src/hooks/useComments.ts`

### Server Actions
- `src/lib/comment-actions.ts`

### Dependencies Added
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-image`
- `date-fns` (for date formatting)

---

## 💡 Content Strategy Tips

### Optimal Tag Usage
- Use 3-6 tags per post
- Mix broad tags ("nhập hàng") with specific ("Taobao")
- Keep tags consistent across similar posts
- Avoid very long tag names

### Category Organization
Suggested categories:
1. "Hướng dẫn cơ bản" (Beginner guides)
2. "Mẹo tiết kiệm" (Saving tips)
3. "Phương thức vận chuyển" (Shipping methods)
4. "Câu hỏi thường gặp" (FAQ)
5. "Tin tức cập nhật" (News & updates)

### Rich Text Best Practices
- Use H2 for main sections, H3 for subsections
- Add images every 2-3 paragraphs
- Use bullet lists for tips/steps
- Add blockquotes for important notes
- Keep paragraphs short (3-4 lines max)

---

**Ready to unleash the Content Powerhouse! 🚀📝✨**

**If you encounter any issues, check:**
1. Database migration ran successfully
2. All RLS policies are active
3. `.env.local` has correct Supabase credentials
4. Admin user is authenticated
