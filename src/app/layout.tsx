// src/app/layout.tsx
import type { Metadata } from 'next';
import '../styles/style.css';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';
import { Poppins, Pacifico } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import { SearchProvider } from '@/context/SearchContext';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});
export const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pacifico',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hey Jinie',
  description: 'Created with the help of Alishba Siddique',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <ToastContainer position="top-center" />
          <CartProvider>
            <SearchProvider>
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
