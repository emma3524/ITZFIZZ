import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ItzFizz — Welcome",
  description:
    "ItzFizz hero section with scroll-based animation powered by GSAP ScrollTrigger.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
