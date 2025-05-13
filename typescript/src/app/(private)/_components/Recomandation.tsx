"use client";

import Next from "@/components/cards/next";
import { NextContext, NextContextType } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useEffect, useState } from "react";
import React from "react";

// Define types for the fetched song suggestion data
interface SongSuggestion {
  id: string;
  name: string;
  artists: { primary: { name: string }[] };
  album?: { name?: string };
  image: { url: string }[];
}

interface RecomandationProps {
  id: string;
}

export default function Recomandation({ id }: RecomandationProps) {
  const [data, setData] = useState<SongSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const next = useContext<NextContextType | null>(NextContext);

  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/songs/suggestions?id=${id}`);
      const data = await res.json();

      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const suggestions: SongSuggestion[] = data.data;
        setData(suggestions);

        // Select a random song for the next data
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        const randomSong = suggestions[randomIndex];

        const nextData = {
          id: randomSong.id,
          name: randomSong.name,
          artist: randomSong.artists?.primary?.[0]?.name || "unknown",
          album: randomSong.album?.name || "unknown",
          image: randomSong.image?.[1]?.url || "", // Use optional chaining
        };

        if (next?.setNextData) {
          next.setNextData(nextData);
        }
      } else {
        setData([]);
        if (next?.setNextData) {
           next.setNextData(null); // Set next data to null if no suggestions
        }
      }
    } catch (error) {
      console.error("Error fetching song suggestions:", error);
      setData([]);
       if (next?.setNextData) {
           next.setNextData(null); // Set next data to null on error
        }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]); // Added id to dependency array

  return (
    <section className="py-10 px-6 md:px-20 lg:px-32">
      <div>
        <h1 className="text-base font-medium">Recomandation</h1>
        <p className="text-xs text-muted-foreground">You might like this</p>
      </div>
      <div className="rounded-md mt-6">
        {!loading && data && data.length > 0 && ( // Added data.length check
          <div className="grid sm:grid-cols-2 gap-3 overflow-hidden">
            {data.map(song => (
              <Next next={false} key={song.id} image={song.image[2]?.url} name={song.name} artist={song.artists.primary[0]?.name || "unknown"} id={song.id} /> // Use optional chaining
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
        {!loading && data && data.length === 0 && ( // Added data.length check
          <div className="flex items-center justify-center text-center h-[100px]">
            <p className="text-sm text-muted-foreground">No recomandation for this song.</p>
          </div>
        )}
      </div>
    </section>
  );
}