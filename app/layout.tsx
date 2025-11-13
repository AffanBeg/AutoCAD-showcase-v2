import "./../styles/globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Showcase3D",
  description: "Upload, convert, and share 3D CAD models.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container py-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
