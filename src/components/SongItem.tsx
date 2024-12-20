import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastProvider";
import { useTheme } from "@/context/ThemeContext";
import { AudioVisualizer } from "@/components/AudioVisualizer";

interface SongItemProps {
  title: string;
  previewUrl: string;
  dateCreated: string;
  allowConcurrentPlayback: boolean;
  onPlayToggle: (previewUrl: string, isPlaying: boolean) => void;
  isCurrentSong: boolean;
}

// Shared AudioContext to reuse across all components
const sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export function SongItem({
  title,
  previewUrl,
  dateCreated,
  allowConcurrentPlayback,
  onPlayToggle,
  isCurrentSong,
}: SongItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const toast = useToast();
  const { theme } = useTheme();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current) {
      toast.error("Audio element is not available.");
      return;
    }

    try {
      if (sharedAudioContext.state === "suspended") {
        await sharedAudioContext.resume();
      }

      if (!sourceRef.current) {
        sourceRef.current = sharedAudioContext.createMediaElementSource(audioRef.current);

        if (!analyserRef.current) {
          analyserRef.current = sharedAudioContext.createAnalyser();
          analyserRef.current.fftSize = 32768;

          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(sharedAudioContext.destination);
          sourceRef.current.connect(sharedAudioContext.destination);
        }
      }

      if (!allowConcurrentPlayback) {
        const allAudioElements = document.querySelectorAll("audio");
        allAudioElements.forEach((audio) => {
          if (audio !== audioRef.current) {
            audio.pause();
          }
        });
      }

      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlayToggle(previewUrl, true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayToggle(previewUrl, false);
      }
    } catch (error) {
      toast.error(
        `Error playing audio: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  useEffect(() => {
    if (!isCurrentSong && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isCurrentSong]);

  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
      onPlayToggle(previewUrl, false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [onPlayToggle, previewUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTimeLeft = () => {
      if (audio.duration && audio.currentTime) {
        setTimeLeft(audio.duration - audio.currentTime);
      }
    };

    const handleMetadataLoaded = () => {
      setDuration(audio.duration);
      setTimeLeft(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleMetadataLoaded);
    audio.addEventListener("timeupdate", updateTimeLeft);

    return () => {
      audio.removeEventListener("loadedmetadata", handleMetadataLoaded);
      audio.removeEventListener("timeupdate", updateTimeLeft);
    };
  }, []);

  return (
    <div className="flex flex-col p-4 bg-background text-foreground rounded-lg shadow dark:shadow-white">
      <div className="flex items-center justify-between">
        <div className="flex flex-col w-40">
          <h3 className="text-lg font-semibold truncate" title={title}>
            <a href="#" className="hover:underline">
              {title}
            </a>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{dateCreated}</p>
          {duration !== null && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {`Duration: ${formatTime(duration)}`}
            </p>
          )}
          {timeLeft !== null && isPlaying && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {`Time Left: ${formatTime(timeLeft)}`}
            </p>
          )}
        </div>
        <div className="flex-1 px-4">
          <AudioVisualizer
            analyser={analyserRef.current}
            isPlaying={isPlaying}
            theme={theme}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <a href={previewUrl} download={title}>
            <Button variant="default" size="icon" aria-label="Download">
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
      <audio ref={audioRef} src={previewUrl} className="hidden">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}