import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Just My Type",
  description: "Find your perfect typographic pairing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
