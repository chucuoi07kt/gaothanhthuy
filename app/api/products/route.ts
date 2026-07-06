import { NextRequest, NextResponse } from 'next/server';
import { getProductsFromSheet, writeToSheet, generateProductId, type SheetProduct } from '@/src/lib/sheets';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const productsData = await getProductsFromSheet();
    
    // Đảm bảo trả về mảng sản phẩm chuẩn hóa
    const productList = Array.isArray(productsData) ? productsData : [];

    // Trả về đồng thời tất cả các định dạng cấu trúc mà trang Admin và trang Khách đang tìm kiếm
    return NextResponse.json({ 
      success: true, 
      products: productList, // Đáp ứng trang Admin (data.products)
      sp: productList,       // Đáp ứng trang Sản phẩm khách (data.sp nếu có)
      data: productList      // Dự phòng trường hợp khác
    });
  } catch (err) {
    return NextResponse.json({ error: String(err), products: [], sp: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await getProductsFromSheet();

    if (body.action === 'delete') {
      return NextResponse.json(await writeToSheet('sp', 'delete', { id: body.id }));
    }

    const id = body.id || generateProductId(existing);
    const product: SheetProduct = {
      id,
      name: body.name || '',
      category: body.category || '',
      price: parseInt(String(body.price).replace(/[^\d]/g, ''), 10) || 0,
      weight_options: body.weight_options || '',
      image: body.image || '',
      description: body.description || '',
      dẻo: body.deo || 0,
      nở: body.no || 0,
      mềm: body.mem || 0,
    };

    const action = body.action === 'update' ? 'update' : 'insert';
    return NextResponse.json(await writeToSheet('sp', action, product as unknown as Record<string, unknown>));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
