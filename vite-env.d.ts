/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly BASE_URL: string; // Base public path, injected by Vite
    // Add other environment variables here, e.g.:
    // readonly VITE_API_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  