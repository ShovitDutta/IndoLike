import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import NextProvider from "@/components/next-provider";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <main>
      <Header />
      <NextProvider>{children}</NextProvider>
      <Footer />
    </main>
  );
}
