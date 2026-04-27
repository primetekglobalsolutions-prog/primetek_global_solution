import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
