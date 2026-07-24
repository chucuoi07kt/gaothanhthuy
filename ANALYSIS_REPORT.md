# Phân tích kiến trúc — Gaothanhthuy (branch `2407anh1.3`)

Báo cáo phân tích toàn bộ module Home, Admin CMS và Google Sheets.
**KHÔNG sửa code** — chỉ liệt kê vị trí và danh sách file cần sửa.

---

## 1. Hero Slider

| Mục | Giá trị |
|---|---|
| File | `src/components/PromoSlider.tsx` |
| Được dùng tại | `app/page.tsx` (import & render `<PromoSlider />`) |
| Công nghệ | Embla Carousel + Autoplay |
| Đặc điểm | Banner **hard-code** trong mảng `banners[]` (4 slide), ảnh dùng Pexels, không đọc từ Google Sheet |

> Lưu ý: `src/components/HeroBanner.tsx` là banner giới thiệu tĩnh (không phải slider), cũng render ở `app/page.tsx` phía trên `PromoSlider`.

---

## 2. Ảnh kho bãi

| Mục | Giá trị |
|---|---|
| File | `src/components/WarehouseGallery.tsx` |
| Được dùng tại | `app/page.tsx` (render `<WarehouseGallery />`) |
| Đặc điểm | Ảnh **hard-code** trong mảng `galleryImages[]`, dùng Unsplash, không đọc từ Google Sheet |

---

## 3. Service đọc Google Sheet

| Mục | Giá trị |
|---|---|
| Service chính | `src/lib/sheets.ts` → hàm `fetchSheetData(tab)` |
| Cách hoạt động | Gọi `https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={tab}` rồi parse CSV |
| Hàm wrapper | `getProductsFromSheet()` (tab `sp`), `getBlogFromSheet()` (tab `blog`) |
| Homepage service | `src/lib/homepage.service.ts` → `getHomepageItemsFromSheet()` (tab `homepage`) |
| API route expose | `app/api/products/route.ts` (GET), `app/api/blog/route.ts` (GET), `app/api/homepage/route.ts` (GET) |
| Client fetcher | `src/lib/products.ts` → `fetchProducts()`, `fetchBlogPosts()` (gọi `/api/products`, `/api/blog`) |

**Luồng đọc:** Google Sheet → `sheets.ts` (CSV parse) → API route → `products.ts` (normalize) → UI

---

## 4. Service ghi Google Sheet

| Mục | Giá trị |
|---|---|
| Service chính | `src/lib/sheets.ts` → hàm `writeToSheet(tab, action, data)` |
| Cách hoạt động | POST JSON tới `GOOGLE_APPS_SCRIPT_URL` (Google Apps Script Web App) |
| Hành động | `insert` / `update` / `delete` |
| API route expose | `app/api/products/route.ts` (POST), `app/api/blog/route.ts` (POST) |
| Revalidate | `app/api/revalidate/route.ts` (POST → `revalidatePath`) |

**Luồng ghi:** Admin UI → POST `/api/products` hoặc `/api/blog` → `writeToSheet()` → Google Apps Script → Google Sheet

---

## 5. Admin CMS

| File | Vai trò |
|---|---|
| `app/admin/layout.tsx` | Khung admin (sidebar, mobile nav, guard đăng nhập) |
| `app/admin/page.tsx` | Redirect → `/admin/products` |
| `app/admin/login/page.tsx` | Trang đăng nhập (mật khẩu) |
| `app/admin/products/page.tsx` | CRUD sản phẩm (table + modal form) |
| `app/admin/blog/page.tsx` | CRUD bài viết (table + modal form + MarkdownEditor) |
| `app/admin/homepage/page.tsx` | Xem danh sách mục trang chủ (chỉ read-only, **chưa có edit**) |
| `src/lib/auth.tsx` | Auth context (sessionStorage + `NEXT_PUBLIC_ADMIN_PASSWORD`) |
| `src/components/admin/ImageUpload.tsx` | Widget upload ảnh (gọi Cloudinary) |
| `src/components/admin/MarkdownEditor.tsx` | Editor TipTap (blog content) |
| `src/components/admin/BlogPreview.tsx` | Preview bài viết |

---

## 6. Cloudinary Upload

| Mục | Giá trị |
|---|---|
| Service chính | `src/lib/cloudinary.ts` |
| Hàm | `uploadToCloudinary(file)`, `uploadToCloudinaryWithProgress(file, onProgress)`, `optimizeWebP(url)`, `PLACEHOLDER_IMAGE` |
| Cấu hình | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` |
| Endpoint | `https://api.cloudinary.com/v1_1/{cloud}/image/upload` (unsigned preset) |
| UI dùng | `src/components/admin/ImageUpload.tsx` (product + blog thumbnail), `src/components/admin/MarkdownEditor.tsx` (ảnh trong nội dung blog, có progress bar) |

---

## 7. Danh sách tất cả file sẽ cần sửa

Nếu yêu cầu là **làm Hero Slider, ảnh kho bãi đọc từ Google Sheet + chỉnh sửa được qua Admin CMS**, thì các file cần sửa:

### 7.1. Lấy dữ liệu động (Sheet-driven)
1. **`src/components/PromoSlider.tsx`** — chuyển từ hard-code sang nhận props/đọc dữ liệu slider từ Sheet
2. **`src/components/WarehouseGallery.tsx`** — chuyển từ hard-code sang nhận props/đọc ảnh kho bãi từ Sheet
3. **`app/page.tsx`** — truyền dữ liệu động vào `<PromoSlider />` và `<WarehouseGallery />`

### 7.2. Service / API cho slider & kho bãi
4. **`src/lib/sheets.ts`** — thêm hàm đọc tab mới (vd `slider`, `warehouse`) và hàm ghi tương ứng
5. **`src/lib/homepage.service.ts`** — (hoặc file service mới) thêm interface cho slider item & warehouse image
6. **API route mới** (vd `app/api/slider/route.ts`) — GET/POST slider
7. **API route mới** (vd `app/api/warehouse/route.ts`) — GET/POST warehouse images
8. **`app/api/revalidate/route.ts`** — thêm `revalidatePath` cho trang chủ khi sync

### 7.3. Admin CMS — thêm trang quản lý
9. **`app/admin/layout.tsx`** — thêm nav item "Slider" và "Kho bãi"
10. **`app/admin/homepage/page.tsx`** — (tuỳ chọn) nâng cấp từ read-only sang có edit, hoặc tạo trang riêng
11. **Trang admin mới** (vd `app/admin/slider/page.tsx`) — CRUD banner slider + upload ảnh qua Cloudinary
12. **Trang admin mới** (vd `app/admin/warehouse/page.tsx`) — CRUD ảnh kho bãi + upload ảnh qua Cloudinary

### 7.4. Google Sheet + Apps Script
13. **Google Sheet** — thêm tab `slider` và `warehouse` (cột: id, image, title, description, link, order, enabled)
14. **Google Apps Script** — cập nhật Web App để hỗ trợ ghi/đọc 2 tab mới

### 7.5. File liên quan khác (kiểm tra khi sửa)
15. **`src/lib/products.ts`** — nếu cần fetcher cho slider/warehouse
16. **`src/components/Sections.tsx`** (`CategoryShowcase`, `BrandStory`) — nếu cũng cần động hoá

---

## 8. Kiến trúc tổng quan

```
Google Sheet (sp | blog | homepage)
        │  đọc (CSV gviz)
        ▼
src/lib/sheets.ts ──► src/lib/products.ts (normalize)
        │                    │
        │  ghi (Apps Script) │
        │                    ▼
        │              API routes (/api/products, /api/blog, /api/homepage)
        │                    │
        ▼                    ▼
   writeToSheet        app/page.tsx + app/admin/**
```

Cloudinary cung cấp URL ảnh → lưu vào cell `image`/`thumbnail` trong Sheet → hiển thị ở frontend.

---

*Báo cáo tạo từ branch `2407anh1.3`, không thay đổi code.*
