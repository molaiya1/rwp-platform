import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Real-World Pathways™ — WealthWise Kids®",
  description: "Real-World Pathways™ connects students to certified Field Lab experiences across Atlanta. A WealthWise Kids® program — founded by Michael D. Olaiya.",
  authors: [{ name: "Michael D. Olaiya", url: "https://www.linkedin.com/in/dr-michael-olaiya" }],
  creator: "Michael D. Olaiya",
  openGraph: {
    title: "Real-World Pathways™ — WealthWise Kids®",
    description: "Connecting students to real-world career experiences through certified Field Labs. A WealthWise Kids® program.",
    url: "https://www.realworldpathways.com",
    siteName: "Real-World Pathways™",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
