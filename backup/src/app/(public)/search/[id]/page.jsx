<<<<<<< HEAD
import Search from "../_components/Search";
export const generateMetadata = ({ params }) => {
  return { title: `Search Results - ${decodeURI(params.id).toLocaleUpperCase()}`, description: `Viewing search results for ${decodeURI(params.id)}` };
};
export default function Page({ params }) {
  return <Search params={params} />;
}
=======
import Search from "../_components/Search";
export const generateMetadata = ({ params }) => {
  return { title: `Search Results - ${decodeURI(params.id).toLocaleUpperCase()}`, description: `Viewing search results for ${decodeURI(params.id)}` };
};
export default function Page({ params }) {
  return <Search params={params} />;
}
>>>>>>> 8c930d8c52fe0e2eeb08f275e5a181aea5f59fce
