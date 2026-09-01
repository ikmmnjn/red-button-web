import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://red-button-counter.brawny-flint-1591.chatgpt.site'),
  title: 'Red Button',
  description: '누르기만 하면 되는 가장 간단한 카운터.',
  applicationName: 'Red Button',
  appleWebApp: { capable: true, title: 'Red Button', statusBarStyle: 'default' },
  openGraph: {
    title: 'Red Button',
    description: '누르기만 하면 되는 가장 간단한 카운터.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Red Button 카운터' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Red Button',
    description: '누르기만 하면 되는 가장 간단한 카운터.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
