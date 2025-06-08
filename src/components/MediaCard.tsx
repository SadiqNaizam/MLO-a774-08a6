import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlayCircle } from 'lucide-react'; // Icon for play button overlay

interface MediaCardProps {
  id: string | number;
  title: string;
  artist?: string; // Artist or description
  imageUrl: string;
  type: 'album' | 'playlist' | 'artist'; // To style or behave differently
  onClick?: (id: string | number, type: 'album' | 'playlist' | 'artist') => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  artist,
  imageUrl,
  type,
  onClick,
}) => {
  console.log("Rendering MediaCard:", title, type);

  const handleCardClick = () => {
    if (onClick) {
      onClick(id, type);
    }
    console.log(`MediaCard clicked: ${title} (ID: ${id}, Type: ${type})`);
  };

  return (
    <Card
      className="w-full max-w-[200px] bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 transition-all duration-200 ease-in-out cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={1 / 1} className="bg-zinc-700">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle className="h-12 w-12 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-1">
        <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>
        {artist && <CardDescription className="text-xs text-zinc-400 truncate">{artist}</CardDescription>}
      </CardContent>
    </Card>
  );
}
export default MediaCard;