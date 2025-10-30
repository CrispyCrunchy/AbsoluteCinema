import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(request: NextRequest, context: { params: { movieId: string } }) {
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

    const deleted = await prisma.watchedMovies.delete({
      where: { userId_movieId: { userId: user.id, movieId: movieId } },
    });

    return NextResponse.json(deleted, { status: 200 });

  } catch (error) {
    console.error("Error deleting watched movie entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}