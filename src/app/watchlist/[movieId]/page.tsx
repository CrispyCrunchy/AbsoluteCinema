"use client";

import Navigation from "@/components/Navigation";
import Image from "next/image";
import PlaylistPreview from "@/components/PlaylistPreview";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "next/navigation";
import { Rating } from '@smastrom/react-rating'
import Link from "next/link";

export default function watchlist() {

  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  const [ movieRating, setMovieRating ] = useState(0);

  const movie = useQuery({
    queryKey: ["movie", params.movieId],
    queryFn: () => api.getMovieById(params.movieId as string), // Example movie ID
    enabled: !!params.movieId,
  });

  const [selectedMovie, setSelectedMovie ] = useState(movie.data || null);

  useEffect(() => {
    if (movie.data && !selectedMovie) {
      setSelectedMovie(movie.data);
    }
  }, [movie, selectedMovie]);

  const reviews = useQuery({
    queryKey: ["movieReviews", selectedMovie?.id],
    queryFn: () => selectedMovie ? api.getMovieReviews(selectedMovie.id) : Promise.resolve([]),
    enabled: !!selectedMovie,
  });

  const avarage = (array: number[]) => array.reduce((a, b) => a + b, 0) / array.length;

  useEffect(() => {
    if (reviews.isSuccess && reviews.data.length > 0) {
      const ratings = reviews.data.map((review: any) => review.rating);
      setMovieRating(avarage(ratings));
    } else {
      setMovieRating(0);
    }
  }, [reviews]);

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
                        <Rating 
                          style={{ maxWidth: 100 }} 
                          value={movieRating}
                        />
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
            <div>
              <hr className="border-gray-600 mb-4" />
              <h2 className="text-xl font-bold mb-4 w-full justify-center">Reviews</h2>
              {reviews.isLoading ? <div>Loading reviews...</div> : null}
              {reviews.isError ? <div>Error loading reviews</div> : null}
              {reviews.isSuccess ? 
                <>
                  {reviews.data.length === 0 ?
                    <div>No reviews yet.</div>
                  :
                    <>
                      {reviews.data.map((review: any, index: number) => (
                        <div key={index} className="flex flex-col md:w-4/5 w-full gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              <Image 
                                src={review.userImage ?? "/images/default-avatar.png"} 
                                alt="User Profile" 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                              />
                              <Link href={`/profile/${review.id}`} className="font-bold hover:underline">
                                {review.userName ?? "Anonymous"}
                              </Link>
                            </div>
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
        </div>
      </div>
    </div>
    );
  }

  const [ userRating, setUserRating ] = useState(0);
  const [ userComment, setUserComment ] = useState("");

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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserComment(event.target.value);
  }


  const createReview = useMutation({
    mutationFn: () => {
      console.log("Creating review:", {
        userId: user.data.id,
        movieId: selectedMovie.id,});
      return api.createReview({
        userId: user.data.id,
        movieId: selectedMovie.id,
        rating: userRating,
        comment: userComment,
      });
    },
    onSuccess: () => {
      setUserComment("");
      setUserRating(0);
    }
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
                        <Rating
                          style={{ maxWidth: 100 }} 
                          value={movieRating}
                        />
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
          <hr className="border-gray-600" />
          <div className="flex flex-col lg:min-w-[64rem] w-full p-5 gap-5">
            <div className="flex flex-col lg:w-4/5 md:w-4/5 w-full gap-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Image 
                    src= {user.data?.image ?? "/images/default-avatar.jpg"} 
                    alt="User Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                  <Link href="/profile/{user.data?.id}" className="font-bold hover:underline">
                    {user.data?.name ?? "Anonymous"}
                  </Link>
                </div>
                <Rating 
                  style={{ maxWidth: 100 }} 
                  value={userRating} 
                  onChange={setUserRating}
                />
              </div>
              <div className="flex justify-between gap-4">
                <textarea 
                  value={userComment} 
                  onChange={handleChange} 
                  placeholder="Add a review..." 
                  className="grow rounded-lg bg-inherit"
                />
                <button 
                  onClick={() => { createReview.mutate(); } } 
                  className="bg-slate-500 hover:bg-slate-600 p-2 rounded-lg justify-self-end mb-0 mt-auto"
                  disabled={createReview.isPending || userRating === 0 || userComment.trim() === ""}
                >
                  {createReview.isPending ? 
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
                  : "Submit" }
                </button>
              </div> 
            </div>
            <div>
              <hr className="border-gray-600 mb-4" />
              <h2 className="text-xl font-bold mb-4 w-full justify-center">Reviews</h2>
              {reviews.isLoading ? <div>Loading reviews...</div> : null}
              {reviews.isError ? <div>Error loading reviews</div> : null}
              {reviews.isSuccess ? 
                <>
                  {reviews.data.length === 0 ?
                    <div>No reviews yet.</div>
                  :
                    <>
                      {reviews.data.map((review: any, index: number) => (
                        <div key={index} className="flex flex-col md:w-4/5 w-full gap-2">
                          <div className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                              <Image 
                                src={review.userImage ?? "/images/default-avatar.png"} 
                                alt="User Profile" 
                                width={40} 
                                height={40} 
                                className="rounded-full"
                              />
                              <Link href={`/profile/${review.id}`} className="font-bold hover:underline">
                                {review.userName ?? "Anonymous"}
                              </Link>
                            </div>
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
        </div>
      </div>
    </div>
  );
}