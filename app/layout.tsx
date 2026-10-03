import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello from stack-control",
  description: "A repo-defined service spike",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
