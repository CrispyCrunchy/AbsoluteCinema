import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const postData = await request.json();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, movieId, rating, comment } = postData;

    if (!userId || !movieId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If a review by this user for this movie already exists, update it.
    const existing = await prisma.review.findFirst({
      where: { userId: user.id, movieId },
    });

    if (existing) {
      const updated = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          comment,
        }
      });
      return NextResponse.json(updated, { status: 200 });
    }

    // Otherwise, create a new review.
    const post = await prisma.review.create({
      data: {
        movieId: postData.movieId,
        userId: user.id,
        userImage: user.image,
        userName: user.name,
        rating: postData.rating,
        comment: postData.comment,
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}