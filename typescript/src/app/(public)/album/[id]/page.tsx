import Album from "../_components/Album";
import { Metadata } from "next";
import React from "react";
interface PageProps {
  params: {
    id: string;
  };
}
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const title = await fetch(`http://localhost:3000/api/albums?id=${params.id}`);
  const data = await title.json();
  return { title: `Album - ${data?.data?.name || "Unknown Album"}` };
};
export default function Page({ params }: PageProps) {
  return (
    <main>
      <Album id={params.id} />
    </main>
  );
}