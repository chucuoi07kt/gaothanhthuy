import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Navbar } from '@/src/components/Navbar';
import { Footer } from '@/src/components/Footer';
import { QuoteCartModal } from '@/src/components/QuoteCartModal';
import { FloatingCartButton } from '@/src/components/FloatingCartButton';
import { BRAND } from '@/src/data/mockData';

const display = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: `${BRAND.name} - Gạo sỉ Đà Nẵng, giao hỏa tốc 1-2 giờ | ${BRAND.domain}`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    'Gạo Thanh Thuỷ - 30 năm uy tín phân phối gạo sỉ & lẻ tại Đà Nẵng. Giao hỏa tốc nội thành 1-2 giờ. Gạo ST25, Lài Miên, Hàm Châu, Khang Dân chính hãng, giá sỉ tốt nhất.',
  keywords: [
    'gạo Đà Nẵng',
    'gạo sỉ Đà Nẵng',
    'gạo Thanh Thuỷ',
    'gạo ST25',
    'gạo Lài Miên',
    'gạo quán cơm',
    'giao gạo hỏa tốc Đà Nẵng',
    'báo giá gạo sỉ',
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: `https://${BRAND.domain}`,
    siteName: BRAND.name,
    title: `${BRAND.name} - Gạo sỉ Đà Nẵng, giao hỏa tốc 1-2 giờ`,
    description:
      '30 năm uy tín phân phối gạo sỉ & lẻ tại Đà Nẵng. Giao hỏa tốc nội thành 1-2 giờ. Gạo chính hãng, giá sỉ tốt nhất.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - Gạo sỉ Đà Nẵng`,
    description: 'Giao hỏa tốc nội thành Đà Nẵng 1-2 giờ. Gạo chính hãng, giá sỉ tốt nhất.',
  },
  alternates: {
    canonical: `https://${BRAND.domain}`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'WholesaleStore'],
  '@id': `https://${BRAND.domain}#business`,
  name: BRAND.name,
  url: `https://${BRAND.domain}`,
  telephone: BRAND.hotlineRaw,
  email: BRAND.email,
  image: `https://${BRAND.domain}/og-image.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '126 Nguyễn Lương Bằng, Phường Hòa Khánh Bắc',
    addressLocality: 'Quận Liên Chiểu',
    addressRegion: 'Đà Nẵng',
    postalCode: '550000',
    addressCountry: 'VN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 16.0544,
    longitude: 108.1716,
  },
  areaServed: {
    '@type': 'City',
    name: 'Đà Nẵng',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '07:00',
      closes: '19:00',
    },
  ],
  priceRange: '$$',
  description:
    'Gạo Thanh Thuỷ - 30 năm uy tín phân phối gạo sỉ & lẻ tại Đà Nẵng. Giao hỏa tốc nội thành 1-2 giờ.',
  knowsAbout: ['Gạo sỉ', 'Gạo ST25', 'Gạo Lài Miên', 'Gạo quán cơm', 'Gạo từ thiện'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <QuoteCartModal />
        <FloatingCartButton />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '12px',
              border: '1px solid hsl(142 30% 90%)',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
