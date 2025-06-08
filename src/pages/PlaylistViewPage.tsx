import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import SongRowItem from '@/components/SongRowItem';
import DoraemonThemedPlayerControls from '@/components/DoraemonThemedPlayerControls';
import { PlayCircle, Shuffle, Edit3, Trash2 } from 'lucide-react'; // Added Edit3 and Trash2

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
  artist?: string;
  album?: string;
  duration: string;
  imageUrl?: string;
  id: string; // Added id for unique key and playing logic
}

// Placeholder data for a specific playlist
const playlistDetails = {
  id: 'dora_playlist_view_1',
  name: "Doraemon's Adventure Mix",
  description: "A collection of upbeat and exciting tunes for all your gadget-fueled adventures! Perfect for when you're using the Anywhere Door or the Bamboo Copter.",
  coverImageUrl: 'https://source.unsplash.com/random/300x300?playlist,adventure,blue,robot',
  owner: 'Doraemon (You)', // To simulate user-owned playlist
  songs: [
    { id: 'song1', trackNumber: 1, title: 'Time Machine Journey', artist: 'The Chronos', album: 'Future Sounds', duration: '3:45', imageUrl: 'https://source.unsplash.com/random/40x40?time,machine' },
    { id: 'song2', title: 'Gadget Groove', artist: 'Tech Beats', album: 'Robotic Rhythms', duration: '4:02', imageUrl: 'https://source.unsplash.com/random/40x40?gadget,tech' },
    { id: 'song3', title: 'Sky High Anthem (Bamboo Copter Theme)', artist: 'Airborne Melodies', album: 'Flight Fantasy', duration: '2:58', imageUrl: 'https://source.unsplash.com/random/40x40?sky,copter' },
    { id: 'song4', title: 'Pocket Full of Wonders', artist: 'Miracle Workers', album: 'Magic Moments', duration: '3:20', imageUrl: 'https://source.unsplash.com/random/40x40?pocket,magic' },
    { id: 'song5', title: 'Friendship Power', artist: 'The Nobitas', album: 'Kindness Core', duration: '4:12', imageUrl: 'https://source.unsplash.com/random/40x40?friends,group' },
  ] as SongRowItemData[],
};


const PlaylistViewPage: React.FC = () => {
  console.log('PlaylistViewPage loaded');

  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [playlistName, setPlaylistName] = useState(playlistDetails.name);
  const [playlistDescription, setPlaylistDescription] = useState(playlistDetails.description);
  const [isEditing, setIsEditing] = useState(false);


  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume);
  const handleSeek = (newProgress: number) => setProgress(newProgress);

  const playSong = (song: SongRowItemData) => {
    setCurrentTrack({
      id: song.id,
      title: song.title,
      artist: song.artist || 'Unknown Artist',
      albumArtUrl: song.imageUrl || playlistDetails.coverImageUrl,
      duration: parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]),
    });
    setIsPlaying(true);
  };
  
  const playAll = (shuffle = false) => {
    const songsToPlay = shuffle ? [...playlistDetails.songs].sort(() => Math.random() - 0.5) : playlistDetails.songs;
    if (songsToPlay.length > 0) {
        playSong(songsToPlay[0]);
        // Here you'd typically queue up the rest of the songs
        console.log(shuffle ? "Shuffle playing all songs" : "Playing all songs");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
        // Save changes logic here (e.g., API call)
        playlistDetails.name = playlistName; // Mock save
        playlistDetails.description = playlistDescription; // Mock save
        console.log("Saved playlist details:", playlistName, playlistDescription);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Playlist Header */}
            <header className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-b from-blue-700/30 to-zinc-950/10 p-6 rounded-lg">
              <img 
                src={playlistDetails.coverImageUrl} 
                alt={playlistName} 
                className="w-48 h-48 md:w-56 md:h-56 rounded-md object-cover shadow-xl"
              />
              <div className="flex-1 space-y-3 text-center md:text-left">
                <p className="text-sm font-semibold text-blue-300">PLAYLIST</p>
                {isEditing ? (
                     <input type="text" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} className="text-4xl md:text-6xl font-bold bg-transparent border-b-2 border-blue-400 focus:outline-none py-1 w-full"/>
                ) : (
                    <h1 className="text-4xl md:text-6xl font-bold">{playlistName}</h1>
                )}
                {isEditing ? (
                     <textarea value={playlistDescription} onChange={(e) => setPlaylistDescription(e.target.value)} rows={3} className="text-sm text-zinc-300 bg-transparent border border-blue-400 rounded-md p-2 w-full focus:outline-none resize-none"/>
                ) : (
                    <p className="text-sm text-zinc-300">{playlistDescription}</p>
                )}
                <p className="text-xs text-zinc-400">Created by: {playlistDetails.owner} • {playlistDetails.songs.length} songs</p>
              </div>
            </header>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button onClick={() => playAll(false)} size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                <PlayCircle className="mr-2 h-6 w-6" /> Play
              </Button>
              <Button onClick={() => playAll(true)} variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-400/20">
                <Shuffle className="mr-2 h-5 w-5" /> Shuffle
              </Button>
              {playlistDetails.owner.includes("(You)") && ( // Show edit/delete if user owns it
                <>
                <Button onClick={handleEditToggle} variant="ghost" size="icon" className="text-zinc-400 hover:text-blue-300">
                    <Edit3 className="h-5 w-5" />
                </Button>
                 <Button onClick={() => console.log("Delete playlist clicked")} variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                </Button>
                </>
              )}
            </div>

            {/* Song List */}
            <div className="space-y-1">
              {playlistDetails.songs.map((song, index) => (
                <SongRowItem
                  key={song.id}
                  trackNumber={index + 1}
                  {...song}
                  onPlayPauseClick={() => playSong(song)}
                  isPlaying={currentTrack?.id === song.id && isPlaying}
                  isActive={currentTrack?.id === song.id}
                  onAddToPlaylistClick={() => console.log(`Add ${song.title} to another playlist`)}
                  onMoreOptionsClick={() => console.log(`More options for ${song.title}`)}
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
          onNext={() => console.log('Next track in playlist')}
          onPrevious={() => console.log('Previous track in playlist')}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default PlaylistViewPage;