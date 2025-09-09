import Image from "next/image";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function VideoPreview({ movie }: { movie: { id: string, name: string; releaseDate: string; director: string; description: string; videoFilePath: string; bannerFilePath: string } }) {
  const { id, name, releaseDate, director, description, videoFilePath, bannerFilePath } = movie;
  const { data: session, status: sessionStatus } = useSession();

  // Only run queries if authenticated
  if (sessionStatus !== "authenticated" || !session?.user) {
    return (
      <div className="flex bg-gray-500 rounded-lg m-2 p-4">
        <div className="relative w-1/4 h-<300>">
          <Image src={bannerFilePath} fill objectFit="contain" alt="img" />
        </div>
        <div className="flex flex-col w-3/4 pl-4 h-[11rem]">
          <div className="flex justify-between">
            <p className="font-bold text-lg">{name}</p>
            <p className="text-sm text-gray-400">{new Date(releaseDate).getFullYear()}</p>
          </div>
          <p className="text-sm mb-1 italic" >{director}</p>
          <p className="overflow-y-auto grow text-sm">{description}</p>
          <button className="flex justify-center gap-1 w-1/2 rounded-full hover:bg-blue-700 bg-blue-600 p-2 m-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3"/>
            </svg>
            <span className="grow text-sm max-lg:hidden">Watch</span>
          </button>
        </div>
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

  useEffect(() => {
    if (
      playlist.isSuccess &&
      playlist.data?.playlistEntries &&
      playlist.data.playlistEntries.some((entry: any) => entry.movieId === id)
    ) {
      setAddedToPlaylist(true);
    } else {
      setAddedToPlaylist(false);
    }
  }, [playlist.isSuccess, playlist.data, id]);

  const createPlaylistEntry = useMutation({
    mutationFn: () => api.createPlaylistEntry({
      userId: user.data.id,
      movieId: id,
    }),
    onSuccess: () => {
      playlist.refetch();
    }
  });

  return (
    <div className="flex bg-gray-500 rounded-lg m-2 p-4">
      <div className="relative w-1/4 h-<300>">
        <Image src={bannerFilePath} fill objectFit="contain" alt="img" />
      </div>
      <div className="flex flex-col w-3/4 pl-4 h-[11rem]">
        <div className="flex justify-between">
          <p className="font-bold text-lg">{name}</p>
          <p className="text-sm text-gray-400">{new Date(releaseDate).getFullYear()}</p>
        </div>
        <p className="text-sm mb-1 italic" >{director}</p>
        <p className="overflow-y-auto grow text-sm">{description}</p>
        <div className="flex relative bottom-0">
          <button
            onClick={() => createPlaylistEntry.mutate()}
            className={
              "flex gap-1 w-1/2 rounded-full p-2 m-1 justify-center" +
              (addedToPlaylist
                ? " bg-green-600 hover:bg-green-700"
                : " bg-blue-600 hover:bg-blue-700")
            }
            disabled={addedToPlaylist}
          >
            {createPlaylistEntry.isPending ? (
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : addedToPlaylist ? (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
                <span className="grow text-sm max-lg:hidden">In Playlist</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="M12 5v14"/>
                </svg>
                <span className="grow text-sm max-lg:hidden">Add to Playlist</span>
              </>
            )}
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
