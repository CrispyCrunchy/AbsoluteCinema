import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET (request: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      !session.user ||
      (session.user as { id?: string }).id !== userId
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playlist = await prisma.playlist.findMany({
      where: {
        userId: userId,
      },
      include: {
        playlistEntries: true, // Include movie details
      },
    });

    return NextResponse.json(playlist, { status: 200 });
  } catch (error) {
    console.error("Error fetching user playlist:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}