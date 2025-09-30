import Image from "next/image";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function PlaylistPreview({ movie }: { movie: { id: string, name: string; releaseDate: string; director: string; description: string; videoFilePath: string; bannerFilePath: string } }) {
  const { id, name, releaseDate, director, description, videoFilePath, bannerFilePath } = movie;
  const { data: session, status: sessionStatus } = useSession();

  // Only run queries if authenticated
  if (sessionStatus !== "authenticated" || !session?.user) {
    return (
      <div className="flex bg-gray-500 rounded-lg m-2 p-4">
        You must be logged in to view your playlist.
      </div>
    );
  }

  // Only runs if authenticated:
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser(),
    enabled: true,
  });

  const playlist = useQuery({
    queryKey: ["playlist", user.data?.id],
    queryFn: () => user.data ? api.getUserPlaylist(user.data.id) : Promise.resolve(null),
    enabled: !!user.data,
  });

  const [addedToPlaylist, setAddedToPlaylist] = useState(false);

  const isInPlaylist =
    playlist.isSuccess &&
    Array.isArray(playlist.data) &&
    playlist.data
      .flatMap((pl: any) => pl.playlistEntries || [])
      .some((entry: any) => entry.movieId === id);

  useEffect(() => {
    if (isInPlaylist) {
      setAddedToPlaylist(true);
    } else {
      setAddedToPlaylist(false);
    }
  }, [isInPlaylist, playlist.isSuccess, id]);

  const watchMovie = useMutation({
    mutationFn: async () => {
      // Placeholder for watch movie logic
    },
    onSuccess: () => {
      // Placeholder for redirect logic
      // e.g., router.push(`/watch/${id}`);
      console.log("Redirect here after adding to playlist");
    }
  });
  
  const deletePlaylistEntry = useMutation({
    mutationFn: () => {
      if (!playlist.data) return Promise.reject("No playlist data");
      const entry = playlist.data
        .flatMap((pl: any) => pl.playlistEntries || [])
        .find((entry: any) => entry.movieId === id);
      if (!entry) return Promise.reject("Playlist entry not found");
      return api.deletePlaylistEntry(entry.id);
    },
    onSuccess: () => {
      playlist.refetch();
    }
  });

  return (
    <div className="flex bg-gray-500 rounded-lg m-2 p-4">
      <div className="relative w-1/4 h-<300>">
        <Image src={bannerFilePath} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-contain" alt="img" />
      </div>
      <div className="flex flex-col w-3/4 pl-4 h-auto">
        <div className="flex justify-between">
          <p className="font-bold text-lg">{name}</p>
          <p className="text-sm text-gray-400">{new Date(releaseDate).getFullYear()}</p>
        </div>
        <p className="text-sm mb-1 italic" >{director}</p>
        <div className="flex relative bottom-0">
          <button
            onClick={() => deletePlaylistEntry.mutate()}
            className="group flex gap-1 w-1/2 rounded-full p-2 m-1 justify-center transition-colors bg-green-600 hover:bg-red-700"
            disabled={deletePlaylistEntry.isPending}
          >
            {deletePlaylistEntry.isPending ? (
              <>
                {/* Loading spinner SVG */}
                <svg 
                  className="animate-spin" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </>
            ) : 
              <>
                {/* Tickmark SVG (visible when not hovered) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check group-hover:hidden"
                >
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                {/* X SVG (visible on hover) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24" height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x-icon lucide-x hidden group-hover:inline"
                >
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
                {/* Label changes on hover */}
                <span className="grow text-sm max-lg:hidden">
                  <span className="group-hover:hidden">In Playlist</span>
                  <span className="hidden group-hover:inline">Remove?</span>
                </span>
              </>
            }
            
          </button>
          <button className="flex justify-center gap-1 w-1/2 rounded-full hover:bg-blue-700 bg-blue-600 p-2 m-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3"/>
            </svg>
            <span className="grow text-sm max-lg:hidden">Watch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
