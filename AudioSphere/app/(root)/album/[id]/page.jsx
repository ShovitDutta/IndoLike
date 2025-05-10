import Album from "../_components/Album";
export const generateMetadata = async ({ params }) => {
  const title = await fetch(`http://localhost:3000/api/albums?id=${params.id}`);
  const data = await title.json();
  return { title: `Album - ${data.data.name}` };
};
export default function Page({ params }) {
  return (
    <main>
      <Album id={params.id} />
    </main>
  );
}
