"use client";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { IoPause } from "react-icons/io5";
import Next from "@/components/cards/next";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NextContext } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useMusic } from "@/components/music-provider";
import { useContext, useEffect, useRef, useState } from "react";
import { Download, Play, Repeat, Loader2, Repeat1, Share2 } from "lucide-react";

interface SongData {
  id: string;
  name: string;
  image: { url: string }[];
  artists: { primary: { name: string }[] };
  downloadUrl: { url: string }[];
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
  const next = useContext(NextContext);
  const { current, setCurrent } = useMusic();

  const getSong = async () => {
    const get = await fetch(`http://localhost:3000/api/songs?id=${id}`);
    const data = await get.json();
    setData(data.data[0]);
    if (data?.data[0]?.downloadUrl[2]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
    } else if (data?.data[0]?.downloadUrl[1]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
    } else {
      setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
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
    if (!audioURL || !data) return;

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
      toast.success("downloaded");
    } catch (error) {
      console.error("Error downloading song:", error);
      toast.error("Something went wrong during download!");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSeek = (e: number[]) => {
    const seekTime = e[0];
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
    if (!data) return;
    try {
      if (navigator.share) {
        navigator.share({ url: `https://${window.location.host}/${data.id}` });
      } else {
        toast.error("Share not supported on this browser.");
      }
    } catch (e) {
      console.error("Error sharing:", e);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getSong();
    localStorage.setItem("last-played", id);
    localStorage.removeItem("p");

    if (audioRef.current && current) {
      audioRef.current.currentTime = parseFloat(current + 1);
    }

    const handleTimeUpdate = () => {
      try {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
          setCurrent(audioRef.current.currentTime);
        }
      } catch (e) {
        setPlaying(false);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [id]); // Added id to dependency array

  useEffect(() => {
    const handleRedirect = () => {
      if (currentTime === duration && !isLooping && duration !== 0 && next?.nextData?.id) {
        window.location.href = `https://${window.location.host}/${next.nextData.id}`;
      }
    };
    if (isLooping || duration === 0) return;
    handleRedirect(); // Call the function directly
  }, [currentTime, duration, isLooping, next?.nextData?.id]);

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
                  <Link href={"/search/" + `${encodeURIComponent(data.artists.primary[0]?.name?.toLowerCase()?.split(" ")?.join("+") || "")}`} className="text-foreground">
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
