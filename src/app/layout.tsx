import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToastProvider from '@/components/ToastProvider';
import { UserProvider } from '@/providers/UserProvider';

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
      <body className="font-sans bg-sand text-ink">
        <Header />
        <main>
          {' '}
          <UserProvider>{children}</UserProvider>
        </main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
