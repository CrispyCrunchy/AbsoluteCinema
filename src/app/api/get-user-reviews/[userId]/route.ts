import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest, context: { params: { userId: string } }) {
  try {
    const { userId } = await context.params;

    const reviews = await prisma.review.findMany({
      where: { userId: userId },
    });

    if (!reviews) {
      return NextResponse.json({ error: "reviews not found" }, { status: 404 });
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}