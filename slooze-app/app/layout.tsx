import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slooze - Your Favorite Food, Delivered Fast! 🍕",
  description: "Order delicious food from your favorite restaurants with Slooze - the fastest and most fun food ordering app!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
