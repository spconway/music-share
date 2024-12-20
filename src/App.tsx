import React, { useState, useEffect } from "react";
import { SongItem } from "./components/SongItem";
import { Settings } from "./components/Settings";
import { Settings as SettingsIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./context/ThemeContext";
import { fetchSongs, Song } from "./services/songService";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allowConcurrentPlayback, setAllowConcurrentPlayback] = useState(false);
  const [currentPlayingSong, setCurrentPlayingSong] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  const { toggleTheme, theme } = useTheme();

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleConcurrentPlayback = () => setAllowConcurrentPlayback(!allowConcurrentPlayback);

  const handlePlayToggle = (previewUrl: string, isPlaying: boolean) => {
    if (!allowConcurrentPlayback && isPlaying) {
      setCurrentPlayingSong(previewUrl); // Set the newly playing song
    } else if (!isPlaying && currentPlayingSong === previewUrl) {
      setCurrentPlayingSong(null); // Clear the current song if it's paused
    }
  };

  // Fetch songs on app initialization
  useEffect(() => {
    const loadSongs = async () => {
      const songs = await fetchSongs();
      setSongs(songs);
    };
  
    loadSongs();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <header className="bg-background text-foreground shadow dark:shadow-white relative">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-3xl font-bold">Music Stream</h1>
          <Button
            variant="ghost"
            className="absolute top-4 right-8"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <SettingsIcon className="w-24 h-24" />
          </Button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-4">
              {songs.map((song, index) => (
                <SongItem
                  key={index}
                  title={song.title}
                  previewUrl={song.url}
                  dateCreated={song.dateCreated}
                  allowConcurrentPlayback={allowConcurrentPlayback}
                  onPlayToggle={handlePlayToggle}
                  isCurrentSong={currentPlayingSong === song.url}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Settings
        isOpen={isSettingsOpen}
        onClose={toggleSettings}
        allowConcurrentPlayback={allowConcurrentPlayback}
        toggleConcurrentPlayback={toggleConcurrentPlayback}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;