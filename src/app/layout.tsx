import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  title: 'CATI KHELGHAR | Play Games Together Offline',
  description:
    'Play Tic Tac Toe, Ludo, Snake & Ladders, Four in a Row, Dots & Boxes, and Carrom with family and friends offline on the same device. No login, no servers, just pure casual fun.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg'
  },
  openGraph: {
    title: 'CATI KHELGHAR - Offline Family & Friends Games',
    description:
      'Play Tic Tac Toe, Ludo, Snake & Ladders, Four in a Row, Dots & Boxes, and Carrom offline on the same device. Zero login, zero server, 100% offline fun.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'CATI KHELGHAR'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CATI KHELGHAR - Offline Family Games',
    description: 'Play local multiplayer games with family & friends anywhere.'
  }
};

export default function RootLayout({
  children
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
            `
          }}
        />
      </body>
    </html>
  );
}
