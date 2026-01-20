# PLAN: Admin Pricing Save Bug Fix

**Tạo:** 2026-01-19  
**Mục tiêu:** Debug và sửa lỗi lưu giá ở trang `/admin/pricing` - hiện tại khi nhấn "Lưu" không có phản hồi gì, data quay về như cũ.

---

## 🔍 Phân Tích Vấn Đề

### Hiện Trạng
- **Triệu chứng:** Khi chỉnh sửa giá trong admin pricing page, nhấn "Lưu" không có phản ứng gì, data reset về giá trị ban đầu
- **Không có thông báo lỗi** nào hiển thị trong UI
- **Data trên Supabase:** Vẫn xem bình thường (connection OK)
- **Môi trường:** Local `npm run dev`
- **File liên quan:**
  - [usePricingRules.ts](file:///d:/tinhtienvetay/src/hooks/usePricingRules.ts) - Hook chứa mutation logic
  - [page.tsx](file:///d:/tinhtienvetay/src/app/admin/pricing/page.tsx) - Admin pricing page
  - [AdminValueBasedTable.tsx](file:///d:/tinhtienvetay/src/components/admin/pricing/AdminValueBasedTable.tsx)
  - [OfficialLineTable.tsx](file:///d:/tinhtienvetay/src/components/admin/pricing/OfficialLineTable.tsx)
  - [ServiceFeeTable.tsx](file:///d:/tinhtienvetay/src/components/admin/pricing/ServiceFeeTable.tsx)

### Dựa Trên Conversation History
- Đã có lịch sử lỗi `"null value in column 'id'"` constraint violation (conv 656f, 962f)
- Vấn đề với client-side ID generation bằng `uuidv4()`
- Logic upsert có thể chưa handle đầy đủ các trường hợp:
  - New rows without IDs
  - Existing rows with IDs
  - Deleted rows

### Nghi Ngờ Root Cause
1. **Silent Failure:** Mutation fail nhưng `onError` không trigger toast
2. **ID Generation Issue:** New rows không có ID → DB reject
3. **State Management:** Local state (`normalShippingData`, etc.) không sync đúng
4. **Upsert Logic:** Conflict với constraint hoặc RLS policy

---

## 🎯 User Review Required

> [!IMPORTANT]
> **Scope Confirmation**
> Plan này sẽ tập trung vào việc debug và fix save functionality. Sau khi fix xong, sẽ verify toàn bộ flow từ load → edit → save → display. Bạn có muốn thêm bất kỳ yêu cầu nào khác không?

---

## 📋 Proposed Changes

### Component 1: Investigation Phase

#### [INSPECT] Browser DevTools
- Open browser console và Network tab
- Trigger save operation
- Kiểm tra:
  - Console errors/warnings
  - Network requests (success/fail status)
  - Request payload vs expected format
  - Response body

#### [ANALYZE] [usePricingRules.ts](file:///d:/tinhtienvetay/src/hooks/usePricingRules.ts)
- Review `saveChangesMutation` logic (lines 109-313)
- Check ID generation: `tier.hn_rule_id || uuidv4()`
- Verify error handling trong `onError`

#### [ANALYZE] [page.tsx](file:///d:/tinhtienvetay/src/app/admin/pricing/page.tsx)
- Check state initialization (lines 30-56)
- Verify `handleSave` function (lines 315-322)
- Confirm `hasChanges` is triggered correctly

---

### Component 2: Root Cause Fix

#### [MODIFY] [usePricingRules.ts](file:///d:/tinhtienvetay/src/hooks/usePricingRules.ts)

**Fix 1: Ensure ID Generation for ALL New Records**
- **Problem:** Nếu `tier.hn_rule_id` là `undefined`, cần generate UUID
- **Solution:** 
  ```typescript
  id: tier.hn_rule_id || uuidv4()
  ```
  → Đảm bảo mọi record đều có ID trước khi upsert

**Fix 2: Add Console Logging for Debugging**
- Add `console.log` statements để track:
  - Data before upsert
  - Generated IDs
  - Error details

**Fix 3: Improve Error Handling**
- Enhance `onError` callback:
  ```typescript
  onError: (error) => {
    console.error('Save failed:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    toast.error(`Lỗi: ${error.message}`);
  }
  ```

**Fix 4: Fix Deposit Percent Hardcode**
- Line 154: `deposit_percent: 80` → Should be flexible based on data
- Check if this causes constraint violation

#### [MODIFY] [page.tsx](file:///d:/tinhtienvetay/src/app/admin/pricing/page.tsx)

**Fix 1: Ensure State Updates Trigger Re-render**
- Verify `setHasChanges(true)` is called in all update handlers
- Check if `JSON.parse(JSON.stringify(...))` is creating proper deep copies

**Fix 2: Fix Save Handler**
- Current implementation catches error silently at line 320
- Should propagate error to UI:
  ```typescript
  const handleSave = async () => {
    await saveChangesMutation.mutateAsync();
    // Don't catch here - let onError handle it
  };
  ```

#### [CHECK] Component Files
- [AdminValueBasedTable.tsx](file:///d:/tinhtienvetay/src/components/admin/pricing/AdminValueBasedTable.tsx)
- [OfficialLineTable.tsx](file:///d:/tinhtienvetay/src/components/admin/pricing/OfficialLineTable.tsx)
- [ServiceFeeTable.tsx](file:///d:/tinhtienvetay/src/components/admin/pricing/ServiceFeeTable.tsx)

Verify that:
- `onDataChange` callback is triggered correctly on edits
- Data structure matches what parent expects

---

### Component 3: Database & RLS Verification

#### [VERIFY] Supabase Schema
- Check if `shipping_rate_rules` table has default for `id` column
- From [supabase-schema.sql](file:///d:/tinhtienvetay/supabase-schema.sql):
  ```sql
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
  ```
  → DB SHOULD auto-generate IDs

#### [VERIFY] RLS Policies
- Lines 97-110: Allow all write access
- Nên chuyển sang check `auth.uid()` cho production

#### [FIX] ID Generation Strategy
Có 2 options:
1. **Client-side (hiện tại):** Generate UUID trước khi insert
2. **Server-side (recommend):** Để DB tự generate

**Decision:** Keep client-side nhưng ensure EVERY new record has UUID

---

### Component 4: Enhanced Debugging

#### [NEW] Debug Utility Functions

Create helper để log data trước khi save:

```typescript
const logSaveData = (data: any, label: string) => {
  console.group(`[SAVE DEBUG] ${label}`);
  console.log('Total records:', data.length);
  console.log('Records without ID:', data.filter(r => !r.id).length);
  console.log('Data:', data);
  console.groupEnd();
};
```

#### [MODIFY] Mutation Function
Add logging at key points:
- Before each upsert
- After each upsert
- On delete operations

---

## ✅ Verification Plan

### Automated Tests

#### 1. Console Logging Verification
```bash
# Run dev server và open browser console
npm run dev
# Navigate to /admin/pricing
# Perform edits → Check console for logs
```

Expected output:
- `[SAVE DEBUG]` logs showing data structure
- No errors in console
- Network tab shows 200 OK responses

#### 2. Database Verification
```sql
-- Check if records were inserted
SELECT * FROM shipping_rate_rules 
WHERE updated_at > NOW() - INTERVAL '5 minutes';

-- Check service fees
SELECT * FROM service_fee_rules 
WHERE updated_at > NOW() - INTERVAL '5 minutes';
```

### Manual Verification

#### Scenario 1: Add New Row
1. Navigate to `/admin/pricing`
2. Tab "TMDT & Tiểu Ngạch" → "Vận Chuyển Thường"
3. Click "Thêm dòng"
4. Fill in values
5. Click "Lưu"
6. **Expected:** Toast success, data persists, no console errors

#### Scenario 2: Edit Existing Row
1. Edit price in existing row
2. Click "Lưu"
3. **Expected:** Toast success, updated value persists

#### Scenario 3: Delete Row
1. Remove a row
2. Click "Lưu"
3. **Expected:** Toast success, row deleted from DB

#### Scenario 4: Reset Changes
1. Make edits
2. Click "Hủy bỏ"
3. **Expected:** Confirm dialog, data reverts

#### Scenario 5: Full Flow Verification
1. Close browser
2. Restart dev server
3. Open `/admin/pricing`
4. **Expected:** All saved data displays correctly

### Success Criteria

✅ Save button works và shows toast notification  
✅ Changes persist to Supabase  
✅ Page reload shows correct data  
✅ No console errors  
✅ All 3 tabs (TieuNgach, TMDT, ChinhNgach) work  
✅ Add/Edit/Delete operations all function  
✅ Reset button works correctly

---

## 🔧 Implementation Order

1. **[PHASE 1]** Investigate Browser Console + Network Tab
2. **[PHASE 2]** Fix ID generation và error handling trong `usePricingRules.ts`
3. **[PHASE 3]** Fix save handler trong `page.tsx`
4. **[PHASE 4]** Add debug logging
5. **[PHASE 5]** Test all scenarios
6. **[PHASE 6]** Remove debug logs (or keep with flag)

---

## 📝 Notes

- Conversation history shows previous fixes for similar issues (conv 656f, 962f)
- Cần avoid regression - ensure previous fixes không bị break
- Consider refactoring mutation logic thành separate service file sau này
- RLS policies nên được tighten cho production

---

## ❓ Questions for User (if any during implementation)

1. Sau khi fix, có muốn refactor mutation logic ra khỏi hook không?
2. Có muốn thêm optimistic updates (UI update trước, rollback nếu fail)?
3. Có muốn add loading spinner trong table khi save?

---

**Next Steps:** Review plan này và approve để bắt đầu implementation phase.
