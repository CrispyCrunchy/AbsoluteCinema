"use client";

import Navigation from "@/components/Navigation";
import Image from "next/image";
import VideoPreview from "@/components/VideoPreview";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function watchlist() {

  let movies = useQuery({
    queryKey: ["movies"],
    queryFn: () => api.getMovies()
  });

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
              <video width="auto" height="auto" controls preload="metadata">
                <source src="/video/gullivers_travels1939_512kb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="flex gap-4">
                <Image src="/images/gullivers-travels.jpg" alt="Gulliver's Travels" width={120} height={180} />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Gulliver's Travels</h1>
                    <p className="text-sm text-gray-400">1939-12-22</p>
                  </div>
                  <p className="text-sm mb-1 italic">Dave Fleischer</p>
                  <p className="overflow-y-auto grow text-sm">A doctor washes ashore on an island inhabited by little people.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:w-2/5 w-full h-[45rem] p-5 gap-4 bg-slate-900 overflow-y-auto">
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

  )
}