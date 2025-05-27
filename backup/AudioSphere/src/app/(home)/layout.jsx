import Header from "@/components/elements/header";
import Search from "@/components/elements/search";
import Footer from "@/components/elements/footer";
import Player from "@/components/cards/player";
export default function RootLayout({ children }) {
  return (
    <main>
      <Header />
      <div className="px-6 sm:hidden mb-4">
        <Search />
      </div>
      {children} <Footer /> <Player />
    </main>
  );
}
