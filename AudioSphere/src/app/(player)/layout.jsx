import Footer from "@/components/elements/footer";
import Header from "@/components/elements/header";
import NextProvider from "@/components/providers/next-provider";
export default function RootLayout({ children }) {
  return (
    <main>
      <Header />
      <NextProvider>{children}</NextProvider>
      <Footer />
    </main>
  );
}
