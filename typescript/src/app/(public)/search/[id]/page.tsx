import Search from "../_components/Search";
import { Metadata } from "next";
import React from "react";
interface PageProps {
  params: {
    id: string;
  };
}
export const generateMetadata = ({ params }: PageProps): Metadata => {
  return { title: `Search Results - ${decodeURIComponent(params.id).toLocaleUpperCase()}`, description: `Viewing search results for ${decodeURIComponent(params.id)}` };
};
export default function Page({ params }: PageProps) {
  return <Search params={params} />;
}
