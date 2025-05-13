"use client";

import Link from "next/link";
import { toast } from "sonner";
import { IoPause } from "react-icons/io5";
import Next from "@/components/cards/next";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NextContext } from "@/hooks/use-context"; // Assuming this path is correct
import { Skeleton } from "@/components/ui/skeleton";
import { useMusic } from "@/components/music-provider"; // Assuming this path is correct
import { useContext, useEffect, useRef, useState } from "react";
import { Download, Play, Repeat, Loader2, Repeat1, Share2 } from "lucide-react";

interface Image {
  url: string;
  quality?: string;
}

interface Artist {
  id?: string; // Assuming artist might have an id
  name: string;
}

interface DownloadUrl {
  url: string;
  quality?: string;
}

interface SongDetails {
  id: string;
  image: Image[];
  name: string;
  artists: {
    primary: Artist[];
  };
  downloadUrl: DownloadUrl[];
  // Add other song properties if they exist and are used
}

interface FetchSongResponse {
  data?: SongDetails[]; // API returns an array with the song at index 0
}

// Refine the type for NextContext based on observed usage
interface NextContextValue {
  nextData?: {
    id?: string;
    name?: string;
    artist?: string;
    image?: string;
  } | null;
}

interface PlayerProps {
  id: string;
}

export default function Player({ id }: PlayerProps) {
  const [data, setData] = useState<SongDetails | null>(null); // State for the single song data
  const [playing, setPlaying] = useState<boolean>(false); // Initialize playing state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");

  // Use the refined type for the context
  const next = useContext<NextContextValue | null>(NextContext);
  // Assuming useMusic hook returns a structure like this
  const { current, setCurrent } = useMusic() as { current: number | null; setCurrent: (time: number | null) => void };

  const getSong = async (): Promise<void> => {
    try {
      const get = await fetch(`http://localhost:3000/api/songs?id=${id}`);
      if (!get.ok) {
        console.error(`Failed to fetch song with ID "${id}": ${get.status}`);
        setData(null);
        setAudioURL("");
        return;
      }
      const result: FetchSongResponse = await get.json();
      const song = result?.data?.[0]; // Safely access the first song in the data array

      if (song) {
        setData(song);
        // Prioritize higher quality download URLs
        if (song.downloadUrl?.[2]?.url) setAudioURL(song.downloadUrl[2].url);
        else if (song.downloadUrl?.[1]?.url) setAudioURL(song.downloadUrl[1].url);
        else if (song.downloadUrl?.[0]?.url) setAudioURL(song.downloadUrl[0].url);
        else setAudioURL(""); // Set empty if no download URLs found
      } else {
        setData(null);
        setAudioURL("");
      }
    } catch (error) {
      console.error(`Error fetching song with ID "${id}":`, error);
      setData(null);
      setAudioURL("");
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const togglePlayPause = (): void => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        localStorage.setItem("p", "false");
      } else {
        audioRef.current.play().catch(error => {
          console.error("Failed to play audio:", error);
          // Handle play error, e.g., due to user gesture requirement
        });
        localStorage.setItem("p", "true");
      }
      setPlaying(!playing);
    }
  };

  const downloadSong = async (): Promise<void> => {
    if (!audioURL) {
      toast.error("No audio URL available for download.");
      return;
    }
    setIsDownloading(true);
    try {
      const response = await fetch(audioURL);
      if (!response.ok) {
        console.error(`Failed to fetch audio for download: ${response.status}`);
        toast.error("Failed to download song.");
        setIsDownloading(false);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Use optional chaining for data.name
      a.download = `${data?.name || "song"}.mp3`;
      document.body.appendChild(a); // Append to body is sometimes necessary
      a.click();
      document.body.removeChild(a); // Clean up
      URL.revokeObjectURL(url);
      toast.success("Downloaded successfully!");
    } catch (error) {
      console.error("Error during download:", error);
      toast.error("Something went wrong during download!");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSeek = (e: number[]): void => {
    if (audioRef.current && e.length > 0) {
      const seekTime = e[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const loopSong = (): void => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsLooping(!isLooping);
    }
  };

  const handleShare = (): void => {
    // Check if the Web Share API is available and if data exists
    if (navigator.share && data) {
      try {
        navigator.share({ url: `https://${window.location.host}/${data.id}`, title: data.name, text: `Listen to "${data.name}" on AudioSphere` });
      } catch (e) {
        console.error("Error sharing:", e);
        toast.error("Failed to share.");
      }
    } else {
      toast.info("Share not supported or song data not available.");
    }
  };

  // Effect to load the song and set up time update listener
  useEffect(() => {
    getSong();
    localStorage.setItem("last-played", id);

    // The logic with localStorage.removeItem("p") and setting currentTime based on 'current'
    // from useMusic might need careful consideration for initial playback state.
    // It's removed for now to simplify initial load behavior.
    // localStorage.removeItem("p");
    // if (current !== null && audioRef.current) {
    //   audioRef.current.currentTime = parseFloat(current + ''); // Ensure 'current' is treated as number
    // }

    const handleTimeUpdate = (): void => {
      if (audioRef.current) {
        try {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
          // Update music context's current time
          if (setCurrent) {
            setCurrent(audioRef.current.currentTime);
          }
        } catch (e) {
          console.error("Error in timeupdate handler:", e);
          setPlaying(false);
        }
      }
    };

    // Event listeners should be added only after the audio element is available
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      // Add loadedmetadata listener to get duration initially
      audioRef.current.addEventListener("loadedmetadata", handleTimeUpdate);
    }

    return () => {
      // Clean up event listeners
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleTimeUpdate);
      }
    };
  }, [id, getSong, setCurrent]); // Add getSong and setCurrent to dependencies

  // Effect to handle redirection to the next song
  useEffect(() => {
    const handleRedirect = (): void => {
      // Ensure duration is a finite positive number and not NaN
      if (currentTime >= duration && duration > 0 && !isLooping && next?.nextData?.id) {
        // Use next/link or router.push for navigation in Next.js client components
        // window.location.href = `https://${window.location.host}/${next?.nextData?.id}`;
        console.log(`Song finished, redirecting to next song ID: ${next.nextData.id}`);
        // Replace with actual navigation logic, e.g.:
        // router.push(`/${next.nextData.id}`);
      }
    };

    // Only set up the redirect logic if not looping and duration is known
    if (!isLooping && duration > 0) {
      // This effect logic might need refinement based on how playback completion is precisely determined.
      // Checking currentTime >= duration can sometimes be unreliable due to floating point inaccuracies.
      // The 'ended' event on the audio element is usually a more robust way to detect playback completion.
      // Let's add an 'ended' event listener instead.
    }

    // Remove the previous redirect logic based on currentTime >= duration
    // and instead rely on the 'ended' event in the first useEffect.
  }, [isLooping, duration, next?.nextData?.id]); // Dependencies for the redirect logic

  // Effect to handle initial playback state based on localStorage or autoplay prop
  useEffect(() => {
    if (audioRef.current) {
      // Check if autoplay is desired or if localStorage indicates playing
      const shouldPlay = playing; // Assuming 'playing' state reflects desired initial state or autoplay prop
      if (shouldPlay) {
        audioRef.current.play().catch(error => {
          console.error("Failed to autoplay:", error);
          // Handle autoplay blocked by browser
          setPlaying(false); // Update state to reflect that playback didn't start
        });
      }
    }
  }, [audioURL, playing]); // Rerun if audioURL or initial playing state changes

  return (
    <div className="mb-3 mt-10">
      {/* onLoadedData can also set duration */}
      <audio
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          // Use 'ended' event for playback completion
          setIsLooping(false); // Stop looping when ended if it was looping
          if (next?.nextData?.id) {
            // Trigger navigation to the next song
            console.log(`Song ended, triggering navigation to next song ID: ${next.nextData.id}`);
            // Implement actual navigation here, e.g., using router.push
            // router.push(`/${next.nextData.id}`);
          }
        }}
        onLoadedMetadata={() => {
          // Use loadedmetadata to get duration reliably
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        autoPlay={playing} // Use the playing state to control autoplay
        src={audioURL}
        ref={audioRef}></audio>
      <div className="grid gap-6 w-full">
        <div className="sm:flex px-6 md:px-20 lg:px-32 grid gap-5 w-full">
          <div>
            {!data ? ( // Check if data is null
              <Skeleton className="md:w-[130px] aspect-square rounded-2xl md:h-[150px]" />
            ) : (
              <div className="relative">
                {/* Use optional chaining for image access */}
                <img src={data.image?.[2]?.url} alt={data.name} className="sm:h-[150px] h-full aspect-square bg-secondary/50 rounded-2xl sm:w-[200px] w-full sm:mx-0 mx-auto object-cover" />
                {/* Use optional chaining for image access */}
                <img src={data.image?.[2]?.url} className="hidden dark:block absolute top-0 left-0 w-[110%] h-[110%] blur-3xl -z-10 opacity-50" />
              </div>
            )}
          </div>
          {!data ? ( // Check if data is null
            <div className="flex flex-col justify-between w-full">
              <div>
                <Skeleton className="h-4 w-36 mb-2" /> <Skeleton className="h-3 w-16 mb-4" />
              </div>
              <div>
                <Skeleton className="h-4 w-full rounded-full mb-2" />
                <div className="w-full flex items-center justify-between">
                  <Skeleton className="h-[9px] w-6" /> <Skeleton className="h-[9px] w-6" />
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="h-10 w-10" /> <Skeleton className="h-10 w-10" /> <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between w-full">
              <div className="sm:mt-0 mt-3">
                <h1 className="text-xl font-bold md:max-w-lg">{data.name}</h1>
                <p className="text-sm text-muted-foreground">
                  by
                  {/* Use optional chaining for artists and their name */}
                  <Link href={"/search/" + `${encodeURI(data.artists.primary?.[0]?.name?.toLowerCase().split(" ").join("+") || "")}`} className="text-foreground">
                    {data.artists.primary?.[0]?.name || "unknown"}
                  </Link>
                </p>
              </div>
              <div className="grid gap-2 w-full mt-5 sm:mt-0">
                <Slider onValueChange={handleSeek} value={[currentTime]} max={duration} className="w-full" />
                <div className="w-full flex items-center justify-between">
                  <span className="text-sm">{formatTime(currentTime)}</span> <span className="text-sm">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center mt-1 justify-between w-full sm:mt-2">
                  <Button variant={playing ? "default" : "secondary"} className="gap-1 rounded-full" onClick={togglePlayPause}>
                    {playing ? <IoPause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Pause" : "Play"}
                  </Button>
                  <div className="flex items-center gap-2 sm:gap-3 sm:mt-0">
                    <Button size="icon" variant="ghost" onClick={loopSong}>
                      {!isLooping ? <Repeat className="h-4 w-4" /> : <Repeat1 className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={downloadSong} disabled={isDownloading || !audioURL}>
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleShare} disabled={!data}>
                      {" "}
                      {/* Disable share if no data */}
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Use optional chaining for next.nextData */}
      {next?.nextData && (
        <div className="mt-10 -mb-3 px-6 md:px-20 lg:px-32">
          {/* Use optional chaining for next.nextData properties */}
          <Next name={next.nextData.name} artist={next.nextData.artist} image={next.nextData.image} id={next.nextData.id} />
        </div>
      )}
    </div>
  );
}
