"use client";

import Navigation from "@/components/Navigation";
import Image from "next/image";
import PlaylistPreview from "@/components/PlaylistPreview";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Rating } from "../../../components/Ratings"; 

export default function watchlist() {

  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();

  const movie = useQuery({
    queryKey: ["movie", params.movieId],
    queryFn: () => api.getMovieById(params.movieId as string), // Example movie ID
    enabled: true,
  });

  const [selectedMovie, setSelectedMovie ] = useState(movie.data || null);

  useEffect(() => {
    if (movie.data && !selectedMovie) {
      setSelectedMovie(movie.data);
    }
  }, [movie, selectedMovie]);

  if (sessionStatus !== "loading" && sessionStatus !== "authenticated") {
    return (
      <div>
      <header className="flex justify-center">
        <div className="lg:w-3/5 lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
          <Navigation />
        </div>
      </header>
      <div className="flex justify-center">
        <div className="flex flex-col lg:w-3/5 lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
          <div className="flex justify-center max-lg:flex-col gap-4 h-auto">
            <div className="flex flex-col lg:w-4/5 w-full gap-4">
              {selectedMovie ?
                <>
                  <video width="auto" height="auto" controls preload="metadata">
                    <source src={selectedMovie.videoFilePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="flex gap-4">
                    <Image src={selectedMovie.bannerFilePath} alt="Gulliver's Travels" width={120} height={180} />
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between">
                        <h1 className="text-2xl font-bold">
                          {selectedMovie.name}
                        </h1>
                        <p className="text-sm text-gray-400">
                          {new Date(selectedMovie.releaseDate).toISOString().replace('-', '/').split('T')[0].replace('-', '/')}
                        </p>
                      </div>
                      <p className="text-sm mb-1 italic">
                        {selectedMovie.director}
                      </p>
                      <p className="overflow-y-auto grow text-sm">
                        {selectedMovie.description}
                      </p>
                      <div className="flex flex-row-reverse">
                        <Rating/>
                      </div>
                    </div>
                  </div>
                </>
              :
                <>
                  <div className="flex flex-col gap-4">
                    <div className="bg-black w-full h-[30rem]" />
                    <div className="flex gap-4">
                      <div className="w-1/4 h-full bg-gray-300" />
                      <div className="flex flex-col w-3/4">
                        <div className="w-1/2 rounded-full bg-gray-400 p-3 m-1" />
                        <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                        <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                        <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                        <div className="w-2/3 rounded-full bg-gray-400 p-1 m-1" />
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
          <div className="flex flex-col lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
            <div>ratings</div>
            <div>
              <div>comment form</div>
              <div>rating form</div>
              <div>submit button</div>
            </div>
            <div>reviews</div>
          </div>
        </div>
      </div>
    </div>
    );
  }

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

  const playlistEntries = Array.isArray(playlist.data)
    ? playlist.data.flatMap((pl: any) => pl.playlistEntries || [])
    : [];

  return(
    <div>
      <header className="flex justify-center">
        <div className="lg:w-3/5 lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
          <Navigation />
        </div>
      </header>
      <div className="flex justify-center">
        <div className="flex flex-col lg:w-3/5 lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
          <div className="flex max-lg:flex-col gap-4 h-auto">
            <div className="flex flex-col lg:w-3/5 w-full gap-4">
              {selectedMovie ?
                <>
                  <video width="auto" height="auto" controls preload="metadata">
                    <source src={selectedMovie.videoFilePath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="flex gap-4">
                    <Image src={selectedMovie.bannerFilePath} alt="Gulliver's Travels" width={120} height={180} />
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between">
                        <h1 className="text-2xl font-bold">
                          {selectedMovie.name}
                        </h1>
                        <p className="text-sm text-gray-400">
                          {new Date(selectedMovie.releaseDate).toISOString().replace('-', '/').split('T')[0].replace('-', '/')}
                        </p>
                      </div>
                      <p className="text-sm mb-1 italic">
                        {selectedMovie.director}
                      </p>
                      <p className="overflow-y-auto grow text-sm">
                        {selectedMovie.description}
                      </p>
                      <div className="flex flex-row-reverse">
                        <Rating/>
                      </div>
                    </div>
                  </div>
                </>
              :
                <>
                  <div className="flex flex-col gap-4">
                    <div className="bg-black w-full h-[30rem]" />
                    <div className="flex gap-4">
                      <div className="w-1/4 h-full bg-gray-300" />
                      <div className="flex flex-col w-3/4">
                        <div className="w-1/2 rounded-full bg-gray-400 p-3 m-1" />
                        <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                        <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                        <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                        <div className="w-2/3 rounded-full bg-gray-400 p-1 m-1" />
                      </div>
                    </div>
                  </div>
                </>
              }  
            </div>
            <div className="flex flex-col lg:w-2/5 w-full h-[45rem] p-5 gap-1 bg-slate-900 overflow-y-auto">
              {playlist.isLoading ? <>
                {[...Array(10)].map((videoSkeleton: any, index: any) =>
                  <div key={index} className="animate-pulse flex bg-gray-500 rounded-lg m-2 p-4">
                    <div className="w-1/4 h-full bg-gray-300" />
                    <div className="flex flex-col w-3/4">
                      <div className="w-1/2 rounded-full bg-gray-400 p-3 m-1" />
                      <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                      <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                      <div className="w-full rounded-full bg-gray-400 p-1 m-1" />
                      <div className="w-2/3 rounded-full bg-gray-400 p-1 m-1" />
                      <div className="flex">
                        <div className="w-1/2 rounded-full bg-blue-600 p-5 m-1" />
                        <div className="w-1/2 rounded-full bg-blue-600 p-5 m-1" />
                      </div>
                    </div>
                  </div>
                )} 
              </> : null}
              {playlist.isError ? <div className="flex justify-center">Error loading movies</div> : null}
              {playlist.isSuccess ? <>
                {playlistEntries.map((entry: any, index: any) => (
                  <PlaylistPreview movie={entry.movie} key={index} />
                ))}
              </>: null}
            </div>
          </div>
          <div className="flex flex-col lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
            <div>ratings</div>
            <div>
              <div>comment form</div>
              <div>rating form</div>
              <div>submit button</div>
            </div>
            <div>reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}