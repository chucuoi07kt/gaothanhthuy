export type DefaultBanner = {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
};

export type DefaultWarehouseImage = {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
};

export const DEFAULT_HERO_BANNERS: DefaultBanner[] = [
  {
    id: 'family',
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Gạo ngon cho mọi gia đình',
    description: 'Gạo chính hãng dẻo thơm, sạch an toàn cho bữa cơm gia đình.',
    link: '/products',
  },
  {
    id: 'restaurant',
    image: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Giá sỉ cho quán ăn – nhà hàng',
    description: 'Chiết khấu hấp dẫn khi nhập sỉ cho quán cơm, nhà hàng tại Đà Nẵng.',
    link: '',
  },
  {
    id: 'delivery',
    image: 'https://images.pexels.com/photos/4393474/pexels-photo-4393474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Giao nhanh toàn Đà Nẵng',
    description: 'Giao hỏa tốc nội thành 1-2 giờ, không lo gián đoạn nguồn cung.',
    link: '/products',
  },
  {
    id: 'agency',
    image: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Chiết khấu cao cho đại lý',
    description: 'Hợp tác phân phối dài hạn với mức chiết khấu ưu đãi nhất.',
    link: '',
  },
];

export const DEFAULT_WAREHOUSE_IMAGES: DefaultWarehouseImage[] = [
  {
    id: 'wh1',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Kho chính 126 Nguyễn Lương Bằng',
    description: 'Kho gạo quy mô lớn tại Đà Nẵng',
    link: '',
  },
  {
    id: 'wh2',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Đóng gói sỉ - 5/10/25/50kg',
    description: 'Đóng bao gạo sỉ sẵn sàng giao',
    link: '',
  },
  {
    id: 'wh3',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Đội xe giao hỏa tốc 1-2h',
    description: 'Xe tải giao gạo hỏa tốc',
    link: '',
  },
  {
    id: 'wh4',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=compress&cs=tinysrgb&w=900&q=80',
    title: 'Năng lực 15 tấn/ngày',
    description: 'Hàng trăm bao gạo trong kho',
    link: '',
  },
];

export const WAREHOUSE_SPAN_CLASSES = ['', '', '', 'lg:col-span-2'];
