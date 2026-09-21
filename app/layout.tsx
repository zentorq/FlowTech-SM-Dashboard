import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowTech Media SM Dashboard",
  description: "Connect your social platforms and monitor your digital performance from one simple, powerful workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
