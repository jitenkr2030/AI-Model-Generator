import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Model Generator - Virtual Fashion Photography",
  description: "Generate professional fashion model images with AI. No models, no photographers, no delays. Just conversion-ready images by tonight.",
  keywords: ["AI", "Fashion", "Model Generator", "E-commerce", "Virtual Photography"],
  authors: [{ name: "AI Model Generator Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "AI Model Generator",
    description: "Upload clothes. Get a human. No drama.",
    url: "https://aimodelgenerator.com",
    siteName: "AI Model Generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Model Generator",
    description: "Upload clothes. Get a human. No drama.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
          <script
            src="https://checkout.razorpay.com/v1/checkout.js"
            async
          />
        </Providers>
      </body>
    </html>
  );
}
