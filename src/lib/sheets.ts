export interface SheetProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  weight_options: string;
  image: string;
  description: string;
  dẻo: number;
  nở: number;
  mềm: number;
  thơm?: number;
}

export interface SheetBlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  summary: string;
  content: string;
  created_at: string;
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '';
const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      result.push(current); current = '';
    } else { current += char; }
  }
  result.push(current);
  return result;
}

// 🔥 HÀM PARSE CSV ĐÃ ĐƯỢC THAY THẾ THUẬT TOÁN ĐỌC DÒNG THÔNG MINH
function parseCSV(csv: string): Record<string, string>[] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  // Quét từng ký tự một để chia dòng, nếu gặp dấu xuống dòng nằm trong dấu ngoặc kép "" thì giữ nguyên
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      // Bỏ qua ký tự bổ trợ nếu là định dạng dòng của Windows (\r\n)
      if (char === '\r' && csv[i + 1] === '\n') {
        i++;
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

export async function fetchSheetData(tab: 'sp' | 'blog'): Promise<Record<string, string>[]> {
  if (!SHEET_ID) return [];
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tab}`;
  const res = await fetch(csvUrl, { cache: 'no-store' });
  if (!res.ok) return [];
  return parseCSV(await res.text());
}

function parsePrice(val: string | number): number {
  if (typeof val === 'number') return val;
  return parseInt(String(val).replace(/[^\d]/g, ''), 10) || 0;
}

export async function getProductsFromSheet(): Promise<SheetProduct[]> {
  const rows = await fetchSheetData('sp');
  return rows.map((row) => ({
    id: row.id || '',
    name: row.name || '',
    category: row.category || '',
    price: parsePrice(row.price),
    weight_options: row.weight_options || '',
    image: row.image || '',
    description: row.description || '',
    dẻo: parseInt(row['deo'] || row['dẻo'] || '0', 10) || 0,
    nở: parseInt(row['no'] || row['nở'] || '0', 10) || 0,
    mềm: parseInt(row['mem'] || row['mềm'] || '0', 10) || 0,
    thơm: parseInt(row['thom'] || row['thơm'] || '0', 10) || 0,
  }));
}

export async function getBlogFromSheet(): Promise<SheetBlogPost[]> {
  const rows = await fetchSheetData('blog');
  return rows.map((row) => ({
    id: row.id || '',
    title: row.title || '',
    slug: row.slug || '',
    thumbnail: row.thumbnail || '',
    summary: row.summary || '',
    content: row.content || '',
    created_at: row.created_at || new Date().toISOString(),
  }));
}

export async function writeToSheet(
  tab: 'sp' | 'blog',
  action: 'insert' | 'update' | 'delete',
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  if (!APPS_SCRIPT_URL) return { success: false, error: 'GOOGLE_APPS_SCRIPT_URL not configured' };
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab, action, data }),
    });
    if (!res.ok) return { success: false, error: await res.text() };
    return { success: true };
  } catch (err) { return { success: false, error: String(err) }; }
}

export function generateProductId(existing: SheetProduct[]): string {
  const maxId = existing.reduce((max, p) => {
    const num = parseInt(p.id.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return String(maxId + 1);
}

export function generateBlogId(existing: SheetBlogPost[]): string {
  const maxId = existing.reduce((max, p) => {
    const num = parseInt(p.id.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return String(maxId + 1);
}
