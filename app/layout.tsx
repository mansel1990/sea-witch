import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "../components/Header";
import ReactQueryProvider from "../components/ReactQueryProvider";
import { ToastProvider } from "../components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sea Witch - Movie Reviews",
  description: "Discover and review your favorite movies",
  icons: {
    icon: [
      {
        url: "/sea-witch.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/sea-witch.png",
    apple: "/sea-witch.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <ReactQueryProvider>
          <ClerkProvider>
            <ToastProvider>
              <Header />
              <main className="pt-16">{children}</main>
            </ToastProvider>
          </ClerkProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
