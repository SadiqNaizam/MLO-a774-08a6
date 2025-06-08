import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider'; // shadcn Slider
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Shuffle, Repeat } from 'lucide-react';

interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number; // in seconds
}

interface DoraemonThemedPlayerControlsProps {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
  progress: number; // current playback time in seconds
  volume: number; // 0 to 1
  isShuffle?: boolean;
  isRepeat?: 'off' | 'one' | 'all';
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onToggleFullScreen?: () => void; // Optional full screen toggle
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const DoraemonThemedPlayerControls: React.FC<DoraemonThemedPlayerControlsProps> = ({
  currentTrack,
  isPlaying,
  progress,
  volume,
  isShuffle = false,
  isRepeat = 'off',
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFullScreen
}) => {
  console.log("Rendering DoraemonThemedPlayerControls. Track:", currentTrack?.title, "Playing:", isPlaying);

  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(volume === 0);
  const [seekValue, setSeekValue] = useState(progress);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentVolume(volume);
    setIsMuted(volume === 0);
  }, [volume]);

  useEffect(() => {
    // Only update seek slider if not actively being dragged
    if (!seekTimeoutRef.current) {
      setSeekValue(progress);
    }
  }, [progress]);

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0] / 100;
    setCurrentVolume(vol);
    setIsMuted(vol === 0);
    onVolumeChange(vol);
  };

  const toggleMute = () => {
    if (isMuted) {
      onVolumeChange(currentVolume > 0 ? currentVolume : 0.5); // Restore or set default
      setIsMuted(false);
    } else {
      onVolumeChange(0);
      setIsMuted(true);
    }
  };
  
  const handleSeekChange = (newSeekValue: number[]) => {
    setSeekValue(newSeekValue[0]);
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }
    seekTimeoutRef.current = setTimeout(() => {
      onSeek(newSeekValue[0]);
      seekTimeoutRef.current = null;
    }, 200); // Debounce seek
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-blue-100 border-t border-blue-300 flex items-center justify-center text-blue-700">
        No track selected. Choose a song to start listening!
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-gradient-to-r from-blue-400 to-sky-300 text-white p-3 shadow-2xl flex items-center justify-between z-50">
      {/* Track Info */}
      <div className="flex items-center space-x-3 w-1/4">
        <AspectRatio ratio={1 / 1} className="w-14 h-14 rounded overflow-hidden shadow-md">
          <img
            src={currentTrack.albumArtUrl || '/placeholder.svg'}
            alt={currentTrack.title}
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        <div>
          <p className="text-sm font-semibold truncate max-w-[150px]">{currentTrack.title}</p>
          <p className="text-xs text-blue-900 truncate max-w-[150px]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Player Controls & Progress Bar */}
      <div className="flex flex-col items-center justify-center w-1/2 space-y-1">
        <div className="flex items-center space-x-3">
            {onToggleShuffle && (
                <Button variant="ghost" size="icon" onClick={onToggleShuffle} className={`hover:bg-blue-500/50 ${isShuffle ? 'text-yellow-300' : 'text-white'}`}>
                    <Shuffle className="h-5 w-5" />
                </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onPrevious} className="hover:bg-blue-500/50 text-white">
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button
            variant="ghost"
            size="icon"
            onClick={onPlayPause}
            className="bg-white text-blue-500 hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
            >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext} className="hover:bg-blue-500/50 text-white">
            <SkipForward className="h-5 w-5" />
            </Button>
            {onToggleRepeat && (
                <Button variant="ghost" size="icon" onClick={onToggleRepeat} className={`hover:bg-blue-500/50 ${isRepeat !== 'off' ? 'text-yellow-300' : 'text-white'}`}>
                    <Repeat className={`h-5 w-5 ${isRepeat === 'one' ? 'animate-pulse' : ''}`} />
                </Button>
            )}
        </div>
        <div className="flex items-center w-full max-w-md space-x-2">
          <span className="text-xs w-10 text-right">{formatTime(seekValue)}</span>
          <Slider
            min={0}
            max={currentTrack.duration || 100}
            step={1}
            value={[seekValue]}
            onValueChange={handleSeekChange}
            className="[&>span:first-child]:h-full [&>span:first-child>span]:bg-yellow-300 [&>span:first-child]:bg-blue-200/50" // Doraemon themed slider
          />
          <span className="text-xs w-10">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Volume & Other Controls */}
      <div className="flex items-center space-x-3 w-1/4 justify-end">
        <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-blue-500/50 text-white">
          {isMuted || currentVolume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[currentVolume * 100]}
          onValueChange={handleVolumeChange}
          className="w-24 [&>span:first-child]:h-full [&>span:first-child>span]:bg-yellow-300 [&>span:first-child]:bg-blue-200/50" // Doraemon themed slider
        />
        {onToggleFullScreen && (
             <Button variant="ghost" size="icon" onClick={onToggleFullScreen} className="hover:bg-blue-500/50 text-white">
                <Maximize2 className="h-5 w-5" />
            </Button>
        )}
      </div>
    </div>
  );
}
export default DoraemonThemedPlayerControls;