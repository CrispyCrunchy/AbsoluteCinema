"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Navigation () {

  const { data: session, status: sessionStatus } = useSession();
 
  const user = useQuery({
    queryKey: ["user"],
    queryFn: api.getCurrentUser
  });

  const playlist = useQuery({
    queryKey: ["playlist", user.data?.id],
    queryFn: () => user.data ? api.getUserPlaylist(user.data.id) : Promise.resolve(null),
    enabled: !!user.data,
  });

  return (
    <div className="flex w-full text-center gap-4">
      <Link href="/" className="bg-slate-400 hover:bg-slate-500 rounded-md p-2 text-white border-black border-x basis-1/4 text-sm self-center">
        <p className="max-md:hidden">Browse</p>
        {/* Grid SVG */}
        <svg 
          className="md:hidden m-auto" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect width="7" height="7" x="3" y="3" rx="1"/>
          <rect width="7" height="7" x="14" y="3" rx="1"/>
          <rect width="7" height="7" x="14" y="14" rx="1"/>
          <rect width="7" height="7" x="3" y="14" rx="1"/>
        </svg>
      </Link>
      <Link href="/watchlist" 
        className={
          `bg-slate-400 rounded-md p-2 text-white border-black border-x basis-1/4 text-sm self-center ${ 
            session 
              ? "hover:bg-slate-500"
              : "cursor-not-allowed opacity-50" 
            }
          `
        }
      >
        <p className="max-md:hidden">Watchlist</p>
        {/* Play SVG */}
        <svg 
          className="md:hidden m-auto" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="m9 8 6 4-6 4Z"/>
        </svg>
      </Link>
      <Link href="/profile" 
        className={
          `bg-slate-400 rounded-md p-2 text-white border-black border-x basis-1/4 text-sm self-center ${
            session 
              ? "hover:bg-slate-500" 
              : "cursor-not-allowed opacity-50"
            }
          `
        }>
        <p className="max-md:hidden">Profile</p>
        {/* User SVG */}
        <svg 
          className="md:hidden mx-auto my-auto" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </Link>
      <button onClick={
        user.isSuccess ? () => signOut() : () => redirect("/login")
      } className="bg-red-400 hover:bg-red-500 rounded-md p-2 text-white border-black border-x basis-1/4 text-sm self-center">
        <p className="max-md:hidden">
          {user.isSuccess ? "Sign Out" : "Login" }
        </p>
        {/* Log out / Log in SVG */}
        <svg 
          className="md:hidden m-auto" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
      </button>
    </div>
  );
}