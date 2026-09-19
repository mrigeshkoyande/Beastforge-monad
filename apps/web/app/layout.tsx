import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { CustomCursor } from "@/components/CustomCursor";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05070B",
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://monad-hunt.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MONAD HUNT | City League — Catch. Stake. Battle. Conquer.",
  description:
    "MONAD HUNT: CITY LEAGUE — A competitive cyberpunk on-chain beast arena where victories earn real NFT ownership. Powered by Monad Testnet.",
  keywords: [
    "monad hunt",
    "web3 game",
    "monad testnet",
    "nft game",
    "blockchain game",
    "city league",
    "beast battling",
    "crypto game",
  ],
  authors: [{ name: "MONAD HUNT Team" }],
  creator: "MONAD HUNT",
  publisher: "MONAD HUNT",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "MONAD HUNT | City League — Catch. Stake. Battle. Conquer.",
    description:
      "A persistent on-chain competitive world where Hunters and Beasts battle for territory across Mumbai.",
    siteName: "MONAD HUNT",
    images: [
      {
        url: "/assets/hero/mumbai-beast-hero.jpg",
        width: 1200,
        height: 630,
        alt: "MONAD HUNT City League - Cyberpunk Mumbai Beast Arena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MONAD HUNT | Catch. Stake. Battle. Conquer.",
    description:
      "Competitive on-chain beast battling arena on Monad Testnet. Claim territory. Dominate Mumbai.",
    images: ["/assets/hero/mumbai-beast-hero.jpg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#05070B] text-white antialiased selection:bg-[#E63946] selection:text-white">
        <GameProvider>
          <CustomCursor />
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
