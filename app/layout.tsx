import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'Kinetix',
    template: '%s | Kinetix',
  },
  description: 'A routed gallery of high-craft UI experiments and interface studies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={cn('h-full', 'antialiased', 'font-sans')}
    >
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  );
}
