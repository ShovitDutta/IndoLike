"use client";

import Link from "next/link";
import { toast } from "sonner"; // Assuming sonner is installed
import { IoPause } from "react-icons/io5"; // Assuming react-icons is installed
import Next from "@/components/cards/next"; // Assuming Next component will be created in TSX
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Assuming Slider will be created in TSX
import { NextContext, NextContextType } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useMusic } from "@/components/music-provider";
import { useContext, useEffect, useRef, useState } from "react";
import { Download, Play, Repeat, Loader2, Repeat1, Share2 } from "lucide-react";
import React from "react";

// Define types for the fetched song data
interface SongData {
  id: string;
  name: string;
  image: { url: string }[];
  artists: { primary: { name: string }[] };
  downloadUrl: { url: string }[];
  album?: { name?: string; url?: string };
  releaseDate?: string;
}

interface PlayerProps {
  id: string;
}

export default function Player({ id }: PlayerProps) {
  const [data, setData] = useState<SongData | null>(null);
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const next = useContext<NextContextType | null>(NextContext);
  const { current, setCurrent } = useMusic();

  const getSong = async () => {
    try {
      const get = await fetch(`http://localhost:3000/api/songs?id=${id}`);
      const data = await get.json();
      if (data?.data?.[0]) {
        const songData: SongData = data.data[0];
        setData(songData);
        if (songData.downloadUrl?.[2]?.url) setAudioURL(songData.downloadUrl[2].url);
        else if (songData.downloadUrl?.[1]?.url) setAudioURL(songData.downloadUrl[1].url);
        else if (songData.downloadUrl?.[0]?.url) setAudioURL(songData.downloadUrl[0].url);
      }
    } catch (error) {
      console.error("Error fetching song:", error);
      setData(null); // Set data to null on error
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        localStorage.setItem("p", "false");
      } else {
        audioRef.current.play();
        localStorage.setItem("p", "true");
      }
      setPlaying(!playing);
    }
  };

  const downloadSong = async () => {
    if (!audioURL || !data?.name) {
      toast.error("Audio URL or song data not available.");
      return;
    }
    setIsDownloading(true);
    try {
      const response = await fetch(audioURL);
      const datas = await response.blob();
      const url = URL.createObjectURL(datas);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.name}.mp3`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded");
    } catch (e) {
      console.error("Error downloading song:", e);
      toast.error("Something went wrong during download!");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const loopSong = () => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsLooping(!isLooping);
    }
  };

  const handleShare = () => {
    if (!data?.id || typeof window === 'undefined') {
      toast.error("Song data or window object not available.");
      return;
    }
    try {
      if (navigator.share) {
        navigator.share({ url: `${window.location.origin}/${data.id}` });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${window.location.origin}/${data.id}`);
        toast.success("Link copied to clipboard!");
      }
    } catch (e) {
      console.error("Error sharing song:", e);
      toast.error("Something went wrong during sharing!");
    }
  };

  useEffect(() => {
    getSong();
    if (typeof window !== 'undefined') {
      localStorage.setItem("last-played", id);
      localStorage.removeItem("p"); // Consider if this is intended or should be handled differently
    }

    const audio = audioRef.current;
    if (audio) {
      if (current !== null) {
        audio.currentTime = parseFloat(current.toString()); // Ensure current is treated as number
      }

      const handleTimeUpdate = () => {
        try {
          setCurrentTime(audio.currentTime);
          setDuration(audio.duration);
          setCurrent(audio.currentTime);
        } catch (e) {
          console.error("Error in timeupdate handler:", e);
          setPlaying(false);
        }
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (audio) {
          audio.removeEventListener("timeupdate", handleTimeUpdate);
        }
      };
    }
  }, [id]); // Added id to dependency array

  useEffect(() => {
    const handleRedirect = () => {
      if (currentTime > 0 && currentTime === duration && !isLooping && duration !== 0 && next?.nextData?.id) {
        window.location.href = `${window.location.origin}/${next.nextData.id}`;
      }
    };

    // Only call handleRedirect if audio is playing and not looping, and duration is known
    if (!playing || isLooping || duration === 0) return;

    // Use a small tolerance for floating point comparison
    const tolerance = 0.1;
    if (Math.abs(currentTime - duration) < tolerance) {
        handleRedirect();
    }

  }, [currentTime, duration, isLooping, next?.nextData?.id, playing]); // Added playing to dependency array

  return (
    <div className="mb-3 mt-10">
      <audio
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        autoPlay={playing}
        src={audioURL}
        ref={audioRef}
      ></audio>
      <div className="grid gap-6 w-full">
        <div className="sm:flex px-6 md:px-20 lg:px-32 grid gap-5 w-full">
          <div>
            {!data ? (
              <Skeleton className="md:w-[130px] aspect-square rounded-2xl md:h-[150px]" />
            ) : (
              <div className="relative">
                <img src={data.image[2]?.url} className="sm:h-[150px] h-full aspect-square bg-secondary/50 rounded-2xl sm:w-[200px] w-full sm:mx-0 mx-auto object-cover" alt={data.name} />
                <img src={data.image[2]?.url} className="hidden dark:block absolute top-0 left-0 w-[110%] h-[110%] blur-3xl -z-10 opacity-50" alt={`${data.name} blurred background`} />
              </div>
            )}
          </div>
          {!data ? (
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
                  <Link href={"/search/" + `${encodeURI(data.artists.primary[0]?.name?.toLowerCase().split(" ").join("+") || "")}`} className="text-foreground">
                    {data.artists.primary[0]?.name || "unknown"}
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
                    <Button size="icon" variant="ghost" onClick={downloadSong}>
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {next?.nextData && (
        <div className="mt-10 -mb-3 px-6 md:px-20 lg:px-32">
          <Next name={next.nextData.name} artist={next.nextData.artist} image={next.nextData.image} id={next.nextData.id} />
        </div>
      )}
    </div>
  );
}