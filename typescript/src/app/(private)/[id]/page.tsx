import Player from "../_components/Player";
import Recomandation from "../_components/Recomandation"; // Assuming Recomandation component will be created in TSX
import { Metadata } from "next";

// Define types for the page parameters
interface SongPageProps {
  params: {
    id: string;
  };
}

// Define types for the fetched song data (simplified based on metadata usage)
interface SongData {
  name: string;
  url: string;
  image: { url: string }[];
  album?: { url: string; name?: string };
  releaseDate?: string;
  artists?: { primary: { name: string }[] };
}

export const generateMetadata = async ({ params }: SongPageProps): Promise<Metadata> => {
  try {
    const title = await fetch(`http://localhost:3000/api/songs?id=${params.id}`);
    const data = await title.json();
    const song: SongData | undefined = data?.data?.[0];

    if (!song) {
      return { title: "Song Not Found" };
    }

    const artistName = song.artists?.primary?.[0]?.name || "unknown";
    const albumName = song.album?.name || "unknown";
    const imageUrl = song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url;

    const openGraph: any = { // Use any for now to bypass strict type checking
      url: song.url,
      title: song.name,
      type: "music.song",
      description: `Listen to "${song.name}" by ${artistName}.`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: song.name }] : [],
    };

    if (song.album?.url || song.releaseDate || artistName) {
        openGraph.music = {
            album: song.album?.url ? [{ url: song.album.url }] : undefined,
            releaseDate: song.releaseDate,
            musician: artistName,
        };
    }


    const twitter: any = { // Use any for now to bypass strict type checking
        card: "summary_large_image",
        title: song.name,
        description: `Listen to "${song.name}" by ${artistName}.`,
        images: imageUrl ? [imageUrl] : [],
    };


    return {
      title: song.name,
      openGraph,
      description: `Listen to "${song.name}" by ${artistName} from the album "${albumName}".`,
      twitter,
    };
  } catch (error) {
    console.error("Error generating metadata for song:", error);
    return { title: "Song Details" }; // Default title on error
  }
};

export default function Page({ params }: SongPageProps) {
  return (
    <div>
      <Player id={params.id} />
      <Recomandation id={params.id} />
    </div>
  );
}
