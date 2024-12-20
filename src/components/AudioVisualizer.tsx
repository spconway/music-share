import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  theme: string;
}

export function AudioVisualizer({ analyser, isPlaying, theme }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

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

        if (theme === "dark") {
          ctx.fillStyle = `rgb(${Math.min(200 + 150, 255)}, ${Math.min(200 + 150, 255)}, ${Math.min(200 + 150, 255)})`; // Lighter color for dark mode
        } else {
          ctx.fillStyle = `rgb(${barHeight + 100},15,117)`; // Dark mode color
        }

        ctx.fillRect(x, canvas.height - barHeight / 5, barWidth, barHeight / 5);

        x += barWidth + 1;
      }

      requestAnimationFrame(renderFrame);
    };

    if (isPlaying) {
      renderFrame();
    }

    return () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [analyser, isPlaying, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-12 rounded"
      width="600"
      height="50"
    ></canvas>
  );
}