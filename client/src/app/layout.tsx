import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DevNavigation from "@/components/DevNavigation";
import DevQuickActions from "@/components/DevQuickActions";
import HydrationSuppressor from "@/components/HydrationSuppressor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real Estate App",
  description: "Real Estate Application with Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <HydrationSuppressor />
        <DevNavigation />
        {children}
        <DevQuickActions />
      </body>
    </html>
  );
}
