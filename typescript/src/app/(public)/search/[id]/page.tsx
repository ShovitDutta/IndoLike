import Search from "../_components/Search"; // Assuming Search component will be created in TSX
import { Metadata } from "next";

// Define types for the page parameters
interface SearchPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = ({ params }: SearchPageProps): Metadata => {
  const decodedId = decodeURI(params.id);
  return {
    title: `Search Results - ${decodedId.toLocaleUpperCase()}`,
    description: `Viewing search results for ${decodedId}`,
  };
};

export default function Page({ params }: SearchPageProps) {
  return <Search params={params} />;
}