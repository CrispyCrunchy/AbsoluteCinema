import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: NextRequest, context: { params: { movieId: string } }) {
  try {
    const { movieId } = context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No active session"}, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await prisma.watchedMovies.findUnique({
      where: { userId_movieId: { userId: user.id, movieId: movieId } },
    });

    if (existing) {
      return NextResponse.json({ message: "Already marked as watched" }, { status: 200 });
    }

    const watchedMovie = await prisma.watchedMovies.create({
      data: {
        userId: user.id,
        movieId: movieId,
      },
    });

    return NextResponse.json(watchedMovie, { status: 201 });
  } catch (error) {
    console.error("Error creating watched movie entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}