# Phân tích module Home, Admin CMS và Google Sheets

## 1. Hero Slider (Banner trang chủ)

**File hiển thị (frontend):**
- `src/components/PromoSlider.tsx` — Component slider chính, dùng Embla Carousel, fetch dữ liệu từ `/api/homepage` lọc `section === 'hero'`.
- `src/components/HeroBanner.tsx` — Banner tĩnh (gradient + ảnh Pexels), không phải slider động.

**File quản lý (admin):**
- `app/admin/homepage/page.tsx` — Trang Admin quản lý Hero Slider (tab "Hero Slider").

**Service đọc Google Sheet:**
- `src/lib/homepage.service.ts` — `getHomepageItemsFromSheet()`, `getHeroSlidesFromSheet()`.

**Service ghi Google Sheet:**
- `src/lib/sheets.ts` — `writeToSheet('homepage', action, data)`.

**API route:**
- `app/api/homepage/route.ts` — GET (đọc) + POST (thêm/sửa/xoá).

---

## 2. Ảnh kho bãi (Warehouse Gallery)

**File hiển thị (frontend):**
- `src/components/WarehouseGallery.tsx` — Component gallery ảnh kho, fetch từ `/api/homepage` lọc `section === 'warehouse'`.

**File quản lý (admin):**
- `src/components/admin/WarehouseManager.tsx` — Component quản lý ảnh kho bãi (tab "Kho bãi" trong trang admin homepage).
- `app/admin/homepage/page.tsx` — Trang cha chứa tab Kho bãi.

**Service đọc Google Sheet:**
- `src/lib/homepage.service.ts` — `getWarehouseImagesFromSheet()`.

**Service ghi Google Sheet:**
- `src/lib/sheets.ts` — `writeToSheet('homepage', action, data)` (cùng bảng homepage, section = warehouse).

**API route:**
- `app/api/homepage/route.ts` — dùng chung cho cả hero và warehouse.

---

## 3. Service đọc Google Sheet

- `src/lib/sheets.ts` — `fetchSheetData(tab)` — đọc CSV từ Google Sheet (sp / blog / homepage).
- `src/lib/sheets.ts` — `getProductsFromSheet()`, `getBlogFromSheet()` — parse dữ liệu thô.
- `src/lib/homepage.service.ts` — `getHomepageItemsFromSheet()` — wrapper cho homepage.
- `src/lib/products.ts` — `fetchProducts()`, `fetchBlogPosts()` — fetch qua API route (client-side).

---

## 4. Service ghi Google Sheet

- `src/lib/sheets.ts` — `writeToSheet(tab, action, data)` — gửi POST tới Google Apps Script URL (`GOOGLE_APPS_SCRIPT_URL`).
- `app/api/homepage/route.ts` — POST handler cho homepage (hero + warehouse).
- `app/api/products/route.ts` — POST handler cho sản phẩm.
- `app/api/blog/route.ts` — POST handler cho bài viết.

---

## 5. Admin CMS

**Layout & Auth:**
- `app/admin/layout.tsx` — Shell admin (sidebar, mobile nav, auth guard).
- `app/admin/page.tsx` — Redirect tới `/admin/products`.
- `app/admin/login/page.tsx` — Trang đăng nhập (chưa đọc, có file).

**Trang quản lý:**
- `app/admin/homepage/page.tsx` — Quản lý Hero Slider + Kho bãi (tabs).
- `app/admin/products/page.tsx` — Quản lý sản phẩm.
- `app/admin/blog/page.tsx` — Quản lý bài viết.

**Component admin dùng chung:**
- `src/components/admin/ImageUpload.tsx` — Upload ảnh (Cloudinary).
- `src/components/admin/WarehouseManager.tsx` — Quản lý ảnh kho bãi.
- `src/components/admin/MarkdownEditor.tsx` — Editor blog (chưa đọc).
- `src/components/admin/BlogPreview.tsx` — Preview bài viết (chưa đọc).

---

## 6. Cloudinary Upload

- `src/lib/cloudinary.ts` — `uploadToCloudinary()`, `uploadToCloudinaryWithProgress()`, `optimizeWebP()`.
- `src/components/admin/ImageUpload.tsx` — Component UI dùng `uploadToCloudinary()`, hỗ trợ single/multiple.

---

## Tổng hợp tất cả file sẽ cần sửa (dự kiến)

| # | File | Vai trò |
|---|------|---------|
| 1 | `src/components/PromoSlider.tsx` | Hero Slider frontend |
| 2 | `src/components/HeroBanner.tsx` | Banner tĩnh frontend |
| 3 | `src/components/WarehouseGallery.tsx` | Ảnh kho bãi frontend |
| 4 | `app/admin/homepage/page.tsx` | Admin Hero Slider + Kho bãi |
| 5 | `app/admin/products/page.tsx` | Admin sản phẩm |
| 6 | `app/admin/blog/page.tsx` | Admin bài viết |
| 7 | `app/admin/layout.tsx` | Admin layout/auth |
| 8 | `src/components/admin/WarehouseManager.tsx` | Component quản lý kho bãi |
| 9 | `src/components/admin/ImageUpload.tsx` | Upload ảnh Cloudinary |
| 10 | `src/lib/sheets.ts` | Đọc/ghi Google Sheet |
| 11 | `src/lib/homepage.service.ts` | Service homepage (hero + warehouse) |
| 12 | `src/lib/cloudinary.ts` | Upload Cloudinary |
| 13 | `src/lib/products.ts` | Normalize sản phẩm/blog (client) |
| 14 | `app/api/homepage/route.ts` | API homepage |
| 15 | `app/api/products/route.ts` | API sản phẩm |
| 16 | `app/api/blog/route.ts` | API bài viết |

> Ghi chú: Chưa đọc `src/components/admin/MarkdownEditor.tsx`, `src/components/admin/BlogPreview.tsx`, `app/admin/login/page.tsx` — có thể cần bổ sung nếu yêu cầu sửa liên quan tới blog editor hoặc auth.
