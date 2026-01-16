# 📦 TÍNH TIỀN VỀ TAY - Documentation

## 📋 Tổng Quan Dự Án

**Tên dự án:** `tinhtienvetay`  
**Phiên bản:** 0.1.0  
**Mô tả:** Ứng dụng tính toán chi phí nhập hàng từ Trung Quốc về Việt Nam với đầy đủ các yếu tố như giá sản phẩm, tỷ giá, phí dịch vụ, phí vận chuyển quốc tế và nội địa.

---

## 🛠️ Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next.js** | 16.1.2 | Framework React với App Router |
| **React** | 19.2.3 | UI Library |
| **TypeScript** | ^5 | Type Safety |
| **Tailwind CSS** | ^4 | Styling |
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
│   │   ├── admin/              # Trang quản trị
│   │   ├── api/                # API Routes
│   │   │   ├── admin/          # Admin API endpoints
│   │   │   └── leads/          # Leads API endpoints
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Trang chủ
│   │
│   ├── components/
│   │   ├── calculator/         # Calculator Components
│   │   │   ├── Calculator.tsx      # Component chính
│   │   │   ├── InputCard.tsx       # Form nhập liệu
│   │   │   ├── ResultCard.tsx      # Hiển thị kết quả
│   │   │   └── DownloadInvoice.tsx # Tải báo giá
│   │   ├── common/             # Shared Components
│   │   └── ui/                 # UI Components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── Tooltip.tsx
│   │
│   ├── hooks/
│   │   └── useCostCalculator.ts    # Logic tính toán chi phí
│   │
│   ├── lib/
│   │   ├── constants.ts        # Hằng số (tỷ giá, phí vận chuyển)
│   │   ├── schemas.ts          # Zod validation schemas
│   │   └── utils.ts            # Utility functions
│   │
│   └── types/
│       └── index.ts            # TypeScript type definitions
│
├── data/
│   └── settings.json           # Cấu hình ứng dụng
│
├── public/                     # Static assets
└── package.json
```

---

## 🔧 Types & Interfaces

### Core Types (`src/types/index.ts`)

```typescript
// Loại kho
type Warehouse = 'HN' | 'HCM';

// Phương thức vận chuyển  
type ShippingMethod = 'TMDT' | 'TieuNgach' | 'ChinhNgach';

// Phần trăm đặt cọc
type DepositPercent = 70 | 80;

// Thông tin sản phẩm
interface Product {
  id: string;
  quantity: number;
  price_cny: number;           // Giá web (CNY)
  negotiated_price_cny?: number; // Giá deal (CNY)
  weight_kg?: number;          // Cân nặng (kg)
  name?: string;
  image_url?: string;
  link?: string;
}

// Chi tiết đơn hàng
interface OrderDetails {
  warehouse: Warehouse;
  method: ShippingMethod;
  deposit: DepositPercent;
  products: Product[];
  internal_ship_cny?: number;  // Phí ship nội địa TQ
  customerName?: string;
  customerPhone?: string;
}

// Bảng phân tích chi phí
interface CostBreakdown {
  total_product_cny: number;
  total_product_vnd: number;
  exchange_rate: number;
  service_fee_percent: number;
  service_fee_vnd: number;
  total_weight_kg: number;
  shipping_rate_vnd: number;
  int_shipping_fee_vnd: number;
  internal_ship_vnd: number;
  total_landed_cost: number;
  deposit_amount: number;
  remaining_amount: number;
  avg_price_per_unit_vnd: number;
}
```

---

## 📊 Hằng Số & Cấu Hình (`src/lib/constants.ts`)

### Tỷ Giá Quy Đổi
```typescript
const MOCK_EXCHANGE_RATE = 3960; // 1 CNY = 3,960 VND
```

### Bảng Phí Vận Chuyển Quốc Tế

| Kho | TMDT | Tiểu Ngạch | Chính Ngạch |
|-----|------|------------|-------------|
| **Hà Nội** | 28,000đ/kg | 25,000đ/kg | 22,000đ/kg |
| **HCM** | 33,000đ/kg | 30,000đ/kg | 28,000đ/kg |

### Bảng Phí Dịch Vụ

| Giá trị đơn hàng | Đặt cọc 70% | Đặt cọc 80% |
|------------------|-------------|-------------|
| 0 - 10 triệu | 5.0% | 4.5% |
| 10 - 50 triệu | 4.0% | 3.5% |
| 50 - 200 triệu | 3.0% | 2.5% |
| 200+ triệu | 2.5% | 2.0% |

---

## ⚙️ Logic Tính Toán (`src/hooks/useCostCalculator.ts`)

### Công Thức Tính Toán

```
1. Tổng Tiền Hàng (VND)
   = Σ(Giá sản phẩm × Số lượng) × Tỷ giá

2. Phí Dịch Vụ (VND)
   = Tổng Tiền Hàng × % Phí dịch vụ

3. Phí Ship Nội Địa TQ (VND)
   = Phí ship CNY × Tỷ giá

4. Phí Vận Chuyển Quốc Tế (VND)
   = Tổng cân nặng (kg) × Đơn giá/kg

5. Tổng Tiền Về Tay
   = Tổng Tiền Hàng + Phí Dịch Vụ + Phí Ship Nội Địa + Phí Vận Chuyển QT

6. Tiền Đặt Cọc
   = Tổng Tiền Hàng × % Đặt cọc (70% hoặc 80%)

7. Tiền Còn Lại
   = Tổng Tiền Về Tay - Tiền Đặt Cọc
```

---

## 🧩 Components

### 1. Calculator (`Calculator.tsx`)
Component chính điều phối toàn bộ luồng tính toán:
- Khởi tạo form với React Hook Form + Zod validation
- Theo dõi giá trị form real-time với `useWatch`
- Gọi hook `useCostCalculator` để tính toán
- Submit lead data lên API `/api/leads`
- Hiển thị toast notification với Sonner

### 2. InputCard (`InputCard.tsx`)
Form nhập liệu với các trường:
- **Kho nhận hàng:** Hà Nội / HCM
- **Phương thức:** TMDT / Tiểu Ngạch / Chính Ngạch
- **Mức đặt cọc:** 70% / 80%
- **Danh sách sản phẩm:** (có thể thêm/xóa)
  - Số lượng
  - Giá web (CNY)
  - Giá deal (CNY) - tùy chọn
  - Cân nặng (kg) - tùy chọn
- **Phí ship nội địa TQ (CNY)**
- **Thông tin khách hàng:** Họ tên, Số điện thoại

### 3. ResultCard (`ResultCard.tsx`)
Hiển thị kết quả tính toán chi tiết:
- Tổng tiền hàng (CNY/VND)
- Phí dịch vụ
- Phí vận chuyển quốc tế
- Phí ship nội địa
- **Tổng tiền về tay**
- Tiền đặt cọc / Tiền còn lại
- Giá trung bình/sản phẩm
- Animation số đẹp mắt

### 4. DownloadInvoice (`DownloadInvoice.tsx`)
Chức năng tải báo giá thành hình ảnh.

---

## 🌐 API Routes

### POST `/api/leads`
Lưu thông tin khách hàng và chi tiết báo giá.

**Payload:**
```json
{
  "warehouse": "HN",
  "method": "TMDT",
  "deposit": 70,
  "products": [...],
  "internal_ship_cny": 10,
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0912345678",
  "total_landed_cost": 1500000,
  ...breakdown,
  "submittedAt": "2026-01-16T22:51:19+07:00"
}
```

### GET `/api/admin/settings`
Lấy cấu hình hệ thống (link Zalo, link đăng ký...).

---

## 📱 Form Validation (`src/lib/schemas.ts`)

### Product Schema
```typescript
const productSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  link: z.string().optional(),
  quantity: z.number().min(1, 'Số lượng tối thiểu là 1'),
  price_cny: z.number().min(0, 'Giá tệ không được âm'),
  negotiated_price_cny: z.coerce.number().min(0).optional(),
  weight_kg: z.coerce.number().min(0).optional(),
});
```

### Calculator Schema
```typescript
const calculatorSchema = z.object({
  warehouse: z.enum(['HN', 'HCM']),
  method: z.enum(['TMDT', 'TieuNgach', 'ChinhNgach']),
  deposit: z.literal(70).or(z.literal(80)),
  products: z.array(productSchema).min(1, 'Cần ít nhất 1 sản phẩm'),
  internal_ship_cny: z.coerce.number().min(0).optional(),
  customerName: z.string().min(1, 'Vui lòng nhập họ tên'),
  customerPhone: z.string().regex(
    /^(0|84)(3|5|7|8|9)[0-9]{8}$/,
    'Số điện thoại không hợp lệ'
  ),
  bot_check: z.string().optional(), // Honeypot anti-spam
});
```

---

## 🚀 Hướng Dẫn Chạy Dự Án

### Cài đặt dependencies
```bash
npm install
```

### Chạy môi trường development
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Chạy production server
```bash
npm start
```

### Kiểm tra lint
```bash
npm run lint
```

---

## 🔒 Biến Môi Trường (`.env.local`)

Cấu hình các biến môi trường cần thiết trong file `.env.local`:

```env
# Cấu hình API (nếu có)
# NEXT_PUBLIC_API_URL=...
```

---

## 📈 Tính Năng Chính

1. ✅ **Tính toán real-time** - Kết quả cập nhật ngay khi nhập liệu
2. ✅ **Hỗ trợ nhiều sản phẩm** - Thêm/xóa sản phẩm linh hoạt
3. ✅ **Giá deal vs Giá web** - Ưu tiên giá deal nếu có
4. ✅ **Multiple shipping methods** - TMDT, Tiểu Ngạch, Chính Ngạch
5. ✅ **Responsive design** - Hoạt động tốt trên mobile
6. ✅ **Lead capture** - Lưu thông tin khách hàng
7. ✅ **Anti-spam honeypot** - Chống bot spam
8. ✅ **Export báo giá** - Tải kết quả thành hình ảnh
9. ✅ **Animation đẹp mắt** - Framer Motion
10. ✅ **Toast notifications** - Thông báo trạng thái

---

## 🧪 Cải Tiến Tương Lai

- [ ] Tích hợp database thực (Supabase/PostgreSQL)
- [ ] Admin dashboard quản lý leads
- [ ] Cập nhật tỷ giá tự động từ API
- [ ] Tích hợp Zalo OA để gửi thông báo
- [ ] Multi-language support
- [ ] PWA support

---

## 👥 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc Issue trên repository.

---

**© 2026 Tính Tiền Về Tay - Built with ❤️ using Next.js**
