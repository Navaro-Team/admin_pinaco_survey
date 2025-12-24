import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "@/components/auth-guard";
import Providers from "@/components/providers";
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from '@/components/ui/toast-container';
import { DialogProvider } from '@/context/DialogContext';
import { DialogContainer } from '@/components/ui/dialog-container';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PINACO - Quản lý khảo sát",
  description: "Quản lý khảo sát",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ToastProvider>
            <DialogProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
              <ToastContainer />
              <DialogContainer />
            </DialogProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
