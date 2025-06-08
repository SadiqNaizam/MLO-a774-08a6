import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import MediaCard from '@/components/MediaCard';
import DoraemonThemedPlayerControls from '@/components/DoraemonThemedPlayerControls';
import { Button } from '@/components/ui/button'; // For potential quick actions

// Define types within the file or import if they were in a shared types file
interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  duration: number; // in seconds
}

interface MediaCardItem {
  id: string | number;
  title: string;
  artist?: string;
  imageUrl: string;
  type: 'album' | 'playlist' | 'artist';
}

const samplePlayerTrack: TrackInfo = {
  id: 'dora_theme_song_001',
  title: 'Doraemon no Uta',
  artist: 'Kumiko Osugi',
  albumArtUrl: 'https://source.unsplash.com/random/100x100?doraemon,music',
  duration: 185,
};

const featuredPlaylists: MediaCardItem[] = [
  { id: 'playlist_adv_1', title: 'Anywhere Door Adventures', artist: 'Soundtracks for Travel', imageUrl: 'https://source.unsplash.com/random/200x200?playlist,adventure,blue', type: 'playlist' },
  { id: 'playlist_gadget_2', title: 'Future Gadget Funk', artist: 'Upbeat & Electronic', imageUrl: 'https://source.unsplash.com/random/200x200?playlist,future,tech', type: 'playlist' },
  { id: 'playlist_chill_3', title: 'Relax with Dorami', artist: 'Calm & Soothing', imageUrl: 'https://source.unsplash.com/random/200x200?playlist,chill,yellow', type: 'playlist' },
  { id: 'playlist_study_4', title: 'Nobita\'s Study Time', artist: 'Focus & Concentration', imageUrl: 'https://source.unsplash.com/random/200x200?playlist,study,calm', type: 'playlist' },
  { id: 'playlist_party_5', title: 'Gian\'s Birthday Bash', artist: 'Party Hits', imageUrl: 'https://source.unsplash.com/random/200x200?playlist,party,loud', type: 'playlist' },
];

const newReleases: MediaCardItem[] = [
  { id: 'album_dora_1', title: 'Pocket Grooves', artist: 'The Future Gadgets', imageUrl: 'https://source.unsplash.com/random/200x201?album,robot,blue', type: 'album' },
  { id: 'album_nobi_2', title: 'Dreamy Beats', artist: 'Sleepy Town Melodies', imageUrl: 'https://source.unsplash.com/random/200x202?album,dream,stars', type: 'album' },
  { id: 'album_shizu_3', title: 'Violin Serenade', artist: 'Serene Strings', imageUrl: 'https://source.unsplash.com/random/200x203?album,violin,pink', type: 'album' },
  { id: 'album_sune_4', title: 'Smooth City Jazz', artist: 'Richy Fox Trio', imageUrl: 'https://source.unsplash.com/random/200x204?album,jazz,city', type: 'album' },
  { id: 'album_recent_5', title: 'Time Travel Hits', artist: 'Chronos Band', imageUrl: 'https://source.unsplash.com/random/200x205?album,time,clock', type: 'album' },
];


const HomePage: React.FC = () => {
  console.log('HomePage loaded');

  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(samplePlayerTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0); // Example progress

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume);
  const handleSeek = (newProgress: number) => setProgress(newProgress); // Simplified seek
  
  const handleMediaCardClick = (id: string | number, type: 'album' | 'playlist' | 'artist') => {
    console.log(`MediaCard clicked: ${type} - ${id}`);
    // Example: Load a track from the clicked item
    const newTrackTitle = featuredPlaylists.find(p => p.id === id)?.title || newReleases.find(a => a.id === id)?.title || "Sample Track";
    setCurrentTrack({
        id: String(id),
        title: newTrackTitle,
        artist: "Various Artists",
        albumArtUrl: `https://source.unsplash.com/random/100x100?${type},${id}`,
        duration: 200 + Math.floor(Math.random() * 100)
    });
    setIsPlaying(true);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64"> {/* Sidebar width w-64 */}
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-10">
            <header>
              <h1 className="text-4xl font-bold text-blue-400">Welcome to DoraMusic!</h1>
              <p className="text-zinc-400 mt-1">Discover your next favorite tune, powered by Doraemon's future gadgets.</p>
            </header>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Featured Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {featuredPlaylists.map(item => (
                  <MediaCard key={item.id} {...item} onClick={handleMediaCardClick} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">New Releases</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {newReleases.map(item => (
                  <MediaCard key={item.id} {...item} onClick={handleMediaCardClick} />
                ))}
              </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-300">Recently Played</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {newReleases.slice(0,5).reverse().map(item => ( // Mock recently played
                    <MediaCard key={`recent-${item.id}`} {...item} title={`Recently: ${item.title}`} onClick={handleMediaCardClick} />
                    ))}
                </div>
            </section>
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
          onToggleShuffle={() => console.log('Toggle shuffle')}
          onToggleRepeat={() => console.log('Toggle repeat')}
        />
      </div>
    </div>
  );
};

export default HomePage;