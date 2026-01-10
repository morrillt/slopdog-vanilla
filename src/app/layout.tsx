import type { Metadata } from "next";

import { Header } from "@/components/Header";
import { LayoutWrapper } from "@/components/LayoutWrapper";

import "./globals.css";

export const metadata: Metadata = {
  title: "slopdogrpg",
  description: "RPG playground scaffold",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark mocha" lang="en">
      <body className="overflow-hidden">
        <div className="flex flex-col h-screen overflow-hidden bg-mocha-base text-mocha-text">
          <Header />
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
      </body>
    </html>
  );
}

