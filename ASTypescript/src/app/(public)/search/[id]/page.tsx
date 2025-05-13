import Search from "../_components/Search";
import type { Metadata } from "next";

interface SearchPageProps {
  params: {
    id: string;
  };
}

export const generateMetadata = ({ params }: SearchPageProps): Metadata => {
  return {
    title: `Search Results - ${decodeURI(params.id).toLocaleUpperCase()}`,
    description: `Viewing search results for ${decodeURI(params.id)}`,
  };
};

export default function Page({ params }: SearchPageProps) {
  return <Search params={params} />;
}
