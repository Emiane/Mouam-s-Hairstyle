import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mouam's Hairstyle | Braids à Liège",
  description: "Coiffures afro, knotless et tresses sur rendez-vous à Liège.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}