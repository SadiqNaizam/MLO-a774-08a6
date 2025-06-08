import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaCard from '@/components/MediaCard';
import { Button } from '@/components/ui/button';
import DoraemonThemedPlayerControls from '@/components/DoraemonThemedPlayerControls';
import { PlusSquare } from 'lucide-react';

// Define types
interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number;
}

interface MediaCardItem {
  id: string | number;
  title: string;
  artist?: string;
  imageUrl: string;
  type: 'album' | 'playlist' | 'artist';
}

// Placeholder data
const myPlaylists: MediaCardItem[] = [
  { id: 'lib_playlist_1', title: "Nobita's Favorites", artist: 'Curated by Nobita', imageUrl: 'https://source.unsplash.com/random/200x200?playlist,glasses,boy', type: 'playlist' },
  { id: 'lib_playlist_2', title: "Gian's Power Hour", artist: 'Loud and Proud', imageUrl: 'https://source.unsplash.com/random/200x201?playlist,strong,microphone', type: 'playlist' },
  { id: 'lib_playlist_3', title: "Shizuka's Study Mix", artist: 'Calm and Focused', imageUrl: 'https://source.unsplash.com/random/200x202?playlist,study,girl', type: 'playlist' },
];

const likedSongsAsAlbums: MediaCardItem[] = [ // Representing liked songs as playable collections for MediaCard
  { id: 'liked_collection_1', title: 'My Liked Songs Vol. 1', artist: 'Various Artists', imageUrl: 'https://source.unsplash.com/random/200x203?heart,music,collection', type: 'album' },
];

const savedAlbums: MediaCardItem[] = [
  { id: 'lib_album_1', title: 'Adventures in Time', artist: 'The Chrononauts', imageUrl: 'https://source.unsplash.com/random/200x204?album,time,clock', type: 'album' },
  { id: 'lib_album_2', title: 'Robotic Dreams', artist: 'Unit 731', imageUrl: 'https://source.unsplash.com/random/200x205?album,robot,future', type: 'album' },
];

const LibraryPage: React.FC = () => {
  console.log('LibraryPage loaded');

  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume);
  const handleSeek = (newProgress: number) => setProgress(newProgress);

  const handleMediaCardClick = (id: string | number, type: 'album' | 'playlist' | 'artist') => {
    console.log(`Library: Clicked on ${type} - ${id}`);
    // Example: Load a track or navigate
    const item = [...myPlaylists, ...likedSongsAsAlbums, ...savedAlbums].find(i => i.id === id);
    if (item) {
        setCurrentTrack({
            id: String(id),
            title: item.title,
            artist: item.artist || "Library Track",
            albumArtUrl: item.imageUrl,
            duration: 180 + Math.floor(Math.random() * 120)
        });
        setIsPlaying(true);
    }
  };
  
  const handleCreatePlaylist = () => {
      console.log("Create new playlist button clicked!");
      // Add navigation or modal logic here
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-400">Your Library</h1>
                <Button variant="ghost" onClick={handleCreatePlaylist} className="text-blue-300 hover:text-blue-200">
                    <PlusSquare className="mr-2 h-5 w-5" /> Create Playlist
                </Button>
            </div>
            
            <Tabs defaultValue="playlists" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="albums">Albums</TabsTrigger>
                <TabsTrigger value="liked">Liked Songs</TabsTrigger>
              </TabsList>
              <TabsContent value="playlists" className="mt-6">
                {myPlaylists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {myPlaylists.map(item => <MediaCard key={item.id} {...item} onClick={handleMediaCardClick} />)}
                    </div>
                ) : <p className="text-zinc-400 text-center py-8">You haven't created any playlists yet. Use Doraemon's Take-copter to fly to new music ideas!</p>}
              </TabsContent>
              <TabsContent value="albums" className="mt-6">
                 {savedAlbums.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {savedAlbums.map(item => <MediaCard key={item.id} {...item} onClick={handleMediaCardClick} />)}
                    </div>
                 ) : <p className="text-zinc-400 text-center py-8">No saved albums. Explore and save some musical treasures!</p>}
              </TabsContent>
              <TabsContent value="liked" className="mt-6">
                {/* Liked songs might be a list of SongRowItem, or a special MediaCard for "Liked Songs" playlist */}
                {likedSongsAsAlbums.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {likedSongsAsAlbums.map(item => <MediaCard key={item.id} {...item} onClick={handleMediaCardClick} />)}
                    </div>
                ) : <p className="text-zinc-400 text-center py-8">You haven't liked any songs yet. Find some tunes that make you use a happy gadget!</p>}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
        <DoraemonThemedPlayerControls
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          progress={progress}
          volume={volume}
          onPlayPause={handlePlayPause}
          onNext={() => console.log('Next track')}
          onPrevious={() => console.log('Previous track')}
          onSeek={handleSeek}
          onVolumeChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default LibraryPage;