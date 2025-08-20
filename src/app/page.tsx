"use client";

import Navigation from "@/components/Navigation";
import VideoPreview from "@/components/VideoPreview";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function Home() {

  let movies = useQuery({
    queryKey: ["movies"],
    queryFn: () => api.getMovies()
  });

  return (
    <div>
      <header className="flex justify-center">
        <div className="lg:w-3/5 lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
          <Navigation />
        </div>
      </header>
      <div className="flex justify-center">
        <div className="md:grid md:grid-cols-2 lg:w-3/5 lg:min-w-[64rem] flex flex-col w-full h-auto bg-slate-800">
          {movies.isLoading ? <>
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
          {movies.isError ? <div className="flex justify-center">Error loading movies</div> : null}
          {movies.isSuccess ? <>
            {movies.data.map((movie: any, index: any) => (
              <VideoPreview movie={movie} key={index} />
            ))}
          </>: null}
        </div>
      </div>
    </div>
  );
}
