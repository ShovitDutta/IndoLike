"use client";

import Next from "@/components/cards/next";
import { NextContext } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useContext, useEffect, useState } from "react";

interface Image {
  url: string;
  quality?: string;
}

interface Artist {
  id?: string;
  name: string;
}

interface Album {
  name?: string; // Album name might be optional
}

interface SongSuggestion {
  id: string;
  image: Image[];
  name: string;
  artists: {
    primary: Artist[];
  };
  album?: Album; // Album might be optional
  // Add other song properties if they exist and are used
}

interface FetchSuggestionsResponse {
  data?: SongSuggestion[]; // API returns an array of suggestions under 'data'
  // Include other potential top-level properties
}

// Define the type for the data structure set in the NextContext
interface NextData {
  id?: string;
  name?: string;
  artist?: string;
  album?: string;
  image?: string;
}

// Refine the type for NextContext to include setNextData
interface NextContextValue {
  nextData?: NextData | null;
  setNextData: (data: NextData) => void; // Add the setNextData function
}

interface RecomandationProps {
  // Keeping user's spelling 'Recomandation'
  id: string;
}

export default function Recomandation({ id }: RecomandationProps) {
  // Keeping user's spelling 'Recomandation'
  const [data, setData] = useState<SongSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Use the refined type for the context, assuming it's never null when used here
  // If NextContext can be null, you might need to handle that case.
  const next = useContext(NextContext) as NextContextValue;

  const getData = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/songs/suggestions?id=${id}`);
      if (!res.ok) {
        console.error(`Failed to fetch song suggestions for ID "${id}": ${res.status}`);
        setData([]);
        setLoading(false);
        return;
      }
      const result: FetchSuggestionsResponse = await res.json();

      if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
        setData(result.data);
        // Select a random song for nextData
        let d = result.data[Math.floor(Math.random() * result.data.length)];

        const nextData: NextData = {
          id: d.id,
          name: d.name,
          artist: d.artists && d.artists.primary && d.artists.primary[0]?.name ? d.artists.primary[0].name : "unknown",
          album: d.album && d.album.name ? d.album.name : "unknown",
          image: d.image && d.image[1]?.url ? d.image[1].url : "",
        };
        // Ensure setNextData exists before calling it
        if (next?.setNextData) {
          next.setNextData(nextData);
        }
      } else {
        setData([]);
        // Optionally clear nextData if no suggestions are found
        if (next?.setNextData) {
          next.setNextData(null as any); // Cast to any or define a null type if needed
        }
      }
    } catch (error) {
      console.error(`Error fetching song suggestions for ID "${id}":`, error);
      setData([]);
      // Optionally clear nextData on error
      if (next?.setNextData) {
        next.setNextData(null as any); // Cast to any or define a null type if needed
      }
    } finally {
      setLoading(false);
    }
  };

  // Move getData inside useEffect or wrap with useCallback if needed by lint rules,
  // but for this simple case, keeping it outside and adding to dependencies might be okay
  // depending on the specific lint configuration. Let's move it inside for consistency
  // with previous examples and to satisfy exhaustive-deps.

  useEffect(() => {
    const getData = async (): Promise<void> => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/songs/suggestions?id=${id}`);
        if (!res.ok) {
          console.error(`Failed to fetch song suggestions for ID "${id}": ${res.status}`);
          setData([]);
          setLoading(false);
          return;
        }
        const result: FetchSuggestionsResponse = await res.json();

        if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
          setData(result.data);
          let d = result.data[Math.floor(Math.random() * result.data.length)];

          const nextData: NextData = {
            id: d.id,
            name: d.name,
            artist: d.artists && d.artists.primary && d.artists.primary[0]?.name ? d.artists.primary[0].name : "unknown",
            album: d.album && d.album.name ? d.album.name : "unknown",
            image: d.image && d.image[1]?.url ? d.image[1].url : "",
          };
          if (next?.setNextData) {
            next.setNextData(nextData);
          }
        } else {
          setData([]);
          if (next?.setNextData) {
            next.setNextData(null as any);
          }
        }
      } catch (error) {
        console.error(`Error fetching song suggestions for ID "${id}":`, error);
        setData([]);
        if (next?.setNextData) {
          next.setNextData(null as any);
        }
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [id, next?.setNextData]); // Add id and next.setNextData to dependencies

  return (
    <section className="py-10 px-6 md:px-20 lg:px-32">
      <div>
        <h1 className="text-base font-medium">Recomandation</h1> {/* Keeping user's spelling 'Recomandation' */}
        <p className="text-xs text-muted-foreground">You might like this</p>
      </div>
      <div className="rounded-md mt-6">
        {!loading && data && data.length > 0 ? ( // Check for data existence and length
          <div className="grid sm:grid-cols-2 gap-3 overflow-hidden">
            {data.map(song => (
              // Use optional chaining for image and artist access
              <Next next={false} key={song.id} image={song.image?.[2]?.url} name={song.name} artist={song.artists.primary?.[0]?.name || "unknown"} id={song.id} />
            ))}
          </div>
        ) : loading ? ( // Check for loading state
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
        ) : (
          // No loading, no data, and data is not null/undefined
          <div className="flex items-center justify-center text-center h-[100px]">
            <p className="text-sm text-muted-foreground">No recomandation for this song.</p> {/* Keeping user's spelling 'Recomandation' */}
          </div>
        )}
      </div>
    </section>
  );
}
