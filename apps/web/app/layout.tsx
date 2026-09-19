import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen flex flex-col bg-mh-bg text-mh-text antialiased selection:bg-mh-crimson selection:text-white">
        {children}
      </body>
    </html>
  );
}
