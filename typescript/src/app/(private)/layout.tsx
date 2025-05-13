import Footer from "@/components/page/footer"; // Assuming Footer will be created in TSX
import Header from "@/components/page/header"; // Assuming Header will be created in TSX
import NextProvider from "@/components/next-provider"; // Assuming NextProvider will be created in TSX
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      <NextProvider>{children}</NextProvider>
      <Footer />
    </main>
  );
}