# Phân tích nguyên nhân PromoSlider không hiển thị gần full màn hình như Shopee

> Branch: `2407fixslide` — Chỉ phân tích module Home, KHÔNG sửa code.

## 1. Component đang render Hero Banner

- **File:** `src/components/HeroBanner.tsx`
- **Hàm:** `HeroBanner`
- **Được gọi tại:** `app/page.tsx` dòng 43: `<HeroBanner />`
- **Đặc điểm:** HeroBanner render một `<section>` với nền gradient full-width
  (không bị bọc trong `container-page` ở cấp ngoài cùng), bên trong mới dùng
  `container-page` để giới hạn nội dung text. Do đó phần nền của HeroBanner
  trải dài hết chiều ngang màn hình.

## 2. Component đang render PromoSlider

- **File:** `src/components/PromoSlider.tsx`
- **Hàm:** `PromoSlider`
- **Được gọi tại:** `app/page.tsx` dòng 47, nằm trong:
  ```tsx
  <section className="relative -mt-8 pb-4">
    <div className="container-page">
      <PromoSlider />
    </div>
  </section>
  ```

## 3. Tất cả container/wrapper bao quanh PromoSlider

Theo thứ tự từ ngoài vào trong (từ `<body>` đến PromoSlider):

| # | Phần tử | File | Lớp CSS giới hạn chiều rộng |
|---|--------|------|------------------------------|
| 1 | `<html>` | `app/layout.tsx` | không |
| 2 | `<body>` | `app/layout.tsx` | không (chỉ `font-sans antialiased`) |
| 3 | `<main className="min-h-[60vh]">` | `app/layout.tsx` | không |
| 4 | `<>` (React fragment) | `app/page.tsx` | không |
| 5 | `<section className="relative -mt-8 pb-4">` | `app/page.tsx` | KHÔNG — nhưng là section thường |
| 6 | `<div className="container-page">` | `app/page.tsx` | **CÓ** — đây là thủ phạm chính |
| 7 | `<div className="relative overflow-hidden rounded-2xl ...">` | `PromoSlider.tsx` | không (chỉ bo góc + border) |
| 8 | `<div ref={emblaRef} className="overflow-hidden">` | `PromoSlider.tsx` | không |
| 9 | `<div className="flex touch-pan-y ...">` | `PromoSlider.tsx` | không (carousel track) |
| 10 | `<div className="relative min-w-0 flex-[0_0_100%]">` | `PromoSlider.tsx` | mỗi slide = 100% chiều ngang cha |

## 4. Có component/layout nào đang giới hạn chiều rộng PromoSlider không?

**CÓ.** Có đúng một lớp giới hạn chiều rộng:

### `container-page` (định nghĩa trong `app/globals.css` dòng 51-53)

```css
.container-page {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}
```

Phân tích:
- `max-w-7xl` → Tailwind `max-width: 80rem` = **1280px**.
- `mx-auto` → căn giữa, nên trên màn hình > 1280px hai bên lề sẽ trống.
- `px-4 sm:px-6 lg:px-8` → thêm padding ngang (16px / 24px / 32px mỗi bên),
  làm vùng nội dung thực tế còn hẹp hơn 1280px.

### Cấu hình Tailwind (`tailwind.config.ts` dòng 12-18)

```ts
container: {
  center: true,
  padding: '1rem',
  screens: { '2xl': '1280px' },
},
```

Lớp `container` mặc định của Tailwind cũng cap ở 1280px, nhưng code dùng
`container-page` tự định nghĩa chứ không dùng `container`, nên giá trị
giới hạn thực tế là `max-w-7xl` = 1280px từ `container-page`.

### Navbar cũng dùng `container-page`

`src/components/Navbar.tsx` dòng 78: `<div className="container-page ...">`
→ Navbar cũng bị giới hạn 1280px, nên ngay cả khi PromoSlider mở rộng
thì header vẫn hẹp, trông lệch.

## 5. Danh sách đầy đủ các file liên quan

1. `app/page.tsx` — nơi render `<HeroBanner />` và `<PromoSlider />`, bọc
   PromoSlider trong `container-page`.
2. `src/components/PromoSlider.tsx` — bản thân slider, mỗi slide
   `flex-[0_0_100%]` = 100% chiều ngang cha (tức bị chặn bởi `container-page`).
3. `src/components/HeroBanner.tsx` — để đối chiếu: HeroBanner nền full-width,
   chỉ nội dung bị giới hạn bởi `container-page` ở trong.
4. `app/layout.tsx` — `<main>` không giới hạn chiều rộng, nên không phải
   thủ phạm; nhưng là wrapper chung cần biết.
5. `app/globals.css` — định nghĩa `.container-page` với `max-w-7xl` (1280px).
6. `tailwind.config.ts` — cấu hình `container.screens.2xl = 1280px`, xác nhận
   mốc 1280px là quy ước của dự án.
7. `src/components/Navbar.tsx` — cũng dùng `container-page`, cho thấy toàn
   site thống nhất giới hạn 1280px.

## 6. Nguyên nhân chính PromoSlider không full màn hình như Shopee

Shopee để banner slider trải gần hết chiều ngang viewport (chừa lề rất nhỏ
hoặc không chừa), trong khi ở site này:

1. **`container-page` bọc trực tiếp PromoSlider** (`app/page.tsx` dòng 46)
   áp dụng `max-w-7xl` = 1280px + `mx-auto` → trên màn hình lớn hơn 1280px
   slider bị ép hẹp và căn giữa, hai bên lề trắng.

2. **Padding ngang cộng thêm** `px-4 sm:px-6 lg:px-8` (16–32px mỗi bên) làm
   chiều rộng thực tế của slider nhỏ hơn cả 1280px.

3. **`-mt-8`** ở section bao quanh chỉ kéo slider lên đè HeroBanner, không
   làm rộng thêm — đây là hiệu ứng thị giác, không liên quan chiều rộng.

4. **Bên trong PromoSlider**, mỗi slide dùng `flex-[0_0_100%]` → đúng bằng
   chiều rộng của carousel, mà carousel bị giới hạn bởi `container-page`,
   nên slide cũng chỉ rộng tối đa ~1280px (trừ padding).

5. **HeroBanner trông "full" hơn** vì nền gradient đặt ở `<section>` ngoài
   cùng (không bị `container-page`), còn PromoSlider bị bọc trong
   `container-page` ngay từ section cha → khác biệt trực quan rõ rệt.

### Tóm lại nguyên nhân cốt lõi

> PromoSlider bị bọc trực tiếp bởi `<div className="container-page">` trong
> `app/page.tsx`, và `container-page` giới hạn `max-width: 1280px` + căn giữa
> + padding ngang. Do đó trên mọi màn hình rộng hơn ~1280px, slider chỉ chiếm
> một dải hẹp giữa trang, không trải gần full viewport như Shopee. HeroBanner
> thì ngược lại — nền full-width, nên trông "full màn hình" hơn.

## 7. Gợi ý hướng khắc phục (chỉ tham khảo — chưa sửa)

Để PromoSlider gần full màn hình như Shopee, cần **tháo `container-page`
ra khỏi section bao quanh PromoSlider** (hoặc thay bằng một wrapper
full-width và chỉ giới hạn padding nhỏ `px-2 sm:px-4`), đồng thời cân nhắc
mở rộng hoặc bỏ `max-w-7xl` cho riêng section này. Navbar nếu muốn khớp
cũng cần điều chỉnh tương ứng để không lệch.
