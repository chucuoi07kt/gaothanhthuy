# Gạo Thanh Thuỷ - Digital Catalogue & Wholesale Quote Website

Website catalogue số và hệ thống nhận báo giá sỉ cho **Gạo Thanh Thuỷ** (gaothanhthuy.vn) - 30 năm uy tín phân phối gạo tại Đà Nẵng.

## Tech Stack

- **Next.js 13** (App Router) + **TypeScript**
- **Tailwind CSS** with custom green & golden-yellow theme
- **Zustand** for quote cart state (localStorage persisted)
- **shadcn/ui** component library
- **sonner** for toast notifications
- **lucide-react** for icons

## Features

- **No-checkout quote system**: Users build a quote cart and send via Zalo deep-link
- **Zalo integration**: Auto-copies formatted quote to clipboard + redirects to Zalo
- **Desktop fallback**: Shows hotline + QR code modal when Zalo deep-links may fail
- **Visual meters**: Interactive 1-5 bar ratings for stickiness, fluffiness, softness, fragrance
- **Instant search & filter**: Search by name, filter by category and rice characteristics
- **Local SEO**: JSON-LD LocalBusiness + WholesaleStore schema for Đà Nẵng
- **Mobile-first responsive design**

## Pages

- `/` - Home (hero, search, bestsellers, brand story, warehouse gallery, blog)
- `/products` - Full product catalogue with filters
- `/products/[id]` - Product detail with weight selector, meters, Zalo actions
- `/blog` - Blog listing
- `/blog/[slug]` - Blog post detail
- `/about` - Company story, milestones, contact info

## Getting Started

```bash
npm install
npm run dev
```

## Contact

- **Hotline/Zalo**: 036 6219 885
- **Address**: 126 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng
- **Hours**: 7:00 - 19:00 (T2 - CN)
