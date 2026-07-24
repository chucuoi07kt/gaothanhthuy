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

function parseEnabled(val: string): boolean {
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
