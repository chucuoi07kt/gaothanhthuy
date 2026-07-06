import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    // 1. Ép hệ thống xóa bộ nhớ đệm của trang danh mục sản phẩm và trang chủ
    revalidatePath('/', 'layout'); 
    revalidatePath('/products');
    revalidatePath('/blog');

    return NextResponse.json({ 
      success: true, 
      message: 'Đồng bộ dữ liệu từ Google Sheets thành công!' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi khi đồng bộ dữ liệu' 
    }, { status: 500 });
  }
}
