import axios from "axios";

const api = {
  createMovie: async (postData: {name: string, releaseDate: string, director: string, description: string, videoFilePath: string, bannerFilePath: string}) => {
    const { data } = await axios.post("/api/create-movie", postData);
    return data;
  },
  getMovies: async () => {
    const { data } = await axios.get("/api/get-movies");
    return data;
  },
  createPlaylistEntry: async (postData: {userId: string, movieId: string}) => {
    const { data } = await axios.post("/api/create-playlist-entry", postData);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await axios.get("/api/get-current-user");
    return data;
  },
  getUserPlaylist: async (userId: string) => {
    const { data } = await axios.get("/api/get-user-playlist/" + userId);
    return data;
  },
  deletePlaylistEntry: async (playlistEntryId: string) => {
    const { data } = await axios.delete("/api/delete-playlist-entry/" + playlistEntryId);
    return data;
  },
}

export default api;