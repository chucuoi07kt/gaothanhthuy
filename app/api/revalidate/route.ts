import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // Ép Next.js xóa sạch bộ nhớ đệm (cache) của trang chủ và trang danh mục
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
      message: 'Lỗi trong quá trình xóa bộ nhớ đệm hệ thống' 
    }, { status: 500 });
  }
}
