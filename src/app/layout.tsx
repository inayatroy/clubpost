import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClubPost — social media for student orgs, in seconds",
  description:
    "Paste your event details. Get Instagram captions, a reel script, and a week of posts in your club's voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
