import Player from "../_components/Player";
import Recomandation from "../_components/Recomandation";
export const generateMetadata = async ({ params }) => {
  const title = await fetch(`http://localhost:3000/api/songs/${params.id}`);
  const data = await title.json();
  const song = data?.data[0];
  return {
    title: song.name,
    openGraph: {
      url: song.url,
      title: song.name,
      type: "music.song",
      description: `Listen to "${song.name}" by ${data?.artists?.primary[0]?.name || "unknown"}.`,
      images: [{ url: song.image[2]?.url || song.image[1]?.url || song.image[0]?.url, width: 1200, height: 630, alt: song.name }],
      music: { album: song.album?.url, release_date: song.releaseDate, musician: data?.artists?.primary[0]?.name || "unknown" },
    },
    description: `Listen to "${song.name}" by ${data?.artists?.primary[0]?.name || "unknown"} from the album "${song.album?.name}".`,
    twitter: { card: "summary_large_image", title: song.name, description: `Listen to "${song.name}" by ${data?.artists?.primary[0]?.name || "unknown"}.`, images: song.image?.[0]?.url },
  };
};
export default function Page({ params }) {
  return (
    <div>
      <Player id={params.id} /> <Recomandation id={params.id} />
    </div>
  );
}
