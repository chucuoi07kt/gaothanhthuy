import type { Category } from '@/src/types';

export const categories: Category[] = [
  {
    slug: 'gao-an-gia-dinh',
    label: 'Gạo ăn gia đình',
    description: 'Gạo thơm ngon, dẻo mềm, phù hợp bữa cơm gia đình mỗi ngày.',
    icon: 'home',
  },
  {
    slug: 'gao-quan-com-nha-hang',
    label: 'Gạo quán cơm - nhà hàng',
    description: 'Gạo nở xốp, lời cơm, tối ưu chi phí cho quán cơm, nhà hàng.',
    icon: 'utensils',
  },
  {
    slug: 'gao-tu-thien',
    label: 'Gạo từ thiện',
    description: 'Đóng gói 5kg - 10kg - 25kg, giá sỉ tốt nhất cho chương trình từ thiện.',
    icon: 'heart',
  },
  {
    slug: 'gao-nau-bun-mi-pho',
    label: 'Gạo nấu bún - mì - phở',
    description: 'Gạo khô chuẩn, làm bún phở dai ngon, không nát.',
    icon: 'wheat',
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  'gao-an-gia-dinh': 'Gạo ăn gia đình',
  'gao-quan-com-nha-hang': 'Gạo quán cơm - nhà hàng',
  'gao-quan-com': 'Gạo quán cơm - nhà hàng',
  'gao-tu-thien': 'Gạo từ thiện',
  'gao-nau-bun-mi-pho': 'Gạo nấu bún - mì - phở',
};

export function convertCategoryToSlug(categoryStr: string): string {
  if (!categoryStr) return 'gao-an-gia-dinh';
  const lower = categoryStr.toLowerCase().trim();
  if (lower.includes('gia đình') || lower.includes('gao-an-gia-dinh')) return 'gao-an-gia-dinh';
  if (lower.includes('quán') || lower.includes('nhà hàng') || lower.includes('gao-quan-com')) return 'gao-quan-com-nha-hang';
  if (lower.includes('từ thiện') || lower.includes('gao-tu-thien')) return 'gao-tu-thien';
  if (lower.includes('bún') || lower.includes('mì') || lower.includes('phở') || lower.includes('gao-nau-bun')) return 'gao-nau-bun-mi-pho';
  return 'gao-an-gia-dinh';
}

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] || slug || 'Gạo ăn gia đình';
}
