import React from "react";
import { Metadata } from "next";
import Player from "../_components/Player";
import Recomandation from "../_components/Recomandation";

interface PageProps {
  params: {
    id: string;
  };
}

interface SongData {
  id: string;
  name: string;
  url: string;
  image: { url: string }[];
  artists: { primary: { name: string }[] };
  album: { name: string; url: string };
  releaseDate: string;
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const title = await fetch(`http://localhost:3000/api/songs?id=${params.id}`);
  const data = await title.json();
  const song: SongData = data?.data[0];

  return {
    title: song.name,
    openGraph: {
      url: song.url,
      title: song.name,
      type: "music.song",
      description: `Listen to "${song.name}" by ${song?.artists?.primary[0]?.name || "unknown"}.`,
      images: [{ url: song.image[2]?.url || song.image[1]?.url || song.image[0]?.url, width: 1200, height: 630, alt: song.name }],
      music: { album: song.album?.url, release_date: song.releaseDate, musician: song?.artists?.primary[0]?.name || "unknown" },
    },
    description: `Listen to "${song.name}" by ${song?.artists?.primary[0]?.name || "unknown"} from the album "${song.album?.name}".`,
    twitter: { card: "summary_large_image", title: song.name, description: `Listen to "${song.name}" by ${song?.artists?.primary[0]?.name || "unknown"}.`, images: song.image?.[0]?.url },
  };
};

export default function Page({ params }: PageProps) {
  return (
    <div>
      <Player id={params.id} />
      <Recomandation id={params.id} />
    </div>
  );
}
