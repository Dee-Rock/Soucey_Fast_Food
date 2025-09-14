import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { CartProvider } from '@/context/cart-context';
import AuthCheck from '@/components/auth-check';
import { headers } from 'next/headers';
import './leaflet.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Soucey - Food Ordering & Delivery',
  description: 'Order delicious food for delivery at your school in Ghana',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current pathname
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "/";
  
  // List of public routes that don't need authentication
  const publicRoutes = ["/sign-in", "/sign-up", "/", "/about", "/contact", "/restaurants", "/menu"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <CartProvider>
              <div className="flex flex-col min-h-screen overflow-x-hidden">
                <Navbar />
                <main className="flex-grow w-full">
                  {isPublicRoute ? (
                    children
                  ) : (
                    <AuthCheck>{children}</AuthCheck>
                  )}
                </main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
