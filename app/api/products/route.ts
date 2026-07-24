import { NextRequest, NextResponse } from 'next/server';
import { getProductsFromSheet, writeToSheet, generateProductId, type SheetProduct } from '@/src/lib/sheets';
import { slugifyVietnamese } from '@/lib/utils';
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

    // Xử lý làm sạch và bóc tách an toàn 4 thuộc tính đặc tính từ trang Admin gửi lên
    const cleanDeo = parseInt(String(body.deo ?? body.dẻo ?? 0), 10) || 0;
    const cleanNo = parseInt(String(body.no ?? body.nở ?? 0), 10) || 0;
    const cleanMem = parseInt(String(body.mem ?? body.mềm ?? 0), 10) || 0;
    const cleanThom = parseInt(String(body.thom ?? body.thơm ?? 0), 10) || 0;

    // Đóng gói sản phẩm tương thích tuyệt đối với định nghĩa SheetProduct (có dấu)
    // Đồng thời chèn các bản không dấu dự phòng để không sót cột nào trên Google Sheets
    const product: any = {
      id,
      name: body.name || '',
      slug: body.slug || slugifyVietnamese(body.name || '') || id,
      category: body.category || '',
      price: parseInt(String(body.price).replace(/[^\d]/g, ''), 10) || 0,
      weight_options: body.weight_options || '',
      image: body.image || '',
      description: body.description || '',
      
      // Bản tiếng Việt có dấu (Khớp định nghĩa gốc)
      dẻo: cleanDeo,
      nở: cleanNo,
      mềm: cleanMem,
      thơm: cleanThom,

      // Bản không dấu phòng hờ
      deo: cleanDeo,
      no: cleanNo,
      mem: cleanMem,
      thom: cleanThom
    };

    const action = body.action === 'update' ? 'update' : 'insert';
    return NextResponse.json(await writeToSheet('sp', action, product as unknown as Record<string, unknown>));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
