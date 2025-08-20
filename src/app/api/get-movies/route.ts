import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest) {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        releaseDate: "desc",
      },
    });

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}