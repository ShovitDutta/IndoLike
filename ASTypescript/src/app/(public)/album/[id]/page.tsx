import Album from "../_components/Album";
import type { Metadata } from "next";

interface AlbumPageProps {
  params: {
    id: string;
  };
}

interface AlbumData {
  data: {
    name: string;
    // Include other properties if needed by metadata, otherwise 'name' is sufficient for the title
  };
}

export const generateMetadata = async ({ params }: AlbumPageProps): Promise<Metadata> => {
  try {
    const titleResponse = await fetch(`http://localhost:3000/api/albums?id=${params.id}`);
    if (!titleResponse.ok) {
      // Handle the error case, perhaps return a default title or throw an error
      console.error(`Failed to fetch album metadata for ID "${params.id}": ${titleResponse.status}`);
      return { title: "Album Not Found" };
    }
    const data: AlbumData = await titleResponse.json();
    return {
      title: `Album - ${data.data.name}`,
    };
  } catch (error) {
    console.error(`Error fetching album metadata for ID "${params.id}":`, error);
    return { title: "Album Error" };
  }
};

export default function Page({ params }: AlbumPageProps) {
  return (
    <main>
      <Album id={params.id} />
    </main>
  );
}
