import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET (request: NextRequest, context: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const { userId } = context.params;

    if (!session) {
      return NextResponse.json({ error: "No active session"}, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const playlist = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        playlistEntries: {
          include: {
            movie: true, // Include movie details
          },
        },
      },
    });

    return NextResponse.json(playlist, { status: 200 });
  } catch (error) {
    console.error("Error fetching user playlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}