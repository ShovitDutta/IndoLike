import Player from "@/components/cards/player";
import Header from "@/components/page/header";
import Search from "@/components/page/search";
import Footer from "@/components/page/footer";

export default function RootLayout({ children }) {
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
