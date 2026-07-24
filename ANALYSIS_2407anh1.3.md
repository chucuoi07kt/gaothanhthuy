# Phân tích module Home, Admin CMS và Google Sheets — branch `2407anh1.3`

> Bản phân tích này được tạo tự động. KHÔNG sửa code, chỉ liệt kê vị trí các thành phần và các file dự kiến cần chỉnh sửa.

## 1. Vị trí các thành phần được yêu cầu

### 1.1 Hero Slider (Banner trang chủ)
- **Component hiển thị**: `src/components/PromoSlider.tsx`
  - Đây là slider thật (dùng `embla-carousel-react` + autoplay), lấy dữ liệu từ `/api/homepage` với `section === 'hero'`.
  - Có fallback cứng (`FALLBACK_BANNERS`) khi Google Sheet trống.
- **Component banner tĩnh phía trên**: `src/components/HeroBanner.tsx`
  - Đây là khối hero giới thiệu cứng (không phải slider), hiển thị ở đầu trang chủ.
- **Trang chủ gọi cả hai**: `app/page.tsx` → `<HeroBanner />` rồi `<PromoSlider />`.
- **Admin quản lý Hero**: `app/admin/homepage/page.tsx` (tab `hero`).
- **Service đọc**: `src/lib/homepage.service.ts` → `getHeroSlidesFromSheet()`.
- **API route**: `app/api/homepage/route.ts` (GET đọc, POST ghi/xoá).

### 1.2 Ảnh kho bãi (Warehouse Gallery)
- **Component hiển thị**: `src/components/WarehouseGallery.tsx`
  - Lấy dữ liệu từ `/api/homepage` với `section === 'warehouse'`.
  - Có fallback cứng (`FALLBACK_IMAGES` dùng Unsplash).
- **Admin quản lý kho bãi**: `src/components/admin/WarehouseManager.tsx`.
- **Service đọc**: `src/lib/homepage.service.ts` → `getWarehouseImagesFromSheet()`.
- **API route**: chung với hero tại `app/api/homepage/route.ts`.

### 1.3 Service đọc Google Sheet
- **File chính**: `src/lib/sheets.ts`
  - `fetchSheetData(tab)` — đọc CSV public qua `gviz/tq?tqx=out:csv`.
  - `getProductsFromSheet()` — map dữ liệu tab `sp` → `SheetProduct[]`.
  - `getBlogFromSheet()` — map dữ liệu tab `blog` → `SheetBlogPost[]`.
- **Service wrapper cho homepage**: `src/lib/homepage.service.ts`
  - `getHomepageItemsFromSheet()`, `getHeroSlidesFromSheet()`, `getWarehouseImagesFromSheet()`.

### 1.4 Service ghi Google Sheet
- **File chính**: `src/lib/sheets.ts` → `writeToSheet(tab, action, data)`
  - Gửi POST tới `GOOGLE_APPS_SCRIPT_URL` (Apps Script webhook) với `action` = `insert | update | delete`.
  - Hỗ trợ tự sinh `slug` cho sản phẩm.
- **API route trung gian**: `app/api/homepage/route.ts` (POST) gọi `writeToSheet('homepage', ...)`.
- **Các API route sản phẩm/blog khác** (cũng gọi `writeToSheet`): xem trong `app/api/products/`, `app/api/blog/`.

### 1.5 Admin CMS
- **Trang admin chính**: `app/admin/page.tsx`
- **Layout admin**: `app/admin/layout.tsx`
- **Quản lý trang chủ (Hero + Kho bãi)**: `app/admin/homepage/page.tsx`
- **Quản lý kho bãi (component con)**: `src/components/admin/WarehouseManager.tsx`
- **Quản lý sản phẩm**: `app/admin/products/` + `src/components/admin/ImageUpload.tsx`, `src/components/admin/MarkdownEditor.tsx`
- **Quản lý blog**: `app/admin/blog/` + `src/components/admin/BlogPreview.tsx`
- **Đăng nhập**: `app/admin/login/`
- **Đồng bộ cache**: `app/api/revalidate/route.ts`

### 1.6 Cloudinary Upload
- **Service**: `src/lib/cloudinary.ts`
  - `uploadToCloudinary(file)` — upload qua unsigned preset, trả về URL đã tối ưu WebP.
  - `uploadToCloudinaryWithProgress(file, onProgress)` — upload có tiến trình (XHR).
  - `optimizeWebP(url)`, `PLACEHOLDER_IMAGE`.
- **Component dùng chung**: `src/components/admin/ImageUpload.tsx`
  - Hỗ trợ single/multiple, kéo-thả, parse link thông minh, preview.
- **Được dùng bởi**: `app/admin/homepage/page.tsx`, `src/components/admin/WarehouseManager.tsx`, `app/admin/products/`, `app/admin/blog/`.

## 2. Sơ đồ luồng dữ liệu

```
Google Sheet (tabs: sp, blog, homepage)
   │  đọc (CSV public)
   ▼
src/lib/sheets.ts  ──►  src/lib/homepage.service.ts
   │                         │
   │  ghi (Apps Script)      │
   ▼                         ▼
app/api/homepage/route.ts ◄── app/api/products, app/api/blog
   │
   ▼
app/page.tsx
 ├── src/components/HeroBanner.tsx        (hero tĩnh)
 ├── src/components/PromoSlider.tsx       (hero slider động)
 ├── src/components/WarehouseGallery.tsx  (ảnh kho bãi động)
 └── ...

Admin CMS
 ├── app/admin/homepage/page.tsx
 │    ├── tab hero      → POST /api/homepage {section:'hero'}
 │    └── tab warehouse → src/components/admin/WarehouseManager.tsx
 ├── src/components/admin/ImageUpload.tsx → src/lib/cloudinary.ts
 └── app/api/revalidate/route.ts (đồng bộ cache sau khi ghi)
```

## 3. Danh sách tất cả file dự kiến cần sửa

> Chưa sửa gì. Danh sách này là để bàn bạc trước khi thực hiện.

### Module Home (hiển thị)
1. `app/page.tsx` — trang chủ, thứ tự/cấu trúc hero + kho bãi.
2. `src/components/HeroBanner.tsx` — hero tĩnh (nếu cần đồng bộ với slider).
3. `src/components/PromoSlider.tsx` — hero slider động (xử lý fallback, loading, lỗi).
4. `src/components/WarehouseGallery.tsx` — gallery kho bãi (xử lý fallback, loading, lỗi).
5. `src/components/Sections.tsx` — các section phụ (CategoryShowcase, BrandStory) nếu liên quan.

### Module Google Sheets (service)
6. `src/lib/sheets.ts` — đọc/ghi Google Sheet, parse CSV, map dữ liệu.
7. `src/lib/homepage.service.ts` — wrapper đọc homepage (hero + warehouse), sinh ID.
8. `src/lib/products.ts` — service đọc sản phẩm/blog (nếu cần đồng bộ logic).

### Module API routes
9. `app/api/homepage/route.ts` — GET/POST homepage (hero + warehouse).
10. `app/api/revalidate/route.ts` — đồng bộ cache sau khi ghi.
11. `app/api/products/route.ts` (nếu có) — CRUD sản phẩm.
12. `app/api/blog/route.ts` (nếu có) — CRUD blog.

### Module Admin CMS
13. `app/admin/page.tsx` — trang tổng admin.
14. `app/admin/layout.tsx` — layout admin.
15. `app/admin/homepage/page.tsx` — quản lý Hero + Kho bãi.
16. `src/components/admin/WarehouseManager.tsx` — component quản lý kho bãi.
17. `src/components/admin/ImageUpload.tsx` — component upload ảnh.
18. `src/components/admin/MarkdownEditor.tsx` — editor blog (nếu liên quan).
19. `src/components/admin/BlogPreview.tsx` — preview blog (nếu liên quan).
20. `app/admin/products/page.tsx` — quản lý sản phẩm (nếu liên quan).
21. `app/admin/blog/page.tsx` — quản lý blog (nếu liên quan).

### Module Cloudinary
22. `src/lib/cloudinary.ts` — service upload + tối ưu WebP.

### Cấu hình / môi trường
23. `.env` — biến `GOOGLE_SHEET_ID`, `GOOGLE_APPS_SCRIPT_URL`, `NEXT_PUBLIC_CLOUDINARY_*` (chỉ xem, không sửa code).
24. `next.config.js` — cấu hình image domains (Cloudinary, Pexels, Unsplash) nếu cần mở rộng.

## 4. Ghi chú
- Hero slider thật nằm ở `PromoSlider.tsx`, còn `HeroBanner.tsx` là khối giới thiệu tĩnh phía trên.
- Ảnh kho bãi và hero slider dùng chung một API (`/api/homepage`) và chung một tab Google Sheet `homepage`, phân biệt bằng trường `section`.
- Ghi vào Sheet thông qua Google Apps Script webhook (`GOOGLE_APPS_SCRIPT_URL`), không ghi trực tiếp qua API Google Sheets.
- Upload ảnh đi thẳng từ trình duyệt lên Cloudinary (unsigned preset), không qua server.

---
*Phân tích xong. Chưa sửa bất kỳ dòng code nào.*
