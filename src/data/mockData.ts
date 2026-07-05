import type { BlogPost, Category, Product } from '@/src/types';

export const BRAND = {
  name: 'Gạo Thanh Thuỷ',
  shortName: 'Thanh Thuỷ',
  domain: 'gaothanhthuy.vn',
  yearsExperience: 30,
  dailyTons: 15,
  hotline: '036 6219 885',
  hotlineRaw: '0366219885',
  zalo: '0366219885',
  zaloUrl: 'https://zalo.me/0366219885',
  address: '126 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc, Quận Liên Chiểu, TP. Đà Nẵng',
  city: 'Đà Nẵng',
  usp: 'Giao hỏa tốc nội thành Đà Nẵng (Nhận trong 1-2 tiếng)',
  email: 'lienhe@gaothanhthuy.vn',
  hours: '7:00 - 19:00 (T2 - CN)',
  partners: ['Sun Group', 'Grand Tourane Resort', 'FPT City Đà Nẵng', 'Vinpearl'],
};

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

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'gao-st25-lua-tom',
    name: 'Gạo ST25 Lúa Tôm',
    shortDescription: 'Thơm nhẹ, dẻo nhiều - gạo đặc sản miền Tây',
    longDescription:
      'Gạo ST25 Lúa Tôm là giống lúa đặc sản được trồng theo mô hình lúa - tôm tại Sóc Trăng. Hạt gạo thon dài, trắng trong, khi nấu cho cơm dẻo nhiều, thơm nhẹ đặc trưng và giữ được độ dẻo ngay cả khi nguội. Phù hợp cho bữa cơm gia đình và làm quà biếu cao cấp.',
    category: 'gao-an-gia-dinh',
    categoryLabel: 'Gạo ăn gia đình',
    origin: 'Sóc Trăng',
    pricePerKg: 28000,
    weights: ['5kg', '10kg', '25kg', '50kg'],
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900',
    gallery: [
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    metrics: { stickiness: 5, fluffiness: 3, softness: 4, fragrance: 4 },
    bestSeller: true,
    tags: ['Thơm nhẹ', 'Dẻo nhiều', 'Đặc sản', 'Lúa tôm'],
    usage: ['Cơm gia đình', 'Cơm hộp', 'Quà biếu'],
  },
  {
    id: 'p2',
    slug: 'gao-lai-mien-campuchia',
    name: 'Gạo Lài Miên Campuchia',
    shortDescription: 'Dẻo vừa, thơm hoa lài - cơm ngon để lâu',
    longDescription:
      'Gạo Lài Miên Campuchia (Jasmine) nhập khẩu chính ngạch từ Campuchia. Hạt gạo dài, trong, dẻo vừa phải, thơm mùi hoa lài nhẹ nhàng. Cơm nguội không bị cứng, rất phù hợp cho gia đình và quán cơm cần cơm ngon để lâu.',
    category: 'gao-an-gia-dinh',
    categoryLabel: 'Gạo ăn gia đình',
    origin: 'Campuchia',
    pricePerKg: 22000,
    weights: ['5kg', '10kg', '25kg', '50kg'],
    image:
      'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 3, fluffiness: 4, softness: 4, fragrance: 5 },
    bestSeller: true,
    tags: ['Thơm hoa lài', 'Dẻo vừa', 'Nhập khẩu'],
    usage: ['Cơm gia đình', 'Cơm chiên', 'Cơm thố'],
  },
  {
    id: 'p3',
    slug: 'gao-ham-chau',
    name: 'Gạo Hàm Châu',
    shortDescription: 'Nở xốp, lời cơm - tối ưu chi phí quán cơm',
    longDescription:
      'Gạo Hàm Châu là dòng gạo nở xốp, lời cơm cao, chuyên dùng cho các quán cơm, nhà hàng, bếp công nghiệp. Hạt gạo trắng, cơm nở đều, tơi xốp, giữ được độ ẩm tốt, giúp tối ưu chi phí mà vẫn đảm bảo chất lượng cơm.',
    category: 'gao-quan-com-nha-hang',
    categoryLabel: 'Gạo quán cơm - nhà hàng',
    origin: 'Việt Nam',
    pricePerKg: 16500,
    weights: ['25kg', '50kg'],
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 2, fluffiness: 5, softness: 3, fragrance: 2 },
    bestSeller: true,
    tags: ['Nở xốp', 'Lời cơm', 'Giá sỉ'],
    usage: ['Quán cơm', 'Nhà hàng', 'Bếp công nghiệp'],
  },
  {
    id: 'p4',
    slug: 'gao-sa-mo',
    name: 'Gạo Sa Mơ',
    shortDescription: 'Xốp mềm, chuyên cơm chiên - cơm thố',
    longDescription:
      'Gạo Sa Mơ có hạt dài, cơm nở xốp, mềm, rời rạc, là lựa chọn hàng đầu cho các quán cơm chiên, cơm thố, cơm trộn. Cơm nguội vẫn giữ độ tơi, không bị nhão, dễ chế biến nhiều món.',
    category: 'gao-quan-com-nha-hang',
    categoryLabel: 'Gạo quán cơm - nhà hàng',
    origin: 'Việt Nam',
    pricePerKg: 18500,
    weights: ['10kg', '25kg', '50kg'],
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 3, fluffiness: 4, softness: 5, fragrance: 3 },
    bestSeller: true,
    tags: ['Xốp mềm', 'Cơm chiên', 'Cơm thố'],
    usage: ['Cơm chiên', 'Cơm thố', 'Cơm trộn'],
  },
  {
    id: 'p5',
    slug: 'gao-tu-thien-trang-thom',
    name: 'Gạo Từ Thiện Trắng Thơm',
    shortDescription: 'Đóng gói 5kg - 10kg - 25kg, giá sỉ tốt nhất',
    longDescription:
      'Gạo Từ Thiện Trắng Thơm được đóng gói theo quy cách 5kg, 10kg, 25kg với giá sỉ tốt nhất, dành cho các chương trình từ thiện, quỹ tặng gạo, hội chữ thập đỏ, các tổ chức phật giáo và doanh nghiệp làm CSR. Gạo trắng, thơm nhẹ, cơm mềm, đạt tiêu chuẩn an toàn vệ sinh thực phẩm.',
    category: 'gao-tu-thien',
    categoryLabel: 'Gạo từ thiện',
    origin: 'Việt Nam',
    pricePerKg: 14500,
    weights: ['5kg', '10kg', '25kg'],
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 3, fluffiness: 4, softness: 4, fragrance: 3 },
    tags: ['Giá sỉ', 'Từ thiện', 'Đóng gói sẵn'],
    usage: ['Quỹ tặng gạo', 'Chương trình CSR', 'Hội chữ thập đỏ'],
  },
  {
    id: 'p6',
    slug: 'gao-khang-dan',
    name: 'Gạo Khang Dân',
    shortDescription: 'Khô chuẩn, làm bún phở dai ngon, không nát',
    longDescription:
      'Gạo Khang Dân là dòng gạo khô chuẩn, hàm lượng amylose cao, chuyên dùng để làm bún, mì, phở, hủ tiếu. Sản phẩm cho sợi bún phở dai giòn, trong, không nát khi luộc, giữ được độ dai sau nhiều giờ. Phù hợp cho cơ sở sản xuất bún phở và nhà hàng.',
    category: 'gao-nau-bun-mi-pho',
    categoryLabel: 'Gạo nấu bún - mì - phở',
    origin: 'Việt Nam',
    pricePerKg: 15500,
    weights: ['25kg', '50kg'],
    image:
      'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 5, fluffiness: 2, softness: 2, fragrance: 2 },
    tags: ['Khô chuẩn', 'Bún phở', 'Dai ngon'],
    usage: ['Bún', 'Phở', 'Mì', 'Hủ tiếu'],
  },
  {
    id: 'p7',
    slug: 'gao-nep-thai-lai',
    name: 'Gạo Nếp Thái Lài',
    shortDescription: 'Dẻo thơm, chuyên làm xôi, bánh chưng, bánh tét',
    longDescription:
      'Gạo Nếp Thái Lài hạt tròn đều, dẻo thơm, là lựa chọn lý tưởng để làm xôi, bánh chưng, bánh tét, bánh đúc, xôi ngũ sắc. Nếp nấu chín dẻo quẹo, thơm nhẹ, hạt trong, không bị nát.',
    category: 'gao-an-gia-dinh',
    categoryLabel: 'Gạo ăn gia đình',
    origin: 'Thái Lan',
    pricePerKg: 24000,
    weights: ['5kg', '10kg', '25kg'],
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 5, fluffiness: 1, softness: 5, fragrance: 4 },
    tags: ['Nếp', 'Xôi', 'Bánh chưng'],
    usage: ['Xôi', 'Bánh chưng', 'Bánh tét'],
  },
  {
    id: 'p8',
    slug: 'gao-thom-lai-viet-nam',
    name: 'Gạo Thơm Lài Việt Nam',
    shortDescription: 'Thơm vừa, dẻo mềm, giá hợp lý cho gia đình',
    longDescription:
      'Gạo Thơm Lài Việt Nam là dòng gạo thơm trong nước, cân bằng giữa chất lượng và giá thành. Hạt gạo dài, cơm dẻo mềm, thơm nhẹ, phù hợp cho gia đình dùng hàng ngày với ngân sách hợp lý.',
    category: 'gao-an-gia-dinh',
    categoryLabel: 'Gạo ăn gia đình',
    origin: 'Việt Nam',
    pricePerKg: 19500,
    weights: ['5kg', '10kg', '25kg', '50kg'],
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900',
    metrics: { stickiness: 4, fluffiness: 3, softness: 4, fragrance: 4 },
    tags: ['Thơm vừa', 'Dẻo mềm', 'Giá hợp lý'],
    usage: ['Cơm gia đình', 'Cơm hộp'],
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'bieu-gia-gao-thang-7-2026',
    title: 'Bảng giá gạo sỉ cập nhật tháng 7/2026 tại Đà Nẵng',
    excerpt:
      'Cập nhật bảng giá gạo sỉ các loại ST25, Lài Miên, Hàm Châu, Khang Dân mới nhất. Tìm hiểu xu hướng biến động giá và cách tối ưu chi phí nhập hàng cho quán cơm, nhà hàng.',
    content:
      'Thị trường gạo Đà Nẵng trong tháng 7/2026 tiếp tục ổn định với một số điều chỉnh nhẹ. Gạo ST25 Lúa Tôm duy trì ở mức 28.000đ/kg, Lài Miên Campuchia 22.000đ/kg, Hàm Châu 16.500đ/kg. Đối với quán cơm, nhà hàng, khuyến nghị chọn gạo nở xốp như Hàm Châu hoặc Sa Mơ để tối ưu lời cơm. Gạo Thanh Thuỷ cam kết giá sỉ tốt nhất khu vực Liên Chiểu và giao hỏa tốc nội thành 1-2 tiếng.',
    category: 'Thị trường',
    author: 'Gạo Thanh Thuỷ',
    publishedAt: '2026-07-02',
    readingMinutes: 4,
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'b2',
    slug: 'chon-gao-cho-quan-com-nha-hang',
    title: 'Cách chọn gạo cho quán cơm, nhà hàng tối ưu lời cơm',
    excerpt:
      'Quán cơm cần gạo nở xốp, lời cơm; nhà hàng cao cấp cần gạo thơm dẻo. Bài viết hướng dẫn cách chọn gạo phù hợp theo mô hình kinh doanh.',
    content:
      'Khi chọn gạo cho quán cơm bình dân, ưu tiên độ nở (lời cơm) - Hàm Châu và Sa Mơ là hai lựa chọn hàng đầu. Đối với nhà hàng cao cấp, gạo ST25 hoặc Lài Miên mang lại trải nghiệm cơm thơm dẻo cho thực khách. Cần lưu ý độ dẻo, độ nở, độ mềm và độ thơm để chọn đúng loại. Gạo Thanh Thuỷ tư vấn miễn phí theo mô hình kinh doanh của bạn.',
    category: 'Hướng dẫn',
    author: 'Gạo Thanh Thuỷ',
    publishedAt: '2026-06-25',
    readingMinutes: 6,
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'b3',
    slug: 'phan-biet-gao-st25-va-st24',
    title: 'Phân biệt gạo ST25 và ST24 - loại nào thơm hơn?',
    excerpt:
      'ST25 và ST24 đều là gạo đặc sản Sóc Trăng nhưng có khác biệt về độ dẻo, độ thơm và cách chế biến. Tìm hiểu chi tiết để chọn đúng loại.',
    content:
      'ST25 (Lúa Tôm) thơm nhẹ, dẻo nhiều, hạt thon dài, thích hợp cơm gia đình và quà biếu. ST24 thơm đậm, dẻo vừa, hạt tròn đều hơn. Cả hai đều đạt giải gạo ngon nhất thế giới. Tùy khẩu vị mà chọn: thích dẻo chọn ST25, thích thơm đậm chọn ST24. Gạo Thanh Thuỷ phân phối cả hai dòng chính hãng.',
    category: 'Hướng dẫn',
    author: 'Gạo Thanh Thuỷ',
    publishedAt: '2026-06-18',
    readingMinutes: 5,
    image:
      'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 'b4',
    slug: 'bao-quan-gao-dung-cach-khong-bi-moi',
    title: 'Bảo quản gạo đúng cách không bị mọt, ẩm mốc',
    excerpt:
      'Mùa mưa Đà Nẵng độ ẩm cao, gạo dễ bị mọt và ẩm mốc. Bài viết hướng dẫn cách bảo quản gạo sỉ số lượng lớn đúng chuẩn kho bãi.',
    content:
      'Để bảo quản gạo không bị mọt và ẩm mốc: (1) Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp. (2) Dùng thùng nhựa có nắp kín, không để bao trực tiếp lên nền. (3) Có thể cho vài lát ớt khô hoặc tỏi vào thùng để xua đuổi mọt. (4) Kiểm tra định kỳ, dùng hết trong vòng 2-3 tháng. Gạo Thanh Thuỷ lưu kho theo tiêu chuẩn, đảm bảo giao gạo sạch, không mọt.',
    category: 'Hướng dẫn',
    author: 'Gạo Thanh Thuỷ',
    publishedAt: '2026-06-10',
    readingMinutes: 3,
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((b) => b.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}
