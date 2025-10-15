import { NextRequest, NextResponse } from "next/server";

export async function Post(request: NextRequest) {
  try {
    const body = await request.json();
    const { movieId, userId, rating, comment } = body;
    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    if (!comment) {
      return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
    }

  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}