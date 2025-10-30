import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest, context: { params: { movieId: string } }) {
  try {
    const { movieId } = await context.params;
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "No active session"}, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const watchedMovie = await prisma.watchedMovies.findUnique({
      where: { userId_movieId: { userId: user.id, movieId: movieId } },
    });

    if (!watchedMovie) {
      return NextResponse.json(false, { status: 200 });
    }

    return NextResponse.json(true, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}