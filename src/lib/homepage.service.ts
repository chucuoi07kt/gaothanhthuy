import { fetchSheetData } from './sheets';

export interface HomepageItem {
  id: string;
  section: string;
  order: number;
  title: string;
  description: string;
  image: string;
  link: string;
  enabled: boolean;
}

export function parseEnabled(val: string): boolean {
  const v = String(val || '').toLowerCase().trim();
  return v === 'true' || v === '1' || v === 'yes';
}

export async function getHomepageItemsFromSheet(): Promise<HomepageItem[]> {
  const rows = await fetchSheetData('homepage');
  return rows.map((row) => ({
    id: row.id || '',
    section: row.section || '',
    order: parseInt(row.order || '0', 10) || 0,
    title: row.title || '',
    description: row.description || '',
    image: row.image || '',
    link: row.link || '',
    enabled: parseEnabled(row.enabled),
  }));
}

export async function getHeroSlidesFromSheet(): Promise<HomepageItem[]> {
  const items = await getHomepageItemsFromSheet();
  return items
    .filter((item) => item.section === 'hero')
    .sort((a, b) => a.order - b.order);
}

export async function getWarehouseImagesFromSheet(): Promise<HomepageItem[]> {
  const items = await getHomepageItemsFromSheet();
  return items
    .filter((item) => item.section === 'warehouse')
    .sort((a, b) => a.order - b.order);
}

export function generateHomepageId(existing: HomepageItem[]): string {
  const maxId = existing.reduce((max, item) => {
    const num = parseInt(item.id.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return String(maxId + 1);
}
