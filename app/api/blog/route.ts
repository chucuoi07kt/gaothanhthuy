import { NextRequest, NextResponse } from 'next/server';
import { getBlogFromSheet, writeToSheet, generateBlogId, type SheetBlogPost } from '@/src/lib/sheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ posts: await getBlogFromSheet() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await getBlogFromSheet();

    if (body.action === 'delete') {
      return NextResponse.json(await writeToSheet('blog', 'delete', { id: body.id }));
    }

    const id = body.id || generateBlogId(existing);
    const post: SheetBlogPost = {
      id,
      title: body.title || '',
      slug: body.slug || '',
      thumbnail: body.thumbnail || '',
      summary: body.summary || '',
      content: body.content || '',
      created_at: body.created_at || new Date().toISOString(),
    };

    const action = body.action === 'update' ? 'update' : 'insert';
    return NextResponse.json(await writeToSheet('blog', action, post as unknown as Record<string, unknown>));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
