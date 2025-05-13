import Album from "../_components/Album"; // Assuming Album component will be created in TSX
import { Metadata } from "next";

// Define types for the page parameters
interface AlbumPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = async ({ params }: AlbumPageProps): Promise<Metadata> => {
  try {
    const title = await fetch(`http://localhost:3000/api/albums?id=${params.id}`);
    const data = await title.json();
    // Assuming the data structure includes data.data.name
    if (data?.data?.name) {
      return { title: `Album - ${data.data.name}` };
    }
  } catch (error) {
    console.error("Error generating metadata for album:", error);
  }
  return { title: "Album" }; // Default title if fetching fails
};

export default function Page({ params }: AlbumPageProps) {
  return (
    <main>
      <Album id={params.id} />
    </main>
  );
}