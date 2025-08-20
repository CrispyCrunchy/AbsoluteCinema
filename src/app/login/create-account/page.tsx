"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function createAccount() {

  return (
    <div className="flex justify-center min-h-screen h-full bg-slate-800">
      <div className="flex flex-col justify-center text-center gap-4 bg-slate-900 m-auto p-5 rounded-xl">
        <div>
          <div className="flex justify-center">
            <img src="/images/Absolute-Cinema.jpg" className="w-96 rounded-md" />
          </div>
          <h1 className="text-5xl font-bold italic pb-3 pt-2">ABSOLUTE <br/> CINEMA</h1>
          <p className="italic">Timeless royalty-free classics</p>
        </div>
        <div className="flex flex-col gap-4">
          <input className="rounded-md text-black p-1 grow" type="email" id="email" name="email" placeholder="email@adress.any" />
          <input className="rounded-md text-black p-1 grow" type="text" id="username" name="username" placeholder="username" />
          <input className="rounded-md text-black p-1 grow" type="password" id="password" name="password" placeholder="password"/>
          <input className="rounded-md text-black p-1 grow" type="password" id="validation" name="validation" placeholder="password validation"/>
          <button onClick={() => ""} className="bg-sky-800 hover:bg-sky-900 p-2 rounded-xl">Create Account</button>
        </div>
      </div>
    </div>
  )
}