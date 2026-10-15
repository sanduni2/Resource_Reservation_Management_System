import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PrimeWave Resource Reservation",
  description: "Resource reservation management system for shared facilities.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
