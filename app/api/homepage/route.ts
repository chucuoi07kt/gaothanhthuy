import { NextRequest, NextResponse } from 'next/server';
import { getHomepageItemsFromSheet, parseEnabled, generateHomepageId, type HomepageItem } from '@/src/lib/homepage.service';
import { writeToSheet, fetchSheetData } from '@/src/lib/sheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ items: await getHomepageItemsFromSheet() });
  } catch (err) {
    return NextResponse.json({ error: String(err), items: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows = await fetchSheetData('homepage');
    const existing: HomepageItem[] = rows.map((row) => ({
      id: row.id || '',
      section: row.section || '',
      order: parseInt(row.order || '0', 10) || 0,
      title: row.title || '',
      description: row.description || '',
      image: row.image || '',
      link: row.link || '',
      enabled: parseEnabled(row.enabled),
    }));

    if (body.action === 'delete') {
      return NextResponse.json(
        await writeToSheet('homepage', 'delete', { id: body.id })
      );
    }

    const id = body.id || generateHomepageId(existing);
    const item: Record<string, unknown> = {
      id,
      section: 'hero',
      order: parseInt(String(body.order ?? 0), 10) || 0,
      title: body.title || '',
      description: body.description || '',
      image: body.image || '',
      link: body.link || '',
      enabled: body.enabled === true || body.enabled === 'true' ? 'TRUE' : 'FALSE',
    };

    const action = body.action === 'update' ? 'update' : 'insert';
    return NextResponse.json(
      await writeToSheet('homepage', action, item)
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
