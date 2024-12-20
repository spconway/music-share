export interface Song {
    title: string;
    url: string;
    dateCreated: string;
  }
  
  /**
   * Fetches the song data from the songs.json file and prepends the BASE_URL to each song URL.
   */
  export const fetchSongs = async (): Promise<Song[]> => {
    try {
      const response = await fetch("/songs/songs.json");
      console.log("Fetch response:", response);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch songs: ${response.statusText}`);
      }
  
      const text = await response.text();
      console.log("Raw response text:", text);
  
      const songs: Song[] = JSON.parse(text); // Parse manually to see if JSON.parse throws errors
      console.log("Parsed songs:", songs);
  
      return songs.map((song) => ({
        ...song,
        url: `${import.meta.env.BASE_URL}${song.url}`, // Prepend BASE_URL
      }));
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  };