import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma"; 

export async function DELETE ( request: NextRequest, { params }: { params: { playlistEntryId: string } }) {

  try {
    const session = await getServerSession(authOptions);
    const playlistEntryId = params.playlistEntryId;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playlistEntry = await prisma.playlistEntry.findUnique({
      where: { id: playlistEntryId },
    });

    if (!playlistEntry) {
      return NextResponse.json({ error: "Playlist entry not found" }, { status: 404 });
    }

    await prisma.playlistEntry.delete({
      where: { id: playlistEntryId },
    });

    return NextResponse.json({ message: "Playlist entry deleted successfully" }, { status: 200 });
    
  } catch (error) {
    console.error("Error deleting playlist entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}