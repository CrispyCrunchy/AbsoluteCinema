import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, releaseDate, director, description, videoFilePath, bannerFilePath } = body;

    if (!name || !releaseDate || !director || !description || !videoFilePath || !bannerFilePath) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMovie = await prisma.movie.create({
      data: {
        name: name,
        releaseDate: new Date(releaseDate),
        director: director,
        description: description,
        videoFilePath: videoFilePath,
        bannerFilePath: bannerFilePath,
      },
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}