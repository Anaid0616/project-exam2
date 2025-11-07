import '@/styles/globals.css';

import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToastProvider from '@/providers/ToastProvider';
import { UserProvider } from '@/providers/UserProvider';
import 'react-day-picker/dist/style.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Holidaze',
  description: 'Book unique stays with Holidaze',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-screen flex-col font-sans bg-sand text-ink">
        <ToastProvider>
          <UserProvider>
            <Header />
            <main className="overflow-x-clip flex-1"> {children}</main>
            <Footer />
          </UserProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
