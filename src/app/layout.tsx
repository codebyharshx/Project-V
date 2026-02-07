import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import PublicLayout from "@/components/layout/PublicLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velorious - Premium Luxury Goods & Design",
  description:
    "Discover exquisite luxury goods and timeless design at Velorious. Curated products for the discerning taste.",
  metadataBase: new URL("https://velorious.com"),
  openGraph: {
    title: "Velorious - Premium Luxury Goods & Design",
    description:
      "Discover exquisite luxury goods and timeless design at Velorious. Curated products for the discerning taste.",
    type: "website",
    locale: "en_US",
    url: "https://velorious.com",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Velorious - Premium Luxury Experience",
      },
    ],
  },
  keywords: [
    "luxury goods",
    "premium design",
    "curated products",
    "lifestyle",
    "elegance",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <body className="font-sans antialiased overflow-x-hidden">
        <Providers>
          <PublicLayout>{children}</PublicLayout>
        </Providers>
      </body>
    </html>
  );
}
