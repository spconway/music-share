import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { compression  } from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/music-share/" : "/",
  plugins: [react(), compression ()],
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))