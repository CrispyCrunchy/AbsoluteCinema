"use client";

import Navigation from "@/components/Navigation";
import PlaylistPreview from "@/components/PlaylistPreview";
import Image from "next/image";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Rating } from "@smastrom/react-rating";

export default function profile() {

  const params = useParams();
  const [editMode, setEditMode] = useState(false);
  const [aboutText, setAboutText] = useState("");

  const user = useQuery({
    queryKey: ['user', params.userId],
    queryFn: () => api.getUserById(params.userId as string),
    enabled: !!params.userId,
  });

  const currentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => api.getCurrentUser(),
  });

  const playlist = useQuery({
    queryKey: ['playlist', params.userId],
    queryFn: () => api.getUserPlaylist(params.userId as string),
    enabled: !!params.userId,
  });

  const playlistEntries = Array.isArray(playlist.data)
    ? playlist.data.flatMap((pl: any) => pl.playlistEntries || [])
    : [];

  useEffect(() => {
    if (user.data?.about) {
      setAboutText(user.data.about);
    }
  }, [user.data]);

  const userReviews = useQuery({
    queryKey: ["movieReviews", user.data?.id],
    queryFn: () => user.data?.id ? api.getUserReviews(user.data.id) : Promise.resolve([]),
    enabled: !!user,
  });

  useEffect(() => {
    if (!editMode && aboutText !== (user.data?.about || "")) {
      api.editAboutUser(user.data.id, aboutText).then(() => {
        user.refetch();
      });
    }
  }, [editMode]);

  return(
    <div>
      <header className="flex justify-center">
        <div className="lg:w-3/5 lg:min-w-[64rem] w-full p-5 gap-4 bg-slate-900">
          <Navigation />
        </div>
      </header>
      <div className="flex justify-center">
        <div className="flex max-sm:flex-col lg:w-3/5 w-full lg:min-w-[64rem] p-5 gap-4 bg-slate-900 justify-between">
          <div className="flex flex-col w-full gap-4">
            <div className="flex">
              <div className="flex flex-col">
                <Image 
                  src={user.data?.image ?? "/images/default-avatar.jpg"} 
                  alt="Profile Picture"
                  width={180}
                  height={180}
                  className="rounded-full mx-auto mt-8"
                />
                <h1 className="text-lg font-bold text-center mt-4 text-white">
                  {user.data?.name ?? "User"}
                </h1>
              </div>
              <div className="relative w-full flex flex-col">
                <textarea 
                  className="h-full w-4/5 m-8 p-4 text-white bg-slate-700 rounded-lg"
                  readOnly={!editMode}
                  disabled={!editMode}
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                />
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`absolute bottom-0 right-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                    currentUser.data?.id === user.data?.id ? "" : " hidden"
                  }`}
                >
                  {editMode ? "Save" : "Edit"}
                </button>
              </div>
            </div>
            <hr className="border-gray-600 mb-4" />
            <div className="flex flex-col gap-4">
              <h2 className="flex text-lg underline justify-center">Reviews by {user.data?.name ?? "User"}</h2>
              {userReviews.isLoading ? <div>Loading reviews...</div> : null}
              {userReviews.isError ? <div>Error loading reviews</div> : null}
              {userReviews.isSuccess ? 
                <>
                  {userReviews.data.length === 0 ?
                    <div>No reviews yet.</div>
                  :
                    <>
                      {userReviews.data.map((review: any, index: number) => (
                        <div key={index} className="flex flex-col w-full gap-2">
                          <div className="flex gap-4 items-center">
                            <Image 
                              src={review.userImage ?? "/images/default-avatar.png"} 
                              alt="User Profile" 
                              width={40} 
                              height={40} 
                              className="rounded-full"
                            />
                            {review.userName ?? "Anonymous"}
                          </div>
                          <div className="flex justify-between items-center">
                            <Link href={`/watchlist/${review.movieId}`} className="font-bold text-lg hover:underline">
                              {review.movieTitle}
                            </Link>
                            <Rating 
                              style={{ maxWidth: 100 }} 
                              value={review.rating} 
                              readOnly
                            />
                          </div>
                          <div className="flex justify-between gap-4">
                            {review.comment}
                          </div> 
                        </div>
                      ))}
                    </>}
                </>
              : null }
            </div>
          </div>
          <div className="flex flex-col md:w-3/5 w-full h-full p-4 bg-slate-900 overflow-y-auto">
            {playlist.isLoading ? <>
              {[...Array(4)].map((videoSkeleton: any, index: any) =>
                <div key={index} className="animate-pulse flex bg-gray-500 rounded-lg m-2 p-4">
                  <div className="w-1/4 h-full bg-gray-300" />
                  <div className="flex flex-col w-3/4">
                    <div className="w-1/2 rounded-full bg-gray-400 p-3 m-1" />
                    <div className="w-1/3 rounded-full bg-gray-400 p-1 m-1" />
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
      </div>
    </div>
  )
}