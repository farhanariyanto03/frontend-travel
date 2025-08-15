import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Metadata } from 'next';
import ReactQueryProvider from '@/provider/ReactQueryProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Travel",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
