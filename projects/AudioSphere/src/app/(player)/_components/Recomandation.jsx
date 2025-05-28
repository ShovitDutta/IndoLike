"use client";
import { BASE_URL } from "@/lib/linker";
import Next from "@/components/cards/next";
import { NextContext } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useEffect, useState } from "react";
export default function Recomandation({ id }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const next = useContext(NextContext);
  const getData = async () => {
    await fetch(`${BASE_URL}api/songs/suggestions?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setData(data.data);
          let d = data.data[Math.floor(Math.random() * data.data.length)];
          const nextData = {
            id: d.id,
            name: d.name,
            artist: d.artists && d.artists.primary && d.artists.primary[0]?.name ? d.artists.primary[0].name : "unknown",
            album: d.album && d.album.name ? d.album.name : "unknown",
            image: d.image && d.image[1]?.url ? d.image[1].url : "",
          };
          next.setNextData(nextData);
        } else setData([]);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching song suggestions:", error);
        setData([]);
        setLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="py-10 px-6 md:px-20 lg:px-32">
      <div>
        <h1 className="text-base font-medium">Recomandation</h1> <p className="text-xs text-muted-foreground">You might like this</p>
      </div>
      <div className="rounded-md mt-6">
        {!loading && data && (
          <div className="grid sm:grid-cols-2 gap-3 overflow-hidden">
            {data.map(song => (
              <Next next={false} key={song.id} image={song.image[2].url} name={song.name} artist={song.artists.primary[0]?.name || "unknown"} id={song.id} />
            ))}
          </div>
        )}
        {loading && (
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Skeleton className="h-14 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-14 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-14 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        )}
      </div>
      {!loading && !data && (
        <div className="flex items-center justify-center text-center h-[100px]">
          <p className="text-sm text-muted-foreground">No recomandation for this song.</p>
        </div>
      )}
    </section>
  );
}
