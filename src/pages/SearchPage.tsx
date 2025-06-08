import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SongRowItem from '@/components/SongRowItem';
import MediaCard from '@/components/MediaCard';
import DoraemonThemedPlayerControls from '@/components/DoraemonThemedPlayerControls';
import { Search as SearchIcon } from 'lucide-react';

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

interface SongRowItemData {
  trackNumber?: number;
  title: string;
  artist?: string;
  album?: string;
  duration: string;
  imageUrl?: string;
}

// Placeholder data
const samplePlayerTrack: TrackInfo = {
  id: 'search_dummy_track_001',
  title: 'Search Result Tune',
  artist: 'Query Band',
  albumArtUrl: 'https://source.unsplash.com/random/100x100?music,search',
  duration: 150,
};

const allTracks: SongRowItemData[] = [
  { title: "Doraemon's Bell Sound", artist: "Effects Master", duration: "0:30", imageUrl: "https://source.unsplash.com/random/40x40?bell" },
  { title: "Future City Beat", artist: "Metro Bloom", album: "Cyber Grooves", duration: "3:12", imageUrl: "https://source.unsplash.com/random/40x40?city,future" },
  { title: "Anywhere Door Whoosh", artist: "SFX Team", duration: "0:05", imageUrl: "https://source.unsplash.com/random/40x40?door,portal" },
];

const allAlbums: MediaCardItem[] = [
  { id: 'album_sci_1', title: 'Sci-Fi Dreams', artist: 'Galaxy Orchestra', imageUrl: 'https://source.unsplash.com/random/200x200?album,scifi', type: 'album' },
  { id: 'album_robo_2', title: 'Robot Rhythms', artist: 'Circuit Breakers', imageUrl: 'https://source.unsplash.com/random/200x200?album,robot', type: 'album' },
];

const allArtists: MediaCardItem[] = [
    { id: 'artist_dora_1', title: 'Doraemon Singers', artist: 'Group', imageUrl: 'https://source.unsplash.com/random/200x200?artist,cartoon,blue', type: 'artist' },
    { id: 'artist_nobi_2', title: 'Nobita N.', artist: 'Solo', imageUrl: 'https://source.unsplash.com/random/200x200?artist,boy,glasses', type: 'artist' },
];

const SearchPage: React.FC = () => {
  console.log('SearchPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume);
  const handleSeek = (newProgress: number) => setProgress(newProgress);

  const playSong = (song: SongRowItemData) => {
    setCurrentTrack({
      id: song.title + (song.artist || ''), // simple id
      title: song.title,
      artist: song.artist || 'Unknown Artist',
      albumArtUrl: song.imageUrl || 'https://source.unsplash.com/random/100x100?music,notes',
      duration: parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1]),
    });
    setIsPlaying(true);
  };
  
  const playMediaItem = (item: MediaCardItem) => {
     setCurrentTrack({
      id: String(item.id),
      title: `Playing from ${item.title}`,
      artist: item.artist || "Collection",
      albumArtUrl: item.imageUrl,
      duration: 220
    });
    setIsPlaying(true);
  }

  // Filtered results (simple example)
  const filteredTracks = allTracks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.artist?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredAlbums = allAlbums.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.artist?.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredArtists = allArtists.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));


  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-blue-400">Search</h1>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                type="search"
                placeholder="What do you want to listen to? (e.g., Doraemon, Future)"
                className="w-full bg-zinc-800 border-zinc-700 pl-10 pr-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {searchTerm && (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tracks">Tracks</TabsTrigger>
                  <TabsTrigger value="albums">Albums</TabsTrigger>
                  <TabsTrigger value="artists">Artists</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4 space-y-6">
                    {filteredTracks.length === 0 && filteredAlbums.length === 0 && filteredArtists.length === 0 && <p className="text-zinc-400">No results found for "{searchTerm}". Try a different future gadget!</p>}
                    {filteredTracks.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-blue-300">Tracks</h2>
                            <div className="space-y-2">
                            {filteredTracks.map((track, index) => (
                                <SongRowItem key={`track-${index}`} {...track} onPlayPauseClick={() => playSong(track)} isPlaying={currentTrack?.title === track.title && isPlaying} isActive={currentTrack?.title === track.title} />
                            ))}
                            </div>
                        </section>
                    )}
                    {filteredAlbums.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-blue-300">Albums</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredAlbums.map(album => <MediaCard key={album.id} {...album} onClick={() => playMediaItem(album)} />)}
                            </div>
                        </section>
                    )}
                     {filteredArtists.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-3 text-blue-300">Artists</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredArtists.map(artist => <MediaCard key={artist.id} {...artist} onClick={() => playMediaItem(artist)} />)}
                            </div>
                        </section>
                    )}
                </TabsContent>
                <TabsContent value="tracks" className="mt-4 space-y-2">
                  {filteredTracks.length > 0 ? filteredTracks.map((track, index) => (
                    <SongRowItem key={`track-tab-${index}`} {...track} onPlayPauseClick={() => playSong(track)} isPlaying={currentTrack?.title === track.title && isPlaying} isActive={currentTrack?.title === track.title} />
                  )) : <p className="text-zinc-400">No tracks found for "{searchTerm}".</p>}
                </TabsContent>
                <TabsContent value="albums" className="mt-4">
                  {filteredAlbums.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredAlbums.map(album => <MediaCard key={album.id} {...album} onClick={() => playMediaItem(album)} />)}
                    </div>
                  ) : <p className="text-zinc-400">No albums found for "{searchTerm}".</p>}
                </TabsContent>
                 <TabsContent value="artists" className="mt-4">
                  {filteredArtists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredArtists.map(artist => <MediaCard key={artist.id} {...artist} onClick={() => playMediaItem(artist)} />)}
                    </div>
                  ) : <p className="text-zinc-400">No artists found for "{searchTerm}".</p>}
                </TabsContent>
              </Tabs>
            )}
            {!searchTerm && (
                <div className="text-center py-10">
                    <SearchIcon className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
                    <p className="text-zinc-400">Search for your favorite songs, artists, albums, or playlists.</p>
                    <p className="text-sm text-zinc-500">Use Doraemon's amazing search gadget!</p>
                </div>
            )}
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

export default SearchPage;