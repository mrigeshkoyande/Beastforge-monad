import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

export const metadata: Metadata = {
  title: "MONAD HUNT 🐲 | Catch. Stake. Battle. Conquer.",
  description: "A competitive cyberpunk arcade beast arena where victories have real on-chain ownership, powered by Monad Testnet.",
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
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#05070B] text-white antialiased selection:bg-[#E63946] selection:text-white">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
