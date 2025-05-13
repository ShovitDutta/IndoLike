import Link from "next/link";
import { Badge } from "../ui/badge";
import { Play } from "lucide-react";

// Define the type for the props of the Next component
interface NextProps {
  name: string;
  artist: string;
  image: string;
  id: string; // Assuming id is always a string
  next?: boolean; // Optional boolean prop with a default value
}

export default function Next({ name, artist, image, id, next = true }: NextProps) {
  return (
    <Link href={`/${id}`}>
      {" "}
      {/* Use the id for the link */}
      <div className="flex items-center gap-3 bg-secondary p-2 rounded-md">
        {/* Render image */}
        <img src={image} className="aspect-square w-10 rounded-md" alt={name} /> {/* Added alt text for accessibility */}
        <div className="overflow-hidden flex-1">
          {/* Render song name */}
          <h1 className="text-secondary-foreground text-base text-ellipsis whitespace-nowrap overflow-hidden sm:max-w-md max-w-[150px]">{name}</h1>
          {/* Render artist name */}
          <p className="-mt-0.5 mb-1 text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            by <span className="text-secondary-foreground">{artist}</span>
          </p>
        </div>
        {/* Conditionally render badges */}
        {next && <Badge className="!font-normal">next</Badge>}
        {!next && (
          <Badge>
            <Play size={16} className="w-3 px-0 h-4" />
          </Badge>
        )}
      </div>
    </Link>
  );
}
