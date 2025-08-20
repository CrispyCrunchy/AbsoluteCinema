import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, movieId } = body;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });  
    }

    var playlist = await prisma.playlist.findUnique({
      where: { userId: userId },
    });
    if (playlist) {
      const existingEntry = await prisma.playlistEntry.findFirst({
        where: {
          playlistId: playlist.id,
          movieId: movieId,
        },
      });
      if (existingEntry) {
        return NextResponse.json({ error: 'Movie already exists in the playlist' }, { status: 409 });
      }
    } else {
      await prisma.playlist.create({
        data: {
          userId: userId,
        },
      });
      playlist = await prisma.playlist.findUnique({
        where: { userId: userId },
      });
    }

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 500 });
    }

    const newEntry = await prisma.playlistEntry.create({
      data: {
        playlistId: playlist.id,
        movieId: movieId,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}