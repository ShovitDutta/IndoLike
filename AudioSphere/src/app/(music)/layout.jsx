import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import AudioProvider from "@/components/AudioProvider";
export default function RootLayout({ children }) {
  return (
    <main>
      <Header />
      <AudioProvider>{children}</AudioProvider>
      <Footer />
    </main>
  );
}
