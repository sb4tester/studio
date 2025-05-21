import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import { Geist } from 'next/font/google';
import { Cinzel_Decorative } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const cinzel = Cinzel_Decorative({
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Seer Shaker',
  description: 'Get your fortune told with the Seer Shaker app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
