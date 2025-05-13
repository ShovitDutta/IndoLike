import Header from "@/components/page/header";
import Search from "@/components/page/search";
import Footer from "@/components/page/footer";
import Player from "@/components/cards/player";
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <main>
      <Header />
      <div className="px-6 sm:hidden mb-4">
        <Search />
      </div>
      {children}
      <Footer />
      <Player />
    </main>
  );
}
