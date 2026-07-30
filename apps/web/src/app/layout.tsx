import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasma | AI Video Studio",
  description: "Create Viral Videos with AI using Tasma Video Studio. The ultimate platform for modern creators.",
  openGraph: {
    title: "Tasma | AI Video Studio",
    description: "Create Viral Videos with AI using Tasma Video Studio.",
    url: "https://tasma.com",
    siteName: "Tasma",
    images: [
      {
        url: "https://tasma.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tasma AI Video Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasma | AI Video Studio",
    description: "Create Viral Videos with AI using Tasma Video Studio.",
    images: ["https://tasma.com/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} antialiased selection:bg-violet-500/30 selection:text-violet-200`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
