import axios from "axios";
import { create } from "domain";

const api = {
  createMovie: async (postData: {name: string, releaseDate: string, director: string, description: string, videoFilePath: string, bannerFilePath: string}) => {
    const { data } = await axios.post("/api/create-movie", postData);
    return data;
  },
  createPlaylistEntry: async (postData: {userId: string, movieId: string}) => {
    const { data } = await axios.post("/api/create-playlist-entry", postData);
    return data;
  },
  createReview: async (postData: {userId: string, movieId: string, rating: number, comment: string, }) => {
    const { data } = await axios.post("/api/create-review", postData);
    return data;
  },
  getMovies: async () => {
    const { data } = await axios.get("/api/get-movies");
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
  getMovieById: async (movieId: string) => {
    const { data } = await axios.get("/api/get-movie-by-id/" + movieId);
    return data;
  },
  getMovieRating: async (movieId: string) => {
    const { data } = await axios.get("/api/get-movie-rating/" + movieId);
    return data;
  },
  getMovieReviews: async (movieId: string) => {
    const { data } = await axios.get("/api/get-movie-reviews/" + movieId);
    return data;
  }, 
  deletePlaylistEntry: async (playlistEntryId: string) => {
    const { data } = await axios.delete("/api/delete-playlist-entry/" + playlistEntryId);
    return data;
  },
}

export default api;