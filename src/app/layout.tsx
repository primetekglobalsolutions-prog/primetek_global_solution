import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'Primetek Global Solutions | Staffing & Consulting',
    template: '%s | Primetek Global Solutions',
  },
  description:
    'Leading staffing and consulting firm specializing in IT, Healthcare, Finance, and Manufacturing. Find top talent or explore career opportunities.',
  keywords: [
    'staffing',
    'consulting',
    'IT staffing',
    'recruitment',
    'outsourcing',
    'Primetek Global',
    'talent solutions',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Primetek Global Solutions',
    title: 'Primetek Global Solutions | Staffing & Consulting',
    description:
      'Leading staffing and consulting firm. Find top talent or explore career opportunities.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Primetek Global Solutions',
    description: 'Leading staffing and consulting firm.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased overflow-x-hidden ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col overflow-x-hidden w-full">{children}</body>
    </html>
  );
}
