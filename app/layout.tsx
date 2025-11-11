import "./../styles/globals.css";
import React from "react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Showcase3D",
  description: "Upload, convert, and share 3D CAD models.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container py-10">{children}</main>
      </body>
    </html>
  );
}
