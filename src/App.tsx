import React, { useState } from "react";
import { SongItem } from "./components/SongItem";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const sampleSongs = [
  { title: "Summer Vibes", previewUrl: `${import.meta.env.BASE_URL}songs/Back%20to%20the%2090%27s.mp3", dateCreated: "2023-06-15` },
  { title: "Chill Beats", previewUrl: `${import.meta.env.BASE_URL}songs/Drowning%20in%20a%20Sea%20of%20Bills.mp3", dateCreated: "2023-05-22` },
  { title: "Rock Anthem", previewUrl: `${import.meta.env.BASE_URL}songs/Playground%20of%20Hearts.mp3", dateCreated: "2023-07-01` },
  { title: "Acoustic Dreams", previewUrl: `${import.meta.env.BASE_URL}songs/The%20Secret%20of%20the%20Boy.mp3", dateCreated: "2023-06-30` },
];

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [allowConcurrentPlayback, setAllowConcurrentPlayback] = useState(false);
  const [currentPlayingSong, setCurrentPlayingSong] = useState<string | null>(null);

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handlePlayToggle = (previewUrl: string, isPlaying: boolean) => {
    if (!allowConcurrentPlayback && isPlaying) {
      setCurrentPlayingSong(previewUrl); // Set the newly playing song
    } else if (!isPlaying && currentPlayingSong === previewUrl) {
      setCurrentPlayingSong(null); // Clear the current song if it's paused
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="bg-white shadow relative">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-3xl font-bold text-gray-900">Music Stream</h1>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-8 text-gray-700 hover:text-gray-900"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            {isSettingsOpen ? <X className="h-8 w-8" /> : <Settings className="w-24 h-24" />}
          </Button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="space-y-4">
              {sampleSongs.map((song, index) => (
                <SongItem
                  key={index}
                  {...song}
                  allowConcurrentPlayback={allowConcurrentPlayback}
                  onPlayToggle={handlePlayToggle}
                  isCurrentSong={currentPlayingSong === song.previewUrl}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {isSettingsOpen && (
        <div className="absolute top-16 right-12 bg-white shadow-lg p-4 rounded-lg w-72">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="allowConcurrentPlayback" className="text-sm font-medium text-gray-700">
                Enable Concurrent Playback
              </label>
              <Switch
                id="airplane-mode"
                checked={allowConcurrentPlayback}
                onCheckedChange={() => setAllowConcurrentPlayback(!allowConcurrentPlayback)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
