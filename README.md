# Gạo Ngọc Anh - Digital Catalogue & CMS Admin

Website catalogue số, hệ thống nhận báo giá sỉ qua Zalo, và CMS Admin Dashboard cho **Gạo Ngọc Anh** (gaothanhthuy.vn) - 30 năm uy tín phân phối gạo tại Đà Nẵng.

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** with custom green & golden-yellow theme
- **Zustand** for quote cart state (localStorage persisted)
- **shadcn/ui** component library + **lucide-react** icons
- **TipTap** rich text editor for blog CMS
- **Cloudinary** for image upload + automatic WebP optimization
- **Google Sheets** as database (via Google Apps Script webhook)

## Features

### Customer-facing
- No-checkout quote system: build a quote cart and send via Zalo deep-link
- Zalo integration: auto-copies formatted quote to clipboard + redirects to Zalo
- Visual meters: interactive 1-5 bar ratings for rice characteristics
- Instant search & filter by category and rice characteristics
- Local SEO: JSON-LD LocalBusiness + WholesaleStore schema for Đà Nẵng
- Mobile-first responsive design

### CMS Admin Dashboard (`/admin`)
- Password-protected login (`/admin/login`)
- Sidebar layout with Product Management and Blog Management
- Product Management: table list, search, category filter, pagination (10/page), add/edit modal
- Blog Management: table list, CRUD, TipTap rich text editor (bold, italic, lists)
- Optimistic UI: instant client state updates + sonner toast notifications
- Cloudinary drag & drop image upload with automatic WebP optimization
- Google Sheets sync via Google Apps Script webhook

## Getting Started

### 1. Install dependencies

```bash
npm install
npm run dev
```

### 2. Configure `.env.local`

Create a `.env.local` file in the project root:

```env
# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Sheets
GOOGLE_SHEET_ID=1HAV_ZxUFM9Au1EXM3JfH3riqt3LJQLMEj4qCZFIo0m0
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=zvgdprbd
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=gaothanhthuy

# Admin
ADMIN_PASSWORD=thanhthuy2026
NEXT_PUBLIC_ADMIN_PASSWORD=thanhthuy2026
```

### 3. Google Sheets Setup

The Google Sheet has 2 tabs:

**Tab `sp` (Products)** — columns: `id`, `name`, `category`, `price`, `weight_options`, `image`, `description`, `dẻo`, `nở`, `mềm`

**Tab `blog` (News)** — columns: `id`, `title`, `slug`, `thumbnail`, `summary`, `content`, `created_at`

> **Column mapping rule**: The CMS dynamically reads the header row (first row) to map column names to indices. Do not change the header names.

### 4. Google Apps Script Webhook Setup

To enable write operations (insert/update/delete) from the CMS to Google Sheets:

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Paste the following code:

```javascript
/**
 * Google Apps Script Webhook for Gạo Ngọc Anh CMS
 * Handles POST requests from Next.js API routes
 */

const SHEET_ID = '1HAV_ZxUFM9Au1EXM3JfH3riqt3LJQLMEj4qCZFIo0m0';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const tab = body.tab;       // 'sp' or 'blog'
    const action = body.action;  // 'insert', 'update', 'delete'
    const data = body.data;

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(tab);
    if (!sheet) {
      return jsonOutput({ success: false, error: 'Tab not found: ' + tab });
    }

    // Read header row to find column indices dynamically
    const lastCol = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const colMap = {};
    headers.forEach((h, i) => {
      colMap[String(h).trim()] = i + 1; // 1-based column index
    });

    if (action === 'delete') {
      const id = data.id;
      const idCol = colMap['id'];
      const dataRange = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
      for (let i = 0; i < dataRange.length; i++) {
        if (String(dataRange[i][0]) === String(id)) {
          sheet.deleteRow(i + 2);
          break;
        }
      }
      return jsonOutput({ success: true });
    }

    if (action === 'insert') {
      const newRow = [];
      for (let c = 1; c <= lastCol; c++) {
        const header = String(headers[c - 1]).trim();
        newRow.push(data[header] !== undefined ? data[header] : '');
      }
      sheet.appendRow(newRow);
      return jsonOutput({ success: true });
    }

    if (action === 'update') {
      const id = data.id;
      const idCol = colMap['id'];
      const dataRange = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
      for (let i = 0; i < dataRange.length; i++) {
        if (String(dataRange[i][0]) === String(id)) {
          const rowNum = i + 2;
          for (const [key, value] of Object.entries(data)) {
            if (colMap[key] !== undefined && key !== 'id') {
              sheet.getRange(rowNum, colMap[key]).setValue(value);
            }
          }
          break;
        }
      }
      return jsonOutput({ success: true });
    }

    return jsonOutput({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonOutput({ success: false, error: String(err) });
  }
}

function doGet() {
  return jsonOutput({ success: true, message: 'Gạo Ngọc Anh CMS Webhook is running' });
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy > New deployment**
5. Select type: **Web app**
6. Set **Execute as**: Me
7. Set **Who has access**: Anyone
8. Click **Deploy** and copy the Web App URL
9. Paste it into `.env.local` as `GOOGLE_APPS_SCRIPT_URL`

### 5. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Note your **Cloud Name** (already set as `zvgdprbd`)
3. Go to **Settings > Upload > Upload presets**
4. Create an **unsigned** upload preset named `gaothanhthuy`
5. The CMS automatically injects `/f_webp,q_auto/` into Cloudinary URLs for WebP optimization

### 6. Admin Access

- Navigate to `/admin/login`
- Enter the password (default: `thanhthuy2026`)
- Change `ADMIN_PASSWORD` and `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local` for production

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home (hero, search, bestsellers, brand story, warehouse gallery, blog) |
| `/products` | Full product catalogue with filters |
| `/products/[id]` | Product detail with weight selector, meters, Zalo actions |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post detail |
| `/about` | Company story, milestones, contact info |
| `/admin/login` | CMS admin login |
| `/admin/products` | Product management (CRUD, search, filter, pagination) |
| `/admin/blog` | Blog management (CRUD, TipTap rich text editor) |

## Deployment to GitHub & Vercel

```bash
# Initialize git (if not already)
git init
git remote add origin https://github.com/chucuoi07kt/gaothanhthuy.git

# Stage and commit
git add .
git commit -m "feat: complete CMS backend, Google Sheets & Cloudinary integration"

# Push to GitHub (triggers Vercel auto-deploy)
git branch -M main
git push -u origin main
```

In Vercel, add the same environment variables from `.env.local` in **Project Settings > Environment Variables**.

## Contact

- **Hotline/Zalo**: 036 6219 885
- **Address**: 126 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng
- **Hours**: 7:00 - 19:00 (T2 - CN)
