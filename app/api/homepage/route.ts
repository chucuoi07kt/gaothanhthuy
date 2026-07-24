import { NextResponse } from 'next/server';
import { getHomepageItemsFromSheet } from '@/src/lib/homepage.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ items: await getHomepageItemsFromSheet() });
  } catch (err) {
    return NextResponse.json({ error: String(err), items: [] }, { status: 500 });
  }
}
