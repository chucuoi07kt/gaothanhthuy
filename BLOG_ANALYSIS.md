# Phân tích Module Blog — Khối "Sản phẩm nổi bật"

> Chỉ đọc, không thay đổi code. Branch: `2407fix`

## 1. Component hiển thị "Sản phẩm nổi bật" trong bài Blog

- **File render bài Blog:** `app/blog/[slug]/page.tsx`
  - Tại dòng 257, trang bài viết gọi `<BlogCta />` bên trong thẻ `<article>`, ngay sau ShareButtons.
- **Component chứa khối "Sản phẩm nổi bật":** `src/components/BlogCta.tsx`
  - Tiêu đề "Sản phẩm nổi bật" nằm ở dòng 98 (`<h3>`).
  - `BlogCta` là client component, tự fetch danh sách sản phẩm (`fetchProducts()`), lọc `bestSeller`, lấy tối đa 4 sản phẩm.
  - Ngoài khối sản phẩm, `BlogCta` còn chứa: banner thương hiệu, nút gọi/Zalo, và strip liên hệ cuối bài.

## 2. Component ProductCard đang sử dụng

- **Component dùng chung:** `src/components/ProductCard.tsx` — nhận prop `{ product: Product }`.
- **Tình trạng sử dụng trong Blog: KHÔNG sử dụng.**
  - `BlogCta.tsx` **không import và không dùng** `ProductCard`.
  - Thay vào đó, `BlogCta` **tự viết inline** markup thẻ sản phẩm (dòng 115–213) — gần như trùng lặp logic với `ProductCard` (ảnh, badge "Bán chạy", origin, chọn khối lượng, giá, nút "Báo giá"/"Xem").
  - `ProductCard` hiện được dùng ở: `app/page.tsx`, `app/products/page.tsx`, `app/san-pham/[slug]/ProductDetailClient.tsx`.

### Khác biệt giữa inline card trong BlogCta và ProductCard

| Yếu tố | BlogCta (inline) | ProductCard (dùng chung) |
|---|---|---|
| Trạng thái chọn khối lượng | `Record<string,string>` cho nhiều card | `useState` riêng từng card |
| `VisualMeters` | Không có | Có (`variant="compact"`) |
| Nút "Xem" | Link tới trang sản phẩm | Mở giỏ báo giá (`setOpen(true)`) |
| Tiêu đề sản phẩm | `<h4>` cỡ nhỏ | `<h3>` cỡ thường |
| Số khối lượng hiển thị | `slice(0, 3)` | Tất cả |

## 3. Layout / Grid của khối "Sản phẩm nổi bật"

- File: `src/components/BlogCta.tsx`, dòng 110.
- Lớp grid: `grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4`
  - Mobile: 1 cột, gap 12px.
  - Tablet (≥640px): 2 cột, gap 16px.
  - Desktop (≥1024px): 4 cột, gap 16px.
- Mỗi item là một `<div>` flex-column bo góc, không dùng component `ProductCard`.
- Bên dưới grid có hàng nút "Xem tất cả sản phẩm" + "Xem danh sách báo giá" (dòng 216–232).

## 4. Danh sách file sẽ sửa (đề xuất)

| File | Lý do |
|---|---|
| `src/components/BlogCta.tsx` | Thay khối inline product card bằng component `ProductCard` dùng chung; giữ nguyên grid 1/2/4 cột và phần header "Sản phẩm nổi bật". Gỡ bỏ state `selectedWeights`/`addedIds` dư thừa. |
| `src/components/ProductCard.tsx` | Có thể cần thêm prop tùy chọn (vd. nút "Xem" dẫn tới trang sản phẩm thay vì mở giỏ, ẩn `VisualMeters`, giới hạn số khối lượng) để phù hợp ngữ cảnh Blog mà không phá các trang đang dùng. |

### Không cần sửa
- `app/blog/[slug]/page.tsx` — chỉ gọi `<BlogCta />`, không can thiệp trực tiếp.
- Các file dữ liệu/lib (`src/lib/products.ts`, `src/store/cartStore.ts`) — không liên quan.
