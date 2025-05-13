"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, SearchIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SetStateAction, useEffect, useState } from "react";
import { Credenza, CredenzaBody, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaTrigger } from "@/components/ui/credenza";

interface Image {
  url: string;
  quality?: string; // Assuming quality might be present based on previous examples
}

interface Artist {
  id?: string; // Assuming artist might have an id
  name: string;
}

interface SongResult {
  id: string;
  image: Image[];
  name: string;
  artists: {
    primary: Artist[];
  };
  // Add other song properties if returned by the search API and used
}

interface SearchResponse {
  data?: {
    results?: SongResult[];
    // Include other properties if the search API response has them
  };
  // Include other potential top-level properties in the API response
}

export default function AdvanceSearch() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getSongs = async (): Promise<void> => {
    if (query.trim() === "") {
      setData([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/search/songs?query=${query}`);
      // Use the defined interface for the API response structure
      const result: SearchResponse = await response.json();

      if (result.data && result.data.results) {
        setData(result.data.results);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setData([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      const handler = setTimeout(() => {
        getSongs();
      }, 400);

      return () => {
        clearTimeout(handler);
      };
    } else {
      setData([]); // Clear data when query is empty
    }
  }, [query]); // Rerun effect when query changes

  return (
    <div className="px-6 !-mb-3 md:px-20 lg:px-32">
      <Credenza>
        <CredenzaTrigger asChild>
          <div className="flex items-center relative z-10 w-full">
            <div className="flex bg-secondary/50 text-foreground/80 items-center h-10 w-full rounded-lg border border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              Look for songs by name...
            </div>
            <Button size="icon" variant="ghost" className="absolute right-0 rounded-xl rounded-l-none bg-none">
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle className="text-left flex gap-2">
              <Input
                autoFocus={query === ""} // Use strict equality
                value={query}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setQuery(e.target.value)}
                className="w-full"
                type="search"
                name="query"
                placeholder="Search for songs by name..."
                autoComplete="off"
              />
              {/* Conditionally render Link or Button based on query */}
              {query.trim() !== "" ? ( // Use trim and check for non-empty query
                <Button className="min-w-10" size="icon" asChild>
                  <Link href={`/search/${query.trim()}`}>
                    {" "}
                    {/* Use trimmed query in link */}
                    <Search className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button className="min-w-10" size="icon">
                  {" "}
                  {/* No asChild when no query */}
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody className="text-left grid gap-2 mb-5 px-0">
            {loading && (
              <div className="flex h-[400px] w-full items-center justify-center text-sm text-muted-foreground">
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Searching...
              </div>
            )}
            {!loading &&
              data.length === 0 &&
              query.trim() !== "" && ( // Check for non-empty trimmed query
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-sm text-muted-foreground">No results found!</p>
                </div>
              )}
            {!query.trim() &&
              !loading && ( // Check for empty trimmed query
                <div className="flex items-center justify-center h-[400px]">
                  <p className="text-sm text-muted-foreground">Type something to search..</p>
                </div>
              )}
            {query.trim() !== "" &&
              !loading &&
              data.length > 0 && ( // Check for non-empty trimmed query and data
                <>
                  <div className="px-4 md:px-0">
                    <h1 className="text-sm text-foreground/70">
                      Search results for <span className="bg-primary/70 text-primary-foreground">{query}</span>
                    </h1>
                  </div>
                  <ScrollArea className="h-[390px] md:px-0 px-4">
                    <div className="flex flex-col gap-2">
                      {/* Data length check is redundant here as it's already checked in the parent condition */}
                      {data.map(song => (
                        <Link className="w-full hover:bg-secondary/30 border border-border rounded-md p-3 flex items-center justify-between gap-3" key={song.id} href={`/${song.id}`}>
                          <div className="flex items-center gap-3">
                            {/* Use optional chaining for image access */}
                            <img src={song.image?.[2]?.url} alt={song.name} className="bg-secondary/50 w-8 h-8 rounded-md" />
                            <p className="text-sm grid">
                              {song.name.slice(0, 40)} {song.name.length > 40 && "..."}
                              {/* Use optional chaining for artist name */}
                              <span className="text-muted-foreground">{song.artists.primary?.[0]?.name || "unknown"}</span>
                            </p>
                          </div>
                          <Button size="icon" className="min-w-10" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
