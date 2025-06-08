import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Plus, Check, MoreHorizontal } from 'lucide-react'; // Example icons

interface SongRowItemProps {
  trackNumber?: number; // Optional track number
  title: string;
  artist?: string;
  album?: string; // Optional album name
  duration: string; // Formatted duration string e.g., "3:45"
  imageUrl?: string; // Optional small image/album art
  isPlaying?: boolean; // Is this song currently playing?
  isActive?: boolean; // Is this song currently selected/active (but maybe paused)?
  isAddedToPlaylist?: boolean; // Example state
  onPlayPauseClick?: () => void; // Click on the row or a play button
  onAddToPlaylistClick?: () => void;
  onMoreOptionsClick?: () => void;
}

const SongRowItem: React.FC<SongRowItemProps> = ({
  trackNumber,
  title,
  artist,
  album,
  duration,
  imageUrl,
  isPlaying = false,
  isActive = false,
  isAddedToPlaylist = false,
  onPlayPauseClick,
  onAddToPlaylistClick,
  onMoreOptionsClick,
}) => {
  console.log("Rendering SongRowItem:", title, "isActive:", isActive, "isPlaying:", isPlaying);

  const activeClasses = isActive ? 'bg-zinc-700/50' : 'hover:bg-zinc-800';
  const textPlayingClasses = isPlaying ? 'text-blue-400' : 'text-white';

  return (
    <div
      className={`grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_minmax(0,_0.4fr)_minmax(0,_0.3fr)_auto_auto_auto] items-center gap-x-3 p-2 rounded-md transition-colors duration-150 ${activeClasses} group cursor-pointer`}
      onClick={onPlayPauseClick && !isPlaying ? onPlayPauseClick : undefined} // Allow click on row to play if not playing
    >
      {/* Track Number / Play/Pause Icon */}
      <div className="w-8 text-center text-sm text-zinc-400 group-hover:text-white flex items-center justify-center">
        {onPlayPauseClick ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[active=true]:opacity-100"
            data-active={isActive}
            onClick={(e) => { e.stopPropagation(); onPlayPauseClick(); }}
          >
            {isPlaying ? <Pause className="h-4 w-4 text-blue-400" /> : <Play className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-white'}`} />}
          </Button>
        ) : trackNumber ? (
          <span>{trackNumber}</span>
        ) : null}
        {isActive && !onPlayPauseClick && trackNumber && <span className={textPlayingClasses}>{trackNumber}</span>}
      </div>

      {/* Title & Artist (and Image) */}
      <div className="flex items-center space-x-3 overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt={title} className="h-10 w-10 rounded object-cover flex-shrink-0" />
        )}
        <div className="overflow-hidden">
          <p className={`font-medium truncate ${textPlayingClasses}`}>{title}</p>
          {artist && <p className="text-xs text-zinc-400 truncate group-hover:text-zinc-300">{artist}</p>}
        </div>
      </div>

      {/* Album (visible on larger screens) */}
      {album && <p className="text-sm text-zinc-400 truncate hidden md:block group-hover:text-zinc-300">{album}</p>}

      {/* Add to Playlist / More Options (only show on hover) */}
      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        {onAddToPlaylistClick && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={(e) => { e.stopPropagation(); onAddToPlaylistClick(); }}>
                {isAddedToPlaylist ? <Check className="h-4 w-4 text-blue-400" /> : <Plus className="h-4 w-4" />}
            </Button>
        )}
        {onMoreOptionsClick && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={(e) => { e.stopPropagation(); onMoreOptionsClick(); }}>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        )}
      </div>

      {/* Duration */}
      <p className="text-sm text-zinc-400 justify-self-end pr-2">{duration}</p>
    </div>
  );
}
export default SongRowItem;