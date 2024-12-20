import React from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  allowConcurrentPlayback: boolean;
  toggleConcurrentPlayback: () => void;
  theme: string;
  toggleTheme: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  allowConcurrentPlayback,
  toggleConcurrentPlayback,
  theme,
  toggleTheme,
}) => {
  if (!isOpen) return null; // Don't render if the settings panel is not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background shadow-lg p-6 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} aria-label="Close settings" className="text-foreground text-2xl">
            ×
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label htmlFor="allowConcurrentPlayback" className="text-sm font-medium text-foreground">
              {allowConcurrentPlayback ? "Disable Concurrent Playback" : "Enable Concurrent Playback"}
            </label>
            <Switch
              id="allowConcurrentPlayback"
              checked={allowConcurrentPlayback}
              onCheckedChange={toggleConcurrentPlayback}
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="theme" className="text-sm font-medium text-foreground">
              Dark Mode
            </label>
            <Switch
              id="theme"
              onCheckedChange={toggleTheme}
              checked={theme === "dark"}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};