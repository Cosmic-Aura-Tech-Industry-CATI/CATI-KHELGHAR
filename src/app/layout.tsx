import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cati47.tech'),
  title: {
    default: 'CATI KHELGHAR | Offline Family & Friends Games by DIMISI',
    template: '%s | CATI KHELGHAR',
  },
  description:
    'Play Tic Tac Toe, Ludo, Snake & Ladders, Four in a Row, Dots & Boxes, and Carrom offline with family and friends on one screen. Engineered by Shikhar Dixit at DIMISI Technologies.',
  applicationName: 'CATI KHELGHAR',
  authors: [{ name: 'Shikhar Dixit', url: 'https://cati47.tech/team/shikhar-dixit' }],
  creator: 'Shikhar Dixit',
  publisher: 'DIMISI Technologies Pvt Ltd',
  keywords: [
    'CATI KHELGHAR',
    'Shikhar Dixit',
    'Shikhar Dixit DIMISI',
    'DIMISI Technologies',
    'offline multiplayer games',
    'pass and play games',
    'local multiplayer board games',
    'ludo offline',
    'tic tac toe offline',
    'carrom offline',
    'Cosmic Aura Tech Industry',
    'CATI',
  ],
  alternates: {
    canonical: 'https://cati47.tech/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'CATI KHELGHAR - Offline Family & Friends Games by DIMISI',
    description:
      'Play Tic Tac Toe, Ludo, Snake & Ladders, Four in a Row, Dots & Boxes, and Carrom offline on the same device. Zero login, zero server, 100% offline fun. Developed by Shikhar Dixit.',
    url: 'https://cati47.tech/',
    type: 'website',
    locale: 'en_IN',
    siteName: 'CATI KHELGHAR',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'CATI KHELGHAR Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CATI KHELGHAR - Offline Family Games by DIMISI',
    description:
      'Play local multiplayer games with family & friends anywhere. Built by Shikhar Dixit at DIMISI Technologies.',
    creator: '@shikhardixit',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const globalJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://cati47.tech/#website',
      url: 'https://cati47.tech/',
      name: 'CATI KHELGHAR',
      description: 'Zero-login, 100% offline local multiplayer gaming platform for friends and family.',
      publisher: {
        '@id': 'https://cati47.tech/#dimisi-technologies',
      },
      creator: {
        '@id': 'https://cati47.tech/#shikhar-dixit',
      },
      inLanguage: 'en-IN',
    },
    {
      '@type': 'Organization',
      '@id': 'https://cati47.tech/#dimisi-technologies',
      name: 'DIMISI Technologies Pvt Ltd',
      alternateName: ['DIMISI Technologies', 'DIMISI', 'Cosmic Aura Tech Industry', 'CATI'],
      url: 'https://dimisi.tech',
      logo: 'https://cati47.tech/dimisi-logo.png',
      founder: {
        '@id': 'https://cati47.tech/#shikhar-dixit',
      },
      sameAs: [
        'https://dimisipedia.me/wiki/DIMISI_Technologies',
        'https://dimisi.tech',
      ],
    },
    {
      '@type': 'Person',
      '@id': 'https://cati47.tech/#shikhar-dixit',
      name: 'Shikhar Dixit',
      jobTitle: 'Founder & CEO',
      url: 'https://cati47.tech/team/shikhar-dixit',
      image: 'https://cati47.tech/team/shikhar-dixit.png',
      worksFor: {
        '@id': 'https://cati47.tech/#dimisi-technologies',
      },
      sameAs: [
        'https://dimisipedia.me/wiki/Shikhar_Dixit',
        'https://dimisi.tech',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen antialiased" suppressHydrationWarning>
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />

        {/* PWA Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
