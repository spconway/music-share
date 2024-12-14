import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/context/ToastProvider';

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

export function SongItem({ title, previewUrl, dateCreated, allowConcurrentPlayback, onPlayToggle, isCurrentSong }: SongItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const toast = useToast();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const togglePlay = async () => {
    if (!audioRef.current) {
      toast.error('Audio element is not available.');
      return;
    }
  
    try {
      // Resume the AudioContext if suspended
      if (sharedAudioContext.state === "suspended") {
        await sharedAudioContext.resume();
        console.log("AudioContext resumed");
      }
    
      // Setup audio connections only once
      if (!sourceRef.current) {
        sourceRef.current = sharedAudioContext.createMediaElementSource(audioRef.current);
    
        if (!analyserRef.current) {
          analyserRef.current = sharedAudioContext.createAnalyser();
          analyserRef.current.fftSize = 32768;
    
          sourceRef.current.connect(analyserRef.current); // Connect source to analyser
          analyserRef.current.connect(sharedAudioContext.destination); // Connect analyser to speakers
          sourceRef.current.connect(sharedAudioContext.destination); // Ensure sound reaches speakers
          console.log("Audio connections established");
        }
      }
    
      // Handle playback based on concurrent playback setting
      if (!allowConcurrentPlayback) {
        const allAudioElements = document.querySelectorAll('audio');
        allAudioElements.forEach((audio) => {
          if (audio !== audioRef.current) {
            audio.pause();
          }
        });
      }
    
      // Toggle playback
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlayToggle(previewUrl, true);
        console.log("Audio playing");
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
        onPlayToggle(previewUrl, false);
        console.log("Audio paused");
      }
    } catch (error) {
      toast.error(`Error playing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  
  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;
  
    const analyser = analyserRef.current;
    if (!analyser) return;
  
    const canvas = canvasRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvas.getContext("2d");
  
    const renderFrame = () => {
      if (!ctx || !isPlaying) return;
  
      analyser.getByteFrequencyData(dataArray);
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
  
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
  
        ctx.fillStyle = `rgb(${barHeight + 100},15,117)`;
        ctx.fillRect(x, canvas.height - barHeight / 5, barWidth, barHeight / 5);
  
        x += barWidth + 1;
      }
  
      requestAnimationFrame(renderFrame);
    };
  
    if (isPlaying) {
      renderFrame();
    }
  
    return () => {
      if (analyser) {
        analyser.disconnect();
      }
    };
  }, [isPlaying]);

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

    audio.addEventListener('loadedmetadata', handleMetadataLoaded);
    audio.addEventListener('timeupdate', updateTimeLeft);

    return () => {
      audio.removeEventListener('loadedmetadata', handleMetadataLoaded);
      audio.removeEventListener('timeupdate', updateTimeLeft);
    };
  }, []);

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex flex-col w-40">
          <h3 className="text-lg font-semibold truncate" title={title}>
            <a href="#" className="hover:underline">{title}</a>
          </h3>
          <p className="text-sm text-gray-500">{dateCreated}</p>
          {duration !== null && (
            <p className="text-sm text-gray-500">
              {`Duration: ${formatTime(duration)}`}
            </p>
          )}
          {timeLeft !== null && isPlaying && (
            <p className="text-sm text-gray-500">
              {`Time Left: ${formatTime(timeLeft)}`}
            </p>
          )}
        </div>
        <div className='flex-1 px-4'>
          <canvas
            ref={canvasRef}
            className="w-full h-12 bg-gray-100 rounded"
            width="600"
            height="50"
          ></canvas>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <a href={previewUrl} download={title}>
            <Button variant="outline" size="icon" aria-label="Download">
              <Download className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
      {/* <canvas
        ref={canvasRef}
        className="w-full h-24 mt-4 bg-gray-100 rounded"
        width="600"
        height="100"
      ></canvas> */}
      <audio ref={audioRef} src={previewUrl} className="hidden">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
