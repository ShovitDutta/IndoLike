import Player from "../_components/Player";
import Recomandation from "../_components/Recomandation";
import type { Metadata } from "next";

interface SongPageProps {
  params: {
    id: string;
  };
}

interface Image {
  url: string;
  width?: number;
  height?: number;
  quality?: string;
}

interface Album {
  url?: string;
  name?: string;
}

interface Artist {
  id?: string;
  name: string;
  image?: Image[];
}

interface SongData {
  id: string;
  name: string;
  url?: string;
  image: Image[];
  album?: Album;
  releaseDate?: string;
  artists: {
    primary: Artist[];
  };
}

interface FetchResponse {
  data?: SongData[];
}

// Define the expected structure for Open Graph Music Song to work around potential type issues
interface ExpectedOpenGraphMusicSong {
  url?: string;
  title?: string;
  type: "music.song";
  description?: string;
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  music?: {
    album?: string;
    release_date?: string;
    musician?: string;
  };
  // Add other properties if needed based on OpenGraphMusicSong type
}

export const generateMetadata = async ({ params }: SongPageProps): Promise<Metadata> => {
  try {
    const titleResponse = await fetch(`http://localhost:3000/api/songs?id=${params.id}`);

    if (!titleResponse.ok) {
      console.error(`Failed to fetch song metadata for ID "${params.id}": ${titleResponse.status}`);
      return {
        title: "Song Not Found",
        description: "Could not retrieve song details.",
      };
    }

    const result: FetchResponse = await titleResponse.json();
    const song = result?.data?.[0];

    if (!song) {
      console.error(`No song data found in the response for ID "${params.id}"`);
      return {
        title: "Song Data Missing",
        description: "Could not retrieve song details.",
      };
    }

    const primaryArtistName = song.artists?.primary?.[0]?.name || "unknown";
    const albumName = song.album?.name || "unknown album";

    return {
      title: song.name,
      // Cast openGraph object to our defined interface to satisfy type checking
      // This works around potential discrepancies in the imported Metadata type definition.
      openGraph: {
        url: song.url,
        title: song.name,
        type: "music.song",
        description: `Listen to "${song.name}" by ${primaryArtistName}.`,
        images:
          song.image
            ?.map(img => ({
              url: img.url,
              width: img.width || 1200,
              height: img.height || 630,
              alt: song.name,
            }))
            .filter(img => img.url) || [],
        music: {
          album: song.album?.url,
          release_date: song.releaseDate,
          musician: primaryArtistName,
        },
      } as ExpectedOpenGraphMusicSong, // Use the defined interface for casting
      description: `Listen to "${song.name}" by ${primaryArtistName} from the album "${albumName}".`,
      twitter: {
        card: "summary_large_image",
        title: song.name,
        description: `Listen to "${song.name}" by ${primaryArtistName}.`,
        images: song.image?.[0]?.url,
      },
    };
  } catch (error) {
    console.error(`Error fetching song metadata for ID "${params.id}":`, error);
    return {
      title: "Song Error",
      description: "An error occurred while loading song details.",
    };
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
