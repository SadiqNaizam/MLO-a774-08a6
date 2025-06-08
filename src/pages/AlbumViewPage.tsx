import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import SongRowItem from '@/components/SongRowItem';
import DoraemonThemedPlayerControls from '@/components/DoraemonThemedPlayerControls';
import { PlayCircle, Shuffle, Heart, Dot } from 'lucide-react';

// Define types
interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number;
}

interface SongRowItemData {
  trackNumber?: number;
  title: string;
  artist?: string; // Artist might be same as album artist, but can vary for compilations
  duration: string;
  id: string;
  // No album prop here as it's implicit from the page
  // No imageUrl for individual tracks if using album art consistently
}

// Placeholder data for a specific album
const albumDetails = {
  id: 'dora_album_view_1',
  name: "Doraemon's Future Anthems",
  artist: 'The 22nd Century Beats',
  releaseDate: '2024',
  coverImageUrl: 'https://source.unsplash.com/random/300x301?album,future,blue,robot',
  description: "An electrifying collection of tracks inspired by Doraemon's amazing gadgets and timeless adventures. Get ready to groove to the sound of the future!",
  songs: [
    { id: 'album_song1', trackNumber: 1, title: 'Anthem of Tomorrow', artist: 'The 22nd Century Beats', duration: '3:50' },
    { id: 'album_song2', title: 'Bell of Happiness', artist: 'The 22nd Century Beats', duration: '4:10' },
    { id: 'album_song3', title: 'Anywhere Door Portal Pop', artist: 'The 22nd Century Beats', duration: '3:33' },
    { id: 'album_song4', title: 'Time Kerchief Rewind', artist: 'The 22nd Century Beats', duration: '4:05' },
    { id: 'album_song5', title: 'Memory Bread Ballad', artist: 'The 22nd Century Beats', duration: '2:55' },
  ] as SongRowItemData[],
};

const AlbumViewPage: React.FC = () => {
  console.log('AlbumViewPage loaded');

  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [isAlbumLiked, setIsAlbumLiked] = useState(false);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume);
  const handleSeek = (newProgress: number) => setProgress(newProgress);

  const playSong = (song: SongRowItemData) => {
    setCurrentTrack({
      id: song.id,
      title: song.title,
      artist: song.artist || albumDetails.artist,
      albumArtUrl: albumDetails.coverImageUrl, // All songs from album share cover
      duration: parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]),
    });
    setIsPlaying(true);
  };

  const playAll = (shuffle = false) => {
    const songsToPlay = shuffle ? [...albumDetails.songs].sort(() => Math.random() - 0.5) : albumDetails.songs;
    if (songsToPlay.length > 0) {
        playSong(songsToPlay[0]);
        console.log(shuffle ? "Shuffle playing album" : "Playing album");
    }
  };
  
  const toggleLikeAlbum = () => setIsAlbumLiked(!isAlbumLiked);


  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Album Header */}
            <header className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-sky-600/30 to-zinc-950/10 p-6 rounded-lg">
              <img 
                src={albumDetails.coverImageUrl} 
                alt={albumDetails.name} 
                className="w-48 h-48 md:w-56 md:h-56 rounded-md object-cover shadow-xl"
              />
              <div className="flex-1 space-y-2 text-center md:text-left">
                <p className="text-sm font-semibold text-sky-300">ALBUM</p>
                <h1 className="text-4xl md:text-6xl font-bold">{albumDetails.name}</h1>
                <div className="flex items-center justify-center md:justify-start text-sm text-zinc-300 space-x-1">
                    <span>{albumDetails.artist}</span>
                    <Dot />
                    <span>{albumDetails.releaseDate}</span>
                    <Dot />
                    <span>{albumDetails.songs.length} songs</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{albumDetails.description}</p>
              </div>
            </header>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button onClick={() => playAll(false)} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white">
                <PlayCircle className="mr-2 h-6 w-6" /> Play Album
              </Button>
              <Button onClick={() => playAll(true)} variant="outline" className="border-sky-400 text-sky-300 hover:bg-sky-400/20">
                <Shuffle className="mr-2 h-5 w-5" /> Shuffle
              </Button>
              <Button onClick={toggleLikeAlbum} variant="ghost" size="icon" className={`text-zinc-400 hover:text-red-500 ${isAlbumLiked ? 'text-red-500' : ''}`}>
                <Heart className={`h-6 w-6 ${isAlbumLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Song List */}
            <div className="space-y-1">
              {albumDetails.songs.map((song, index) => (
                <SongRowItem
                  key={song.id}
                  trackNumber={index + 1}
                  title={song.title}
                  artist={song.artist || albumDetails.artist} // Fallback to album artist
                  duration={song.duration}
                  // No individual imageUrl, player will use album cover
                  onPlayPauseClick={() => playSong(song)}
                  isPlaying={currentTrack?.id === song.id && isPlaying}
                  isActive={currentTrack?.id === song.id}
                  onAddToPlaylistClick={() => console.log(`Add ${song.title} to a playlist`)}
                  // No album field as it's implicit
                />
              ))}
            </div>
          </div>
        </ScrollArea>
        <DoraemonThemedPlayerControls
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          progress={progress}
          volume={volume}
          onPlayPause={handlePlayPause}
          onNext={() => console.log('Next track in album')}
          onPrevious={() => console.log('Previous track in album')}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AlbumViewPage;