<<<<<<< HEAD
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
=======
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
>>>>>>> 8c930d8c52fe0e2eeb08f275e5a181aea5f59fce
