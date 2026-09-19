import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MONAD HUNT 🐲 | Catch. Stake. Battle. Conquer.",
  description: "A competitive arcade beast arena where victories have real on-chain ownership, powered by Monad Testnet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-warm-100 text-arcade-black antialiased selection:bg-arcade-yellow selection:text-arcade-black">
        {children}
      </body>
    </html>
  );
}
